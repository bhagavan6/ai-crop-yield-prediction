import { useEffect, useRef, useState } from "react";
import L from "leaflet";

export default function MapPicker({ location, setLocation }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const layerRef = useRef(null);
    const debounceRef = useRef(null);

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDrop, setShowDrop] = useState(false);
    const [searching, setSearching] = useState(false);
    const [mapStyle, setMapStyle] = useState("street");

    const TILES = {
        street: {
            url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            label: "Street view", attr: "© CartoDB",
        },
        satellite: {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            label: "Satellite view", attr: "© Esri",
        },
        terrain: {
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            label: "Terrain view", attr: "© OpenTopoMap",
        },
    };

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("leaflet-map", {
            center: [location.lat, location.lng],
            zoom: 12,
            zoomControl: false,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        const layer = L.tileLayer(TILES.street.url, {
            maxZoom: 19, attribution: TILES.street.attr,
        }).addTo(map);

        const icon = L.divIcon({
            className: "",
            html: `<div style="width:18px;height:18px;background:#ff2d78;border-radius:50%;border:3px solid #05080d;box-shadow:0 0 10px #ff2d78,0 0 22px rgba(255,45,120,0.5)"></div>`,
            iconSize: [18, 18], iconAnchor: [9, 9],
        });

        const marker = L.marker([location.lat, location.lng], {
            icon, draggable: true,
        }).addTo(map);

        mapRef.current = map;
        markerRef.current = marker;
        layerRef.current = layer;

        marker.on("dragend", async () => {
            const { lat, lng } = marker.getLatLng();
            const name = await reverseGeocode(lat, lng);
            setLocation({ lat, lng, name });
        });

        map.on("click", async (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            const name = await reverseGeocode(lat, lng);
            setLocation({ lat, lng, name });
        });

        return () => { map.remove(); mapRef.current = null; };
    }, []);

    // Autocomplete — fetch suggestions as user types
    const handleSearchInput = (val) => {
        setSearch(val);
        setShowDrop(true);
        clearTimeout(debounceRef.current);
        if (val.trim().length < 2) { setSuggestions([]); return; }
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&addressdetails=1`
                );
                const data = await res.json();
                setSuggestions(data.map(d => ({
                    name: d.display_name.split(",").slice(0, 3).join(","),
                    lat: parseFloat(d.lat),
                    lng: parseFloat(d.lon),
                })));
            } catch {
                setSuggestions([]);
            }
        }, 350);
    };

    // Pick a suggestion
    const pickSuggestion = (s) => {
        markerRef.current?.setLatLng([s.lat, s.lng]);
        mapRef.current?.setView([s.lat, s.lng], 13);
        setLocation({ lat: s.lat, lng: s.lng, name: s.name });
        setSearch(s.name);
        setSuggestions([]);
        setShowDrop(false);
    };

    const switchStyle = (style) => {
        if (!mapRef.current || !layerRef.current) return;
        mapRef.current.removeLayer(layerRef.current);
        const newLayer = L.tileLayer(TILES[style].url, {
            maxZoom: 19, attribution: TILES[style].attr,
        }).addTo(mapRef.current);
        layerRef.current = newLayer;
        setMapStyle(style);
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || "";
            const state = data.address?.state || "";
            return city ? `${city}, ${state}` : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } catch {
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    };

    const useMyLocation = () => {
        navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
            const { latitude: lat, longitude: lng } = coords;
            markerRef.current?.setLatLng([lat, lng]);
            mapRef.current?.setView([lat, lng], 13);
            const name = await reverseGeocode(lat, lng);
            setLocation({ lat, lng, name });
            setSearch(name);
        }, () => {
            alert("Please allow location access in your browser.");
        });
    };

    return (
        <div className="card card-blue">
            <div className="card-label b">Step 02 — Location</div>
            <div className="card-title">
                <div className="sec-icon sec-icon-b">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1C4 1 2 3 2 5c0 3 4 7 4 7s4-4 4-7c0-2-2-4-4-4z"
                            stroke="#00d4ff" strokeWidth="1.2" />
                        <circle cx="6" cy="5" r="1.2" fill="#00d4ff" />
                    </svg>
                </div>
                Farm location
            </div>
            <div className="card-sub">Search any location or click map to pin your farm</div>

            {/* Search bar with autocomplete */}
            <div style={{ position: "relative", marginBottom: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        className="map-search-input"
                        placeholder="Search city, village, district..."
                        value={search}
                        onChange={e => handleSearchInput(e.target.value)}
                        onFocus={() => setShowDrop(true)}
                        onBlur={() => setTimeout(() => setShowDrop(false), 200)}
                        autoComplete="off"
                    />
                    <button
                        className="map-search-btn"
                        onClick={() => suggestions.length > 0 && pickSuggestion(suggestions[0])}
                    >
                        {searching ? "..." : "Search"}
                    </button>
                </div>

                {/* Dropdown suggestions */}
                {showDrop && suggestions.length > 0 && (
                    <div style={{
                        position: "absolute", top: "100%", left: 0,
                        right: "0", zIndex: 9999,
                        background: "#0d1520",
                        border: "0.5px solid rgba(0,212,255,0.22)",
                        borderRadius: "8px", marginTop: "4px",
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}>
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                onMouseDown={() => pickSuggestion(s)}
                                style={{
                                    padding: "9px 12px",
                                    fontSize: "12px",
                                    color: "rgba(200,220,255,0.7)",
                                    cursor: "pointer",
                                    borderBottom: i < suggestions.length - 1
                                        ? "0.5px solid rgba(255,255,255,0.05)"
                                        : "none",
                                    display: "flex", alignItems: "center", gap: "8px",
                                    transition: "background 0.15s",
                                    fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                                    <path d="M5 1C3.5 1 2 2.5 2 4c0 2.5 3 5.5 3 5.5S8 6.5 8 4c0-1.5-1.5-3-3-3z"
                                        stroke="#00d4ff" strokeWidth="1" fill="none" />
                                    <circle cx="5" cy="4" r="1" fill="#00d4ff" />
                                </svg>
                                <span style={{
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                }}>
                                    {s.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Map */}
            <div style={{ position: "relative" }}>
                <div
                    id="leaflet-map"
                    style={{
                        height: "200px", width: "100%",
                        borderRadius: "8px",
                        border: "0.5px solid rgba(0,212,255,0.22)",
                    }}
                />
                <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    display: "flex", gap: "4px", zIndex: 1000,
                }}>
                    {["street", "satellite", "terrain"].map(s => (
                        <button
                            key={s}
                            onClick={() => switchStyle(s)}
                            style={{
                                background: mapStyle === s ? "rgba(0,212,255,0.15)" : "rgba(9,14,21,0.88)",
                                border: mapStyle === s ? "0.5px solid #00d4ff" : "0.5px solid rgba(0,212,255,0.22)",
                                color: mapStyle === s ? "#00d4ff" : "rgba(200,220,255,0.4)",
                                fontSize: "10px", padding: "5px 9px",
                                borderRadius: "6px", cursor: "pointer",
                                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500,
                            }}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
                <div style={{
                    position: "absolute", bottom: "8px", left: "8px",
                    background: "rgba(9,14,21,0.88)",
                    border: "0.5px solid rgba(0,212,255,0.22)",
                    borderRadius: "6px", padding: "4px 8px",
                    fontSize: "10px", color: "#00d4ff",
                    zIndex: 1000, pointerEvents: "none",
                    fontFamily: "'Inter', sans-serif",
                }}>
                    {TILES[mapStyle].label}
                </div>
            </div>

            {/* Location display */}
            <div style={{
                display: "flex", gap: "8px",
                marginTop: "10px", alignItems: "center",
            }}>
                <div style={{
                    flex: 1, background: "#0d1520",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", padding: "9px 12px",
                    fontSize: "12px", color: "#00d4ff",
                    fontFamily: "'Inter', sans-serif",
                }}>
                    📍 {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                </div>
                <button
                    onClick={useMyLocation}
                    style={{
                        background: "rgba(0,212,255,0.1)",
                        border: "0.5px solid rgba(0,212,255,0.22)",
                        color: "#00d4ff", fontSize: "11px",
                        padding: "9px 14px", borderRadius: "8px",
                        cursor: "pointer", whiteSpace: "nowrap",
                        fontFamily: "'Space Grotesk', sans-serif",
                    }}
                >
                    Use my location
                </button>
            </div>
        </div>
    );
}