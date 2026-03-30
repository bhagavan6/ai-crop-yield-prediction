export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <div className="logo-icon">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M2 14C4 10 8 6 14 2C14 8 10 13 2 14Z" fill="#00ff88" />
                        <path d="M2 14C5 12 7 10 8 8" stroke="#80ffc4" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                </div>
                <span className="logo-text">CROPAI</span>
            </div>
            <div className="nav-links">
                {["Recommend", "History", "Analytics", "About"].map((l, i) => (
                    <span key={l} className={`nav-link${i === 0 ? " active" : ""}`}>{l}</span>
                ))}
            </div>
            <button className="nav-btn">Get started</button>
        </nav>
    );
}