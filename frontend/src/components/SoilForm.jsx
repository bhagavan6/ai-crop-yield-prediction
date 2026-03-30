export default function SoilForm({ formData, setFormData, error }) {
    const fields = [
        { key: "nitrogen", label: "Nitrogen (N)", placeholder: "e.g. 90 kg/ha" },
        { key: "phosphorus", label: "Phosphorus (P)", placeholder: "e.g. 42 kg/ha" },
        { key: "potassium", label: "Potassium (K)", placeholder: "e.g. 43 kg/ha" },
        { key: "humidity", label: "Humidity (%)", placeholder: "e.g. 82" },
        { key: "ph", label: "pH Level", placeholder: "e.g. 6.5" },
        { key: "rainfall", label: "Rainfall (mm)", placeholder: "e.g. 202 mm" },
    ];

    return (
        <div className="card card-green">
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
            <div className="card-sub">Nutrient levels &amp; environmental readings</div>

            <div className="form-grid">
                {fields.map(({ key, label, placeholder }) => (
                    <div key={key} className="field">
                        <label>{label}</label>
                        <input
                            type="number"
                            placeholder={placeholder}
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

            {error && <div className="error-msg">{error}</div>}
        </div>
    );
}