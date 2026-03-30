import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WeatherStrip from "./components/WeatherStrip";
import SoilForm from "./components/SoilForm";
import MapPicker from "./components/MapPicker";
import Results from "./components/Results";

export default function App() {
  const [formData, setFormData] = useState({
    nitrogen: "", phosphorus: "", potassium: "",
    temperature: 24, humidity: "", ph: "", rainfall: "",
  });
  const [location, setLocation] = useState({
    lat: 11.0168, lng: 76.9558, name: "Coimbatore, TN"
  });
  const [weather, setWeather] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async () => {
    setError("");
    const { nitrogen, phosphorus, potassium, temperature, rainfall } = formData;
    if (!nitrogen || !phosphorus || !potassium || !rainfall) {
      setError("Please fill in all soil parameter fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall),
          latitude: location.lat,
          longitude: location.lng,
        }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResults(data.recommendations);
      if (data.weather) setWeather(data.weather);
    } catch (e) {
      setError("Could not connect to the API. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ nitrogen: "", phosphorus: "", potassium: "", temperature: 24, humidity: "", ph: "", rainfall: "" });
    setResults(null);
    setError("");
  };

  return (
    <div className="app">
      <div className="tribar">
        <div /><div /><div />
      </div>
      <Navbar />
      <Hero />
      <WeatherStrip weather={weather} />
      <main className="main-grid">
        <SoilForm formData={formData} setFormData={setFormData} error={error} />
        <MapPicker location={location} setLocation={setLocation} />
        <div className="submit-row">
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Analyzing..." : "RUN ANALYSIS ↗"}
          </button>
        </div>
      </main>
      {results && <Results results={results} />}
      <div className="tribar reverse">
        <div /><div /><div />
      </div>
    </div>
  );
}