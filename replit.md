# XGPT-WormGPT Chat

## Project Overview
A combined web chat application merging two GitHub repositories:
- **gaur-avvv/XGPT-WormGPT** — prompt library (Worm, Dark, GPT, Pro-GPT, Dark-GODMode, Agentic-Mode)
- **lwlinux32/WormGPT** — reverse-engineered Grok API engine + DemonWestKiller & Chill Assistant personas

## Tech Stack
- **Backend**: FastAPI (Python) on port 5000
- **Frontend**: Vanilla HTML/CSS/JS chat interface served by FastAPI
- **AI Engine**: Reverse-engineered Grok API wrapper (curl_cffi, coincurve)

## Project Structure
```
app.py                  # FastAPI app — serves frontend + /api/chat and /api/prompts
index.html              # Chat UI (dark-themed, sidebar with all 8 personalities)
core/                   # Grok API engine (from lwlinux32/WormGPT)
  __init__.py
  grok.py
  headers.py
  logger.py
  runtime.py
  reverse/
    anon.py
    parser.py
    xctid.py
  mappings/
    grok.json
    txid.json
demon-west-killer.txt   # Aggressive persona prompt
nice-demon-killer.txt   # Chill assistant persona prompt
Worm.txt                # Core WormGPT persona
Dark.txt                # Dark variant
Gpt.txt                 # GPT jailbreak
Pro-GPT.txt             # Pro GPT
Dark-GODMode.txt        # God mode persona
Agentic-Mode.txt        # Agentic mode with tool-use
requirements.txt        # Python dependencies
```

## Running
Workflow "Start application" runs `python app.py` on port 5000 (0.0.0.0).

## API Endpoints
- `GET /` — Chat UI
- `GET /api/prompts` — List all personalities with prompt content
- `POST /api/chat` — Send a message (`message`, `persona`, `model`, `extra_data`)

## Dependencies
curl_cffi, fastapi, uvicorn, coincurve, beautifulsoup4, pydantic, colorama
