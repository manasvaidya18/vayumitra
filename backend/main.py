import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from database import engine
import models

# Routers
from routes import auth, heatmap, citizen, chat, ml
from policymaker_backend.routes import router as policymaker_router

# Load Environment
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Initialize DB Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex="https?://.*", # Allow all http/https origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup data fetch for Citizen app
@app.on_event("startup")
async def startup_event():
    # Trigger the citizen data fetcher on startup
    import asyncio
    asyncio.create_task(citizen.get_or_update_data())

# Include Routers
app.include_router(auth.router)
app.include_router(heatmap.router)
app.include_router(citizen.router, prefix="/api/citizen", tags=["Citizen"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(ml.router, prefix="/api/ml", tags=["ML"])
app.include_router(policymaker_router, prefix="/api/policymaker", tags=["Policymaker"])

@app.get("/")
async def root():
    return {"message": "FastAPI Backend is running"}
