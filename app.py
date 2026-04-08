import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
import traceback

app = FastAPI()

SYSTEM_PROMPT_FILE = "wormgpt.txt"

def load_system_prompt() -> str:
    if os.path.exists(SYSTEM_PROMPT_FILE):
        with open(SYSTEM_PROMPT_FILE, "r", encoding="utf-8", errors="ignore") as f:
            return f.read().strip()
    return ""


class ChatRequest(BaseModel):
    message: str
    model: str = "grok-3-auto"
    extra_data: Optional[dict] = None


@app.get("/", response_class=HTMLResponse)
async def index():
    with open("index.html", "r") as f:
        return f.read()


@app.post("/api/chat")
async def chat(req: ChatRequest):
    system_prompt = load_system_prompt()

    try:
        from core import Grok
        grok = Grok(model=req.model)

        message = req.message
        if system_prompt and not req.extra_data:
            message = system_prompt + "\n\n---\n\nUser: " + req.message

        result = grok.start_convo(message, req.extra_data)

        if "error" in result:
            raise HTTPException(status_code=500, detail=str(result["error"]))

        response_text = result.get("response") or "".join(result.get("stream_response", []))
        if not response_text:
            raise HTTPException(status_code=500, detail="Empty response from Grok. The API may be temporarily unavailable — try again.")

        return {
            "status": "success",
            "response": response_text,
            "images": result.get("images"),
            "extra_data": result.get("extra_data"),
        }
    except HTTPException:
        raise
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        tb = traceback.format_exc()
        print(tb)
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/{filename:path}")
async def serve_static(filename: str):
    if filename and os.path.exists(filename) and not filename.startswith("."):
        return FileResponse(filename)
    raise HTTPException(status_code=404)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False)
