export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-badge">
                <span className="badge-dot" />
                AI-powered · Real-time · Smart analysis
            </div>
            <p className="hero-pre">Next-gen agriculture intelligence</p>
            <h1 className="hero-title">
                <span className="g">CROP</span>{" "}
                <span className="b">RECOM</span>
                <span className="p">MEND</span>
            </h1>
            <p className="hero-sub">
                AI that knows your soil,<br />your land, your climate.
            </p>
            <p className="hero-desc">
                Enter parameters below and let the model do the thinking —
                precise recommendations in seconds.
            </p>
            <div className="hero-stats">
                {[
                    { val: "22+", label: "Crop types", cls: "g" },
                    { val: "98%", label: "Accuracy", cls: "b" },
                    { val: "5s", label: "Response time", cls: "p" },
                ].map(({ val, label, cls }) => (
                    <div key={label} className="hstat">
                        <div className={`hstat-num ${cls}`}>{val}</div>
                        <div className="hstat-lbl">{label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}