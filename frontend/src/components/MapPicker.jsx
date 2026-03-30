import { useEffect, useRef } from "react";

export default function MapPicker({ location, setLocation }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        const L = window.L;
        if (!L) return;

        const map = L.map("leaflet-map", {
            center: [location.lat, location.lng],
            zoom: 11,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const icon = L.divIcon({
            className: "",
            html: `<div style="width:20px;height:20px;background:#ff2d78;border-radius:50%;border:3px solid #05080d;box-shadow:0 0 10px #ff2d78"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });

        const marker = L.marker([location.lat, location.lng], {
            icon, draggable: true
        }).addTo(map);

        markerRef.current = marker;
        mapRef.current = map;

        marker.on("dragend", () => {
            const { lat, lng } = marker.getLatLng();
            setLocation(prev => ({ ...prev, lat, lng }));
        });

        map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            setLocation({ lat, lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        });
    }, []);

    const useMyLocation = () => {
        navigator.geolocation?.getCurrentPosition(({ coords }) => {
            const { latitude: lat, longitude: lng } = coords;
            markerRef.current?.setLatLng([lat, lng]);
            mapRef.current?.setView([lat, lng], 12);
            setLocation({ lat, lng, name: "My location" });
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
            <div className="card-sub">Click on the map or drag the pin to your farm</div>

            <div id="leaflet-map" className="map-box" />

            <div className="loc-row">
                <div className="loc-display">
                    📍 {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                </div>
                <button className="loc-btn" onClick={useMyLocation}>
                    Use my location
                </button>
            </div>
        </div>
    );
}