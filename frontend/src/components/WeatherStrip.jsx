export default function WeatherStrip({ weather }) {
    const items = [
        { label: "Temperature", val: weather ? `${weather.temperature}°C` : "--°C", sub: "Live reading", cls: "g" },
        { label: "Humidity", val: weather ? `${weather.humidity}%` : "--%", sub: "Relative", cls: "b" },
        { label: "Rainfall", val: weather ? `${weather.rainfall}mm` : "--mm", sub: "Current", cls: "p" },
        { label: "Wind speed", val: weather ? `${weather.wind_speed}km/h` : "--km/h", sub: "Live reading", cls: "w" },
    ];

    return (
        <div className="weather-strip">
            {items.map(({ label, val, sub, cls }, i) => (
                <>
                    {i > 0 && <div key={`div-${i}`} className="w-div" />}
                    <div key={label} className="w-card">
                        <div className="w-label">{label}</div>
                        <div className={`w-val ${cls}`}>{val}</div>
                        <div className="w-sub">{sub}</div>
                    </div>
                </>
            ))}
        </div>
    );
}