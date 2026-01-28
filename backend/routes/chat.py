from fastapi import APIRouter
from pydantic import BaseModel
import os
import httpx

router = APIRouter()

# Nugen API configuration
NUGEN_API_URL = "https://api.nugen.in/api/v3/agents/run-agents/air_buddy/run/"
API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NUGEN_API_KEY")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Static Response Logic (Fallback)
    def get_static_response(user_msg: str) -> str:
        msg = user_msg.lower()
        if "aqi" in msg or "air quality" in msg:
            return "AQI (Air Quality Index) measures how clean or polluted the air is. Ranges: 0-50 (Good), 51-100 (Satisfactory), 101-200 (Moderate), 201-300 (Poor), 301-400 (Very Poor), 401-500 (Severe)."
        elif "health" in msg or "mask" in msg or "breathing" in msg:
            return "High pollution can cause respiratory issues. If AQI > 200, wear a mask (N95/N99) and avoid outdoor activities. Keep windows closed."
        elif "morning walk" in msg or "exercise" in msg or "run" in msg:
            return "Avoid outdoor exercise if AQI > 150. Best time for outdoor activities is usually afternoon when pollution levels dip, or check the 'Best Time' feature."
        elif "plant" in msg or "tree" in msg:
            return "Planting trees helps! Good options: Neem, Peepal, Aloe Vera, and Snake Plant (indoor) which purify air naturally."
        elif "hello" in msg or "hi" in msg:
            return "Hello! I am Air Buddy. I'm currently running in offline mode but I can help you with AQI info and health tips!"
        else:
            return "I'm having trouble connecting to my AI brain right now, but I'm here! Ask me about 'AQI', 'Health Tips', or 'Safe Activities'."

    # 1. Check API Key
    if not API_KEY:
        print("Chat: No API Key found, using static response.")
        return ChatResponse(response=get_static_response(request.message))

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "message": request.message,
        "stream": False 
    }

    # 2. Try External API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(NUGEN_API_URL, json=payload, headers=headers, timeout=10.0) 
            response.raise_for_status()
            data = response.json()
            
            ai_text = data.get("response") or data.get("output") or data.get("result")
            
            if not ai_text and "choices" in data:
                 ai_text = data["choices"][0].get("text", "").strip()

            if ai_text:
                return ChatResponse(response=ai_text)
            else:
                return ChatResponse(response=get_static_response(request.message))
                
        except Exception as e:
            # 3. Network/API Error Fallback
            print(f"Chat API Error: {e}. Falling back to static.")
            return ChatResponse(response=get_static_response(request.message))
