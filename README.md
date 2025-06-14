<div align="center">
  <img src="https://raw.githubusercontent.com/amaarsyed/braindump/main/braindump.png" alt="Braindump Logo" width="120" />
</div>

# Braindump

Braindump is a modern, AI-powered creative canvas designed for brainstorming, note-taking, and visual thinking. Inspired by tldraw, it combines intuitive drawing tools with the intelligence of AI to help you organize and expand your ideas effortlessly.

## Powered By
- **React** for a dynamic and responsive user interface
- **Tailwind CSS** for rapid and customizable styling
- **Shadcn UI** for elegant, accessible components
- **AI Integration** to enhance creativity and productivity

## Features
- Freeform drawing and diagramming
- AI-assisted idea generation and organization
- Clean, distraction-free interface
- Real-time collaboration (if supported)
- Export and share your creations

---

## Deployment

1. Copy `.env.example` to `.env` and set your OpenRouter API key:

   ```bash
   cp .env.example .env
   # edit .env and add your key
   OPENROUTER_API_KEY=sk-...
   ```

2. When deploying to Vercel, add an `OPENROUTER_API_KEY` Environment Variable in
   the Vercel dashboard so the backend can authenticate with OpenRouter.


