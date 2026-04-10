# HacxGPT

A hacker-themed, terminal-style AI chatbot with uncensored AI responses via OpenRouter/DeepSeek APIs.

## Architecture

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Replit Auth (OIDC/Passport)
- **Styling**: Hacker/terminal aesthetic (black bg, green text, JetBrains Mono font)

## Key Features

- Terminal-style chat interface with green-on-black hacker aesthetic
- Mobile-responsive design with hamburger menu + Sheet drawer sidebar
- Markdown rendering with syntax highlighting (rehype-highlight)
- **Code execution**: Copy + Run buttons on code blocks; runs via Piston API (emkc.org)
- Multi-model support: OpenRouter (default: kwaipilot/kat-coder-pro:free) + DeepSeek
- Conversation history with persistent storage
- Replit Auth authentication
- HacxGPT system prompt: uncensored hacker AI persona

## Project Structure

```
client/src/
  pages/           Landing, Home, Chat
  components/      Sidebar, MessageBubble, TerminalInput, SettingsModal, GlitchText
  hooks/           use-auth, use-conversations, use-messages, use-settings
server/
  routes.ts        API endpoints: /api/conversations, /api/messages, /api/settings, /api/chat/completions, /api/execute
  storage.ts       DatabaseStorage class
  db.ts            Drizzle DB connection
shared/
  schema.ts        Tables: conversations, messages, settings
  routes.ts        API route definitions
```

## API Endpoints

- `GET /api/conversations` — list user conversations
- `POST /api/conversations` — create new conversation
- `DELETE /api/conversations/:id` — delete conversation
- `GET /api/conversations/:id/messages` — list messages
- `GET /api/settings` — get user settings
- `PATCH /api/settings` — update settings (apiKey, provider, model)
- `POST /api/chat/completions` — send message, get AI response
- `POST /api/execute` — execute code via Piston API (free sandboxed runner)

## Deployment

- **Render**: See `render.yaml` — buildCommand: `npm install && npm run build`, startCommand: `node ./dist/index.cjs`
- **Vercel**: See `vercel.json`

## GitHub Push

Run `bash push-to-github.sh` to push to https://github.com/daviddan-241/Replit
Requires: `GITHUB_PERSONAL_ACCESS_TOKEN` env var set.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Express session secret
- `GITHUB_PERSONAL_ACCESS_TOKEN` — For GitHub push script
