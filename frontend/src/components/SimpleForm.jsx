const SOIL_PARAMS = {
    "Tamil Nadu": {
        black: { n: 85, p: 45, k: 40, ph: 7.2, humidity: 78, rainfall: 180 },
        red: { n: 60, p: 30, k: 35, ph: 6.5, humidity: 72, rainfall: 150 },
        sandy: { n: 45, p: 25, k: 30, ph: 6.2, humidity: 65, rainfall: 120 },
        loamy: { n: 90, p: 50, k: 45, ph: 6.8, humidity: 80, rainfall: 200 },
        clay: { n: 75, p: 40, k: 42, ph: 7.0, humidity: 82, rainfall: 190 },
    },
    "Maharashtra": {
        black: { n: 95, p: 48, k: 44, ph: 7.5, humidity: 70, rainfall: 160 },
        red: { n: 65, p: 32, k: 36, ph: 6.6, humidity: 68, rainfall: 140 },
        sandy: { n: 50, p: 28, k: 32, ph: 6.3, humidity: 60, rainfall: 110 },
        loamy: { n: 92, p: 52, k: 46, ph: 6.9, humidity: 75, rainfall: 195 },
        clay: { n: 80, p: 42, k: 43, ph: 7.1, humidity: 78, rainfall: 185 },
    },
    "Punjab": {
        black: { n: 100, p: 55, k: 50, ph: 7.8, humidity: 65, rainfall: 130 },
        red: { n: 70, p: 35, k: 38, ph: 6.7, humidity: 62, rainfall: 120 },
        sandy: { n: 55, p: 30, k: 34, ph: 6.4, humidity: 58, rainfall: 100 },
        loamy: { n: 105, p: 58, k: 52, ph: 7.0, humidity: 70, rainfall: 180 },
        clay: { n: 88, p: 46, k: 47, ph: 7.3, humidity: 72, rainfall: 170 },
    },
    "Karnataka": {
        black: { n: 88, p: 46, k: 42, ph: 7.3, humidity: 75, rainfall: 170 },
        red: { n: 62, p: 31, k: 36, ph: 6.5, humidity: 70, rainfall: 145 },
        sandy: { n: 48, p: 26, k: 31, ph: 6.2, humidity: 63, rainfall: 115 },
        loamy: { n: 93, p: 51, k: 47, ph: 6.9, humidity: 78, rainfall: 198 },
        clay: { n: 78, p: 41, k: 43, ph: 7.1, humidity: 80, rainfall: 188 },
    },
    "Uttar Pradesh": {
        black: { n: 92, p: 50, k: 46, ph: 7.4, humidity: 72, rainfall: 155 },
        red: { n: 67, p: 33, k: 37, ph: 6.6, humidity: 68, rainfall: 135 },
        sandy: { n: 52, p: 27, k: 33, ph: 6.3, humidity: 62, rainfall: 108 },
        loamy: { n: 98, p: 54, k: 49, ph: 7.0, humidity: 74, rainfall: 192 },
        clay: { n: 82, p: 43, k: 44, ph: 7.2, humidity: 76, rainfall: 182 },
    },
    "Andhra Pradesh": {
        black: { n: 86, p: 44, k: 41, ph: 7.2, humidity: 76, rainfall: 172 },
        red: { n: 61, p: 30, k: 35, ph: 6.4, humidity: 71, rainfall: 148 },
        sandy: { n: 46, p: 25, k: 30, ph: 6.1, humidity: 64, rainfall: 118 },
        loamy: { n: 91, p: 50, k: 46, ph: 6.8, humidity: 79, rainfall: 196 },
        clay: { n: 76, p: 40, k: 42, ph: 7.0, humidity: 81, rainfall: 187 },
    },
    "Rajasthan": {
        black: { n: 70, p: 38, k: 36, ph: 7.6, humidity: 45, rainfall: 80 },
        red: { n: 52, p: 26, k: 30, ph: 6.8, humidity: 42, rainfall: 70 },
        sandy: { n: 35, p: 18, k: 24, ph: 6.5, humidity: 38, rainfall: 55 },
        loamy: { n: 78, p: 42, k: 40, ph: 7.1, humidity: 50, rainfall: 100 },
        clay: { n: 65, p: 34, k: 38, ph: 7.3, humidity: 48, rainfall: 92 },
    },
    "West Bengal": {
        black: { n: 90, p: 48, k: 44, ph: 6.8, humidity: 85, rainfall: 220 },
        red: { n: 68, p: 34, k: 38, ph: 6.3, humidity: 80, rainfall: 195 },
        sandy: { n: 50, p: 26, k: 32, ph: 6.0, humidity: 75, rainfall: 165 },
        loamy: { n: 96, p: 54, k: 50, ph: 6.6, humidity: 88, rainfall: 240 },
        clay: { n: 82, p: 44, k: 46, ph: 6.9, humidity: 86, rainfall: 228 },
    },
};

