## Packages
framer-motion | Animations for typing effects and page transitions
react-markdown | Rendering AI responses with markdown support
rehype-highlight | Syntax highlighting for code blocks within markdown
date-fns | Date formatting for chat history
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind classes safely

## Notes
Integration with /api/chat/completions requires handling specific response format { message: string, conversationId: number }
Auth is handled via Replit Auth (use-auth.ts already exists)
Theme is strictly "Hacker" - Black background, Green text, Monospace fonts
