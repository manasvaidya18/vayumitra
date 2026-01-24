import os
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Nugen API configuration
# Using the Agent endpoint as verified in testing. 
# The inference endpoint provided by user returned 404/Model Not Found.
NUGEN_API_URL = "https://api.nugen.in/api/v3/agents/run-agents/air_buddy/run/"
# We'll use the existing env var or fallback to looking for Nugen_API_KEY
API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NUGEN_API_KEY")

# CORS configuration
origins = [
    "http://localhost:3000",  # React default port
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key not configured")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # payload for Agent API usually expects 'input', 'query', 'text' or 'message'
    # Nugen API returned 422 "Field required: message", so we use 'message'
    payload = {
        "message": request.message,
        "stream": False 
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(NUGEN_API_URL, json=payload, headers=headers, timeout=60.0)
            response.raise_for_status()
            data = response.json()
            
            # Agent API response parsing
            ai_text = data.get("response") or data.get("output") or data.get("result")
            
            if not ai_text and "choices" in data:
                 ai_text = data["choices"][0].get("text", "").strip()

            if ai_text:
                return ChatResponse(response=ai_text)
            else:
                # Fallback: dump the whole JSON if we can't find the text field, for debugging
                return ChatResponse(response=str(data))
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e.response.text))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "FastAPI Backend is running"}
