const COLORS = ["g", "b", "p"];

const TIPS = {
    rice: "Thrives in warm, humid conditions with high rainfall.",
    maize: "Grows well in moderate temperatures with good drainage.",
    chickpea: "Prefers cool, dry climates — drought tolerant.",
    wheat: "Best in cool winters and warm dry summers.",
    cotton: "Needs long frost-free periods and plenty of sunshine.",
    sugarcane: "Requires tropical/subtropical climate and high rainfall.",
    default: "Ideal for your current soil and climate conditions.",
};

const RANK_LABELS = ["Best match", "Good match", "Moderate match"];

export default function Results({ results }) {
    return (
        <section className="result-section">
            <div className="result-card">
                <div className="result-hdr">
                    <div>
                        <div className="result-label">AI output — top matches</div>
                        <div className="result-title">
                            Recommended crops for your conditions
                        </div>
                    </div>
                    <span className="result-badge">{results.length} crops found</span>
                </div>

                <div className="crops-grid">
                    {results.map((r, i) => {
                        const cls = COLORS[i] || "g";
                        const key = r.crop.toLowerCase();
                        const tip = TIPS[key] || TIPS.default;
                        return (
                            <div key={r.crop} className={`crop-item${i === 0 ? " top" : ""}`}>
                                <div className={`crop-icon crop-icon-${cls}`}>
                                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 2Q10 6 8 14"
                                            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                        <path d="M8 6Q5 4 4 6Q6 8 8 6Z"
                                            fill="currentColor" opacity="0.8" />
                                        <path d="M8 9Q11 7 12 9Q10 11 8 9Z"
                                            fill="currentColor" opacity="0.8" />
                                    </svg>
                                </div>
                                <div className="crop-name">{r.crop}</div>
                                <div className={`crop-pct ${cls}`}>{r.confidence}%</div>
                                <div className="crop-sub">{RANK_LABELS[i]}</div>
                                <div className="crop-tip">{tip}</div>
                                <div className="prog">
                                    <div
                                        className={`prog-fill prog-fill-${cls}`}
                                        style={{ width: `${r.confidence}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}