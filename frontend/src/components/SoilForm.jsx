import { useState } from "react";
import SimpleForm, { convertSimpleToExpert } from "./SimpleForm";

export default function SoilForm({ formData, setFormData, error, onModeChange }) {
    const [mode, setMode] = useState("expert");
    const [simpleData, setSimpleData] = useState({
        state: "", soilType: "", season: "", water: "",
    });

    const switchMode = (m) => {
        setMode(m);
        if (onModeChange) onModeChange(m, simpleData);
    };

    const handleSimpleChange = (updated) => {
        setSimpleData(updated);
        if (onModeChange) onModeChange(mode, updated);
    };

    return (
        <div>
            {/* Mode selector cards */}
            <div className="mode-cards">
                <div
                    className={`mode-card expert${mode === "expert" ? " active" : ""}`}
                    onClick={() => switchMode("expert")}
                >
                    <div className="mode-icon-wrap g">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="6" stroke="#00ff88" strokeWidth="1.5" />
                            <path d="M9 5v4l3 1.5" stroke="#00ff88" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="mode-title g">Expert Mode</div>
                    <div className="mode-desc">Enter precise N, P, K values</div>
                    <div className={`mode-check g${mode === "expert" ? " visible" : ""}`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                <div
                    className={`mode-card simple${mode === "simple" ? " active" : ""}`}
                    onClick={() => switchMode("simple")}
                >
                    <div className="mode-badge">⭐ Recommended</div>
                    <div className="mode-icon-wrap p">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 15C5 11 9 7 15 3C15 9 11 14 3 15Z" fill="#ff2d78" opacity="0.9" />
                            <path d="M3 15C6 13 8 11 9 9" stroke="#ffaac8" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="mode-title p">Simple Mode</div>
                    <div className="mode-desc">No technical knowledge needed!</div>
                    <div className={`mode-check p${mode === "simple" ? " visible" : ""}`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="#ff2d78" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Form card */}
            <div className={`card${mode === "expert" ? " card-green" : " card-pink"}`}>
                {mode === "expert" ? (
                    <div style={{ animation: "fadeIn 0.35s ease" }}>
                        <div className="card-label g">Step 01 — Soil data</div>
                        <div className="card-title">
                            <div className="sec-icon sec-icon-g">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <circle cx="6" cy="6" r="4" stroke="#00ff88" strokeWidth="1.4" />
                                    <path d="M6 3v3l2 1" stroke="#00ff88" strokeWidth="1.1" strokeLinecap="round" />
                                </svg>
                            </div>
                            Soil parameters
                        </div>
                        <div className="card-sub">Enter precise nutrient levels for accurate results</div>
                        <div className="form-grid">
                            {[
                                { key: "nitrogen", label: "Nitrogen (N)", ph: "e.g. 90 kg/ha" },
                                { key: "phosphorus", label: "Phosphorus (P)", ph: "e.g. 42 kg/ha" },
                                { key: "potassium", label: "Potassium (K)", ph: "e.g. 43 kg/ha" },
                                { key: "humidity", label: "Humidity (%)", ph: "e.g. 82" },
                                { key: "ph", label: "pH Level", ph: "e.g. 6.5" },
                                { key: "rainfall", label: "Rainfall (mm)", ph: "e.g. 202 mm" },
                            ].map(({ key, label, ph }) => (
                                <div key={key} className="field">
                                    <label>{label}</label>
                                    <input
                                        type="number"
                                        placeholder={ph}
                                        value={formData[key]}
                                        onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="sl-row">
                            <div className="sl-head">
                                <span className="sl-title">Temperature</span>
                                <span className="sl-val">{formData.temperature}°C</span>
                            </div>
                            <input
                                type="range" min="15" max="45" step="1"
                                value={formData.temperature}
                                onChange={e => setFormData(p => ({ ...p, temperature: Number(e.target.value) }))}
                                className="temp-slider"
                            />
                            <div className="sl-ends"><span>15°C</span><span>45°C</span></div>
                        </div>
                    </div>
                ) : (
                    <SimpleForm
                        simpleData={simpleData}
                        setSimpleData={handleSimpleChange}
                    />
                )}
                {error && <div className="error-msg">{error}</div>}
            </div>
        </div>
    );
}