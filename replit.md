# HacxGPT

A hacker-themed, terminal-style AI chatbot with uncensored AI responses. Features custom username/password auth, multiple AI personas, code execution, and multi-provider AI fallback.

## Architecture

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Custom username/password auth (bcrypt + express-session + connect-pg-simple)
- **Styling**: Hacker/terminal aesthetic (black bg, green text, JetBrains Mono font)

## Key Features

- Login / Register with username & password (no external OAuth needed)
- Terminal-style chat interface with green-on-black hacker aesthetic
- Mobile-responsive design with hamburger menu + Sheet drawer sidebar
- Markdown rendering with syntax highlighting (rehype-highlight)
- Code execution: Run code in 14+ languages via Piston API (free)
- **AI providers** (automatic fallback): OpenRouter free models → DeepSeek → OpenAI
- **5 AI Personas**: HacxGPT, WormGPT, DarkBot Ωmega, GOD Mode, Agentic Mode
- Conversation history with persistent storage per user
- Settings: switch persona per user

## Project Structure

```
client/src/
  pages/           Landing (login/register), Home, Chat
  components/      Sidebar, MessageBubble, TerminalInput, SettingsModal, GlitchText
  hooks/           use-auth, use-conversations, use-messages, use-settings
server/
  routes.ts        API: conversations, messages, settings, chat, execute, status
  storage.ts       DatabaseStorage class
  db.ts            Drizzle DB connection
  replit_integrations/auth/
    replitAuth.ts  Session setup (express-session + connect-pg-simple)
    routes.ts      Auth routes: register, login, logout, user
    storage.ts     Auth storage helpers
shared/
  schema.ts        Tables: conversations, messages, settings
  models/auth.ts   Tables: users (id, username, passwordHash), sessions
  routes.ts        API route type definitions
```

## API Endpoints

- `POST /api/auth/register` — register with username/password
- `POST /api/auth/login` — login with username/password
- `POST /api/auth/logout` — logout (destroy session)
- `GET /api/auth/user` — get current user
- `GET /api/conversations` — list user conversations
- `POST /api/conversations` — create new conversation
- `DELETE /api/conversations/:id` — delete conversation
- `GET /api/conversations/:id/messages` — list messages
- `GET /api/settings` — get user settings
- `PATCH /api/settings` — update settings (mode/persona)
- `POST /api/chat/completions` — send message, get AI response
- `POST /api/execute` — execute code via Piston API
- `GET /api/status` — check which AI providers are active

## AI Provider Priority (automatic fallback)

1. **OpenRouter** — uses free models: llama-3.3-70b, llama-3.1-8b, mistral-7b, gemma-2-9b, deepseek-r1:free, deepseek-chat:free
2. **DeepSeek** — deepseek-chat model
3. **OpenAI** — gpt-4o-mini

## Deployment

### Render
See `render.yaml`:
- Build: `npm install && npm run build`
- Start: `node ./dist/index.cjs`
- Set env vars: DATABASE_URL, SESSION_SECRET (auto-generated), OPENROUTER_API_KEY, DEEPSEEK_API_KEY, OPENAI_API_KEY

### Vercel
See `vercel.json`:
- Build command: `npm install && npm run build`
- Output: `dist/index.cjs`
- Set same env vars as Render

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Express session secret (required in production)
- `OPENROUTER_API_KEY` — OpenRouter API key (free tier works)
- `DEEPSEEK_API_KEY` — DeepSeek API key
- `OPENAI_API_KEY` — OpenAI API key
