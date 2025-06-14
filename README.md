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

## Development Setup

### Prerequisites
- **Node.js** and **npm**
- **Python 3** with `pip`

### Installation
```bash
npm run install-all
```
This installs npm packages for the React app and pip dependencies for the FastAPI backend.

### Environment Variables
Create a `.env` file in the project root containing:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key
API_KEY=your_secret_api_key
REPLICATE_API_TOKEN=optional_token_for_image_generation
```
`API_KEY` is used to authorize requests to the backend via the `api-key` header.

### Running Locally
Run the development servers from the project root:
```bash
npm start
```
The React frontend runs on `http://localhost:3000` and the FastAPI backend runs on `http://localhost:8000`.
If you need the Socket.IO server for collaboration, start it separately with:
```bash
node server.js
```

### Deploying to Vercel
Build the frontend and deploy the `frontend` directory:
```bash
npm run build
vercel --prod frontend
```
Vercel will serve the static files from the `build` folder.

