from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import requests
from dotenv import load_dotenv
load_dotenv()
import secrets

# Load environment variables from .env file 
load_dotenv()

app = FastAPI()

# Configure CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React app URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API keys from environment variables 
API_KEY = os.getenv("API_KEY", "default-key")  # Default for development
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Make authentication optional for development
def optional_authorize_request(api_key: Optional[str] = Header(None, alias="api-key")):
    if not API_KEY or API_KEY == "default-key":
        return True  # Skip auth in development
    if not api_key or not secrets.compare_digest(api_key, API_KEY):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

def generate_response(messages: List[Message]) -> str:
    if not OPENROUTER_API_KEY:
        return "Sorry, the AI service is not configured. Please set OPENROUTER_API_KEY environment variable."
    
    print("Calling OpenRouter API with messages:", messages)
    conversation = [{"role": "system", "content": "You are Boardly, an AI assistant for a whiteboard application. Act like a helpful whiteboard assistant, providing helpful, witty, and concise responses."}]
    conversation.extend([{"role": msg.role, "content": msg.content} for msg in messages])
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistralai/mistral-7b-instruct:free",  # Using a reliable free model
                "messages": conversation,
                "max_tokens": 150,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"OpenRouter API error: {response.status_code} - {response.text}")
            return f"Sorry, I'm having trouble connecting to the AI service. Error: {response.status_code}"
        
        result = response.json()
        if "choices" not in result or len(result["choices"]) == 0:
            return "Sorry, I received an unexpected response from the AI service."
            
        return result["choices"][0]["message"]["content"]
        
    except requests.exceptions.Timeout:
        return "Sorry, the AI service is taking too long to respond. Please try again."
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        return "Sorry, I'm having trouble connecting to the AI service. Please try again."
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return "Sorry, something went wrong. Please try again."

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, authorized: bool = Depends(optional_authorize_request)):
    try:
        response = generate_response(request.messages)
        return ChatResponse(response=response)
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "openrouter_configured": bool(OPENROUTER_API_KEY)}

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on http://localhost:8000")
    print(f"OpenRouter API Key configured: {bool(OPENROUTER_API_KEY)}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
