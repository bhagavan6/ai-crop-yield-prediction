<div align="center">

# 🌱 CropAI
### AI-Based Crop Recommendation System

![CropAI Banner](https://img.shields.io/badge/CropAI-Smart%20Farming-00ff88?style=for-the-badge&logo=leaf&logoColor=black)

[![React](https://img.shields.io/badge/React-18-00d4ff?style=flat-square&logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-00ff88?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.13-ff2d78?style=flat-square&logo=python)](https://python.org)
[![RandomForest](https://img.shields.io/badge/ML-Random%20Forest-00ff88?style=flat-square&logo=scikit-learn)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-00d4ff?style=flat-square)](LICENSE)

**An intelligent full-stack web application that recommends the best crops for your farm using Machine Learning — built with a stunning neon tricolor UI.**

[🌐 Live Demo](#) · [📖 Documentation](#installation) · [🐛 Report Bug](https://github.com/bhagavan6/ai-crop-yield-prediction/issues)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Predictions** — Random Forest model with 98% accuracy across 22+ crop types
- 🌾 **Two Input Modes** — Expert Mode (N,P,K values) & Simple Mode (no technical knowledge needed)
- 🗺️ **Interactive Map** — Street, Satellite & Terrain views with location autocomplete
- 🌤️ **Live Weather** — Real-time temperature, humidity, rainfall & wind speed
- 📍 **Location Intelligence** — Click anywhere on map or search any city/village in India
- 🎨 **Neon Tricolor UI** — Stunning dark theme with neon green, electric blue & hot pink
- ⚡ **Fast API** — FastAPI backend with sub-second response times

---

## 🖥️ Screenshots

### Expert Mode
> Enter precise N, P, K, pH, humidity and rainfall values for accurate predictions.

### Simple Mode  
> No technical knowledge needed — just select your state, soil type, season and water availability!

### Crop Results
> Get top 3 crop recommendations with confidence percentages and farming tips.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, CSS3 |
| **Backend** | FastAPI, Python 3.13 |
| **ML Model** | Scikit-learn Random Forest |
| **Map** | Leaflet.js, OpenStreetMap, Esri Satellite |
| **Weather** | Open-Meteo API (free, no key needed) |
| **Fonts** | Orbitron, Space Grotesk, Inter |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
ai-crop-yield-prediction/
├── backend/
│   ├── main.py              ← FastAPI server
│   ├── model.pkl            ← Trained Random Forest model
│   └── requirements.txt     ← Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           ← Main app
│   │   ├── index.css         ← Neon tricolor theme
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Hero.jsx
│   │       ├── WeatherStrip.jsx
│   │       ├── SoilForm.jsx
│   │       ├── SimpleForm.jsx  ← Simple Mode logic
│   │       ├── MapPicker.jsx   ← Interactive map
│   │       └── Results.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 10+

### 1️⃣ Clone the repository

```bash
git clone https://github.com/bhagavan6/ai-crop-yield-prediction.git
cd ai-crop-yield-prediction
```

### 2️⃣ Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

✅ API running at → http://localhost:8000

### 3️⃣ Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Website running at → http://localhost:5173

---

## 🔌 API Reference

### `POST /predict`

**Request:**
```json
{
  "nitrogen":    90,
  "phosphorus":  42,
  "potassium":   43,
  "temperature": 24,
  "humidity":    82,
  "ph":          6.5,
  "rainfall":    202,
  "latitude":    11.0168,
  "longitude":   76.9558
}
```

**Response:**
```json
{
  "recommendations": [
    { "crop": "Rice",     "confidence": 94.2, "rank": 1 },
    { "crop": "Maize",    "confidence": 78.1, "rank": 2 },
    { "crop": "Chickpea", "confidence": 61.5, "rank": 3 }
  ],
  "weather": {
    "temperature": 28.4,
    "humidity":    74.0,
    "rainfall":    0.2,
    "wind_speed":  12.0
  }
}
```

---

## 🌾 Simple Mode — How it works

Simple Mode converts easy farmer-friendly inputs into precise soil parameters automatically:

| Simple Input | What it does |
|-------------|-------------|
| 🏛️ State selection | Loads region-specific N, P, K averages |
| 🌱 Soil type | Adjusts nutrient and pH values |
| ☀️ Season | Sets temperature (Kharif=30°C, Rabi=18°C, Zaid=35°C) |
| 💧 Water availability | Adjusts rainfall values |

Supports all **28 Indian states** with 5 soil types each!

---

## 🗺️ Map Features

- 🗺️ **Street view** — CartoDB Voyager (clean, modern)
- 🛰️ **Satellite view** — Esri World Imagery (real aerial photos)
- 🌿 **Terrain view** — OpenTopoMap (elevation & nature)
- 🔍 **Autocomplete search** — Find any city, village or district
- 📍 **Drag & drop pin** — Move pin to exact farm location
- 📡 **GPS location** — One click to use your current location

---

## 🤖 ML Model Details

| Property | Value |
|---------|-------|
| Algorithm | Random Forest Classifier |
| Training features | N, P, K, Temperature, Humidity, pH, Rainfall |
| Number of crops | 22+ |
| Accuracy | ~98% |
| Dataset | Crop Recommendation Dataset (Kaggle) |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Upload dist/ to vercel.com
```

### Backend → Render.com
1. Push to GitHub
2. New Web Service on render.com
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port 10000`

---

## 👨‍💻 Author

**Bhagavan** — [@bhagavan6](https://github.com/bhagavan6)

Built with ❤️ for Indian farmers 🌾

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

</div>
