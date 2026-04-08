import os
import json
import traceback
import requests as req_lib
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

SYSTEM_PROMPT_FILE = "wormgpt.txt"
SERVER_OR_KEY   = os.environ.get("OPENROUTER_API_KEY", "")
SERVER_OR_MODEL = os.environ.get("OPENROUTER_MODEL", "deepseek/deepseek-chat-v3-0324:free")
OPENROUTER_URL  = "https://openrouter.ai/api/v1/chat/completions"


def load_system_prompt() -> str:
    if os.path.exists(SYSTEM_PROMPT_FILE):
        with open(SYSTEM_PROMPT_FILE, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    return ""


def chat_openrouter(message: str, history: list, system: str, api_key: str, model: str) -> dict:
    messages = [{"role": "system", "content": system}] if system else []
    for h in (history or []):
        if isinstance(h, dict) and "role" in h and "content" in h:
            messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": message})

    resp = req_lib.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://wormgpt.replit.app",
            "X-Title": "WormGPT",
        },
        json={
            "model": model,
            "messages": messages,
            "temperature": 1.1,
            "max_tokens": 2048,
        },
        timeout=60,
    )

    if resp.status_code != 200:
        raise RuntimeError(f"OpenRouter error {resp.status_code}: {resp.text[:400]}")

    data = resp.json()
    text = data["choices"][0]["message"]["content"]
    return {"response": text, "history": messages + [{"role": "assistant", "content": text}]}


def chat_grok(message: str, extra_data: dict, model: str, system: str) -> dict:
    from core import Grok
    grok = Grok(model=model)
    full_msg = (system + "\n\n---\n\nUser: " + message) if system and not extra_data else message
    result = grok.start_convo(full_msg, extra_data)
    if isinstance(result, dict) and "error" in result and result["error"]:
        raise RuntimeError(str(result["error"]))
    response_text = result.get("response") or "".join(result.get("stream_response", []))
    if not response_text:
        raise RuntimeError("Empty response from Grok API")
    return {"response": response_text, "extra_data": result.get("extra_data")}


class ChatRequest(BaseModel):
    message: str
    model: str = "grok-3-auto"
    extra_data: Optional[dict] = None
    history: Optional[list] = None


@app.get("/", response_class=HTMLResponse)
async def index():
    with open("index.html", "r") as f:
        return f.read()


@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    system = load_system_prompt()

    # Accept API key from request header (user's browser settings) or server env
    client_key   = request.headers.get("X-OpenRouter-Key", "").strip()
    client_model = request.headers.get("X-OpenRouter-Model", "").strip()

    or_key   = client_key or SERVER_OR_KEY
    or_model = client_model or SERVER_OR_MODEL

    if or_key:
        try:
            result = chat_openrouter(req.message, req.history, system, or_key, or_model)
            return {
                "status": "success",
                "response": result["response"],
                "history": result["history"],
                "backend": "openrouter",
            }
        except Exception as e:
            print(f"[OpenRouter error] {e} — trying Grok fallback")

    # Grok fallback
    try:
        result = chat_grok(req.message, req.extra_data, req.model, system)
        return {
            "status": "success",
            "response": result["response"],
            "extra_data": result.get("extra_data"),
            "backend": "grok",
        }
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/status")
async def status():
    return {
        "openrouter": bool(SERVER_OR_KEY),
        "model": SERVER_OR_MODEL if SERVER_OR_KEY else "grok (reverse-engineered)",
    }


@app.get("/{filename:path}")
async def serve_static(filename: str):
    if filename and os.path.exists(filename) and not filename.startswith("."):
        return FileResponse(filename)
    raise HTTPException(status_code=404)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False)
