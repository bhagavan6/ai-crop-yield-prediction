import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WeatherStrip from "./components/WeatherStrip";
import SoilForm from "./components/SoilForm";
import MapPicker from "./components/MapPicker";
import Results from "./components/Results";
import { convertSimpleToExpert } from "./components/SimpleForm";

export default function App() {
  const [formData, setFormData] = useState({
    nitrogen: "", phosphorus: "", potassium: "",
    temperature: 24, humidity: "", ph: "", rainfall: "",
  });
  const [simpleData, setSimpleData] = useState({
    state: "", soilType: "", season: "", water: "",
  });
  const [mode, setMode] = useState("expert");
  const [location, setLocation] = useState({
    lat: 11.0168, lng: 76.9558, name: "Coimbatore, TN"
  });
  const [weather, setWeather] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch live weather when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`
        );
        const data = await res.json();
        const c = data.current;
        setWeather({
          temperature: c.temperature_2m.toFixed(1),
          humidity: c.relative_humidity_2m.toFixed(1),
          rainfall: c.precipitation.toFixed(1),
          wind_speed: c.wind_speed_10m.toFixed(1),
        });
      } catch {
        setWeather(null);
      }
    };
    fetchWeather();
  }, [location]);

  const handleModeChange = (newMode, newSimpleData) => {
    setMode(newMode);
    if (newSimpleData) setSimpleData(newSimpleData);
  };

  const handleSubmit = async () => {
    setError("");

    // Get input data based on mode
    let payload;
    if (mode === "expert") {
      const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = formData;
      if (!nitrogen || !phosphorus || !potassium || !humidity || !ph || !rainfall) {
        setError("Please fill in all soil parameter fields.");
        return;
      }
      payload = {
        nitrogen: parseFloat(nitrogen),
        phosphorus: parseFloat(phosphorus),
        potassium: parseFloat(potassium),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        ph: parseFloat(ph),
        rainfall: parseFloat(rainfall),
      };
    } else {
      const { state, soilType, season, water } = simpleData;
      if (!state || !soilType || !season || !water) {
        setError("Please fill in all fields in Simple Mode.");
        return;
      }
      payload = convertSimpleToExpert({ state, soilType, season, water });
    }

    setLoading(true);
    try {
      const res = await fetch("https://cropai-backend-sroa.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResults(data.recommendations);
      if (data.weather) setWeather(data.weather);
    } catch {
      setError("Could not connect to the API. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nitrogen: "", phosphorus: "", potassium: "",
      temperature: 24, humidity: "", ph: "", rainfall: "",
    });
    setSimpleData({ state: "", soilType: "", season: "", water: "" });
    setResults(null);
    setError("");
  };

  return (
    <div className="app">
      <div className="tribar"><div /><div /><div /></div>
      <Navbar />
      <Hero />
      <WeatherStrip weather={weather} />
      <main className="main-grid">
        <SoilForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          onModeChange={handleModeChange}
        />
        <MapPicker location={location} setLocation={setLocation} />
        <div className="submit-row">
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "RUN ANALYSIS ↗"}
          </button>
        </div>
      </main>
      {results && <Results results={results} />}
      <div className="tribar reverse"><div /><div /><div /></div>
    </div>
  );
}