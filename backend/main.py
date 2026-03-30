from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import httpx
import os

app = FastAPI(title="CropAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully")
except FileNotFoundError:
    print("⚠️  model.pkl not found")
    model = None


class SoilInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    latitude: float = None
    longitude: float = None


class CropResult(BaseModel):
    crop: str
    confidence: float
    rank: int


class PredictionResponse(BaseModel):
    recommendations: list
    weather: dict = None


async def fetch_weather(lat: float, lon: float):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(url)
            data = resp.json()
            c = data["current"]
            return {
                "temperature": round(c["temperature_2m"], 1),
                "humidity": round(c["relative_humidity_2m"], 1),
                "rainfall": round(c["precipitation"], 1),
                "wind_speed": round(c["wind_speed_10m"], 1),
            }
    except Exception:
        return None


@app.get("/")
def root():
    return {"message": "CropAI API is running 🌱"}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict")
async def predict(data: SoilInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = np.array([[
        data.nitrogen,
        data.phosphorus,
        data.potassium,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]])

    proba = model.predict_proba(features)[0]
    classes = model.classes_
    top3 = np.argsort(proba)[::-1][:3]

    recommendations = []
    for rank, idx in enumerate(top3, start=1):
        recommendations.append({
            "crop": str(classes[idx]).capitalize(),
            "confidence": round(float(proba[idx]) * 100, 1),
            "rank": rank
        })

    weather = None
    if data.latitude and data.longitude:
        weather = await fetch_weather(data.latitude, data.longitude)

    return {"recommendations": recommendations, "weather": weather}