const SEASON_TEMP = {
    "kharif": 30,
    "rabi": 18,
    "zaid": 35,
};

const WATER_RAINFALL = {
    "low": 80,
    "medium": 160,
    "high": 250,
};

const ALL_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function convertSimpleToExpert(simpleData) {
    const { state, soilType, season, water } = simpleData;
    const stateData = SOIL_PARAMS[state] || SOIL_PARAMS["Tamil Nadu"];
    const soilKey = soilType.toLowerCase().replace(" soil", "").replace(" ", "");
    const soil = stateData[soilKey] || stateData["loamy"];
    const temp = SEASON_TEMP[season.toLowerCase()] || 26;
    const rainfall = WATER_RAINFALL[water.toLowerCase()] || soil.rainfall;

    return {
        nitrogen: soil.n,
        phosphorus: soil.p,
        potassium: soil.k,
        temperature: temp,
        humidity: soil.humidity,
        ph: soil.ph,
        rainfall: rainfall,
    };
}

export default function SimpleForm({ simpleData, setSimpleData }) {
    const soilTypes = ["Black soil", "Red soil", "Sandy soil", "Loamy soil", "Clay soil"];
    const seasons = ["Kharif (Jun–Oct)", "Rabi (Nov–Apr)", "Zaid (Mar–Jun)"];
    const waters = ["Low", "Medium", "High"];

    return (
        <div style={{ animation: "fadeIn 0.35s ease" }}>
            <div className="card-label p">Step 01 — Easy inputs</div>
            <div className="card-title">
                <div className="sec-icon sec-icon-p">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10C3 8 5 6 9 3C9 7 6 9.5 2 10Z" fill="#ff2d78" />
                        <path d="M2 10C4 9 5.5 8 6 7" stroke="#ffaac8" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                </div>
                Simple farm details
            </div>
            <div className="card-sub">No technical knowledge needed — just answer simply!</div>

            <div className="simple-grid">
                <div className="s-field">
                    <div className="s-label">Your state</div>
                    <select
                        className="s-select"
                        value={simpleData.state}
                        onChange={e => setSimpleData(p => ({ ...p, state: e.target.value }))}
                    >
                        <option value="">Select your state</option>
                        {ALL_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="s-field">
                    <div className="s-label">Soil type</div>
                    <select
                        className="s-select"
                        value={simpleData.soilType}
                        onChange={e => setSimpleData(p => ({ ...p, soilType: e.target.value }))}
                    >
                        <option value="">Select soil type</option>
                        {soilTypes.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="s-field">
                    <div className="s-label">Current season</div>
                    <select
                        className="s-select"
                        value={simpleData.season}
                        onChange={e => setSimpleData(p => ({ ...p, season: e.target.value }))}
                    >
                        <option value="">Select season</option>
                        {seasons.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="s-field">
                    <div className="s-label">Water availability</div>
                    <select
                        className="s-select"
                        value={simpleData.water}
                        onChange={e => setSimpleData(p => ({ ...p, water: e.target.value }))}
                    >
                        <option value="">Select water level</option>
                        {waters.map(w => (
                            <option key={w} value={w}>{w}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="info-box-simple">
                <div className="info-dot-p"></div>
                <div className="info-text-p">
                    Our AI will <span style={{ color: "#ff2d78", fontWeight: 500 }}>automatically calculate</span> N, P, K values based on your selections — no technical knowledge needed! 🌱
                </div>
            </div>
        </div>
    );
}