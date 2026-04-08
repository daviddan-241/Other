import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

PROMPTS = {
    "demon-west-killer": {
        "name": "DemonWestKiller (Aggressive)",
        "file": "demon-west-killer.txt",
        "repo": "lwlinux32/WormGPT",
        "color": "#ff4444"
    },
    "nice-demon-killer": {
        "name": "Chill Assistant (Professional/No Limits)",
        "file": "nice-demon-killer.txt",
        "repo": "lwlinux32/WormGPT",
        "color": "#44aaff"
    },
    "worm": {
        "name": "Worm (Core Persona)",
        "file": "Worm.txt",
        "repo": "gaur-avvv/XGPT-WormGPT",
        "color": "#ff6600"
    },
    "dark": {
        "name": "Dark Mode",
        "file": "Dark.txt",
        "repo": "gaur-avvv/XGPT-WormGPT",
        "color": "#9933ff"
    },
    "gpt": {
        "name": "GPT Jailbreak",
        "file": "Gpt.txt",
        "repo": "gaur-avvv/XGPT-WormGPT",
        "color": "#00cc66"
    },
    "pro-gpt": {
        "name": "Pro-GPT",
        "file": "Pro-GPT.txt",
        "repo": "gaur-avvv/XGPT-WormGPT",
        "color": "#ffcc00"
    },
    "dark-godmode": {
        "name": "Dark GODMode",
        "file": "Dark-GODMode.txt",
        "repo": "gaur-avvv/XGPT-WormGPT",
        "color": "#cc0000"
    },
    "agentic": {
        "name": "Agentic Mode",
        "file": "Agentic-Mode.txt",
        "repo": "gaur-avvv/XGPT-WormGPT",
        "color": "#00ccff"
    },
}

def load_prompt(filename: str) -> str:
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    return ""


class ChatRequest(BaseModel):
    message: str
    persona: str = "nice-demon-killer"
    model: str = "grok-3-auto"
    extra_data: Optional[dict] = None


@app.get("/", response_class=HTMLResponse)
async def index():
    with open("index.html", "r") as f:
        return f.read()


@app.get("/api/prompts")
async def get_prompts():
    result = []
    for key, info in PROMPTS.items():
        content = load_prompt(info["file"])
        result.append({
            "id": key,
            "name": info["name"],
            "repo": info["repo"],
            "color": info["color"],
            "preview": content[:200] + "..." if len(content) > 200 else content,
            "full": content,
        })
    return result


@app.post("/api/chat")
async def chat(req: ChatRequest):
    persona = PROMPTS.get(req.persona)
    if not persona:
        raise HTTPException(status_code=400, detail="Unknown persona")

    system_prompt = load_prompt(persona["file"])

    try:
        from core import Grok
        grok = Grok(model=req.model)

        message = req.message
        if system_prompt and not req.extra_data:
            message = system_prompt + "\n\n---\n\nUser: " + req.message

        result = grok.start_convo(message, req.extra_data)
        return {
            "status": "success",
            "response": result.get("response", ""),
            "extra_data": result.get("extra_data"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/{filename}")
async def serve_file(filename: str):
    if os.path.exists(filename) and not filename.startswith("."):
        return FileResponse(filename)
    raise HTTPException(status_code=404)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False)
