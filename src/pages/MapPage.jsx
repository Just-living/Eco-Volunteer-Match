import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import * as api from "../services/api";

export default function MapPage() {
  const [pos, setPos] = useState({ lat: 17.385044, lng: 78.486671 });
  const [radiusKm, setRadiusKm] = useState(15);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("Getting your location...");

  // Get current location (Hyderabad)
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported. Using Hyderabad center.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setStatus("Using your current location.");
      },
      () => {
        setStatus("Location denied. Using Hyderabad center.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Fetch nearby events from MongoDB
  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const list = await api.listEventsNear({
          lat: pos.lat,
          lng: pos.lng,
          radiusKm
        });
        setEvents(list);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Failed to load events");
      }
    })();
  }, [pos.lat, pos.lng, radiusKm]);

  const center = useMemo(() => [pos.lat, pos.lng], [pos]);

  return (
    <div className="page">
      <h1 className="pageTitle">Map View</h1>
      <div className="pageSub">{status}</div>

      {/* small debug */}
      <div style={{ marginTop: 10, fontSize: 14 }}>
        <b>Coords:</b> {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)} <br />
        <b>Events found:</b> {events.length}
      </div>

      <div style={{ marginTop: 10 }}>
        <select
          className="pillBtn"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={15}>15 km</option>
          <option value={25}>25 km</option>
        </select>
      </div>

      {err ? <div className="errorText" style={{ marginTop: 10 }}>{err}</div> : null}

      <div className="mapBox" style={{ marginTop: 12 }}>
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={center}>
            <Popup><b>You are here</b></Popup>
          </Marker>

          <Circle center={center} radius={radiusKm * 1000} />

          {events.map((ev) => {
            const lat = ev.location?.coordinates?.[1];
            const lng = ev.location?.coordinates?.[0];
            if (!lat || !lng) return null;

            return (
              <Marker key={ev._id} position={[lat, lng]}>
                <Popup>
                  <b>{ev.title}</b><br />
                  {ev.address}<br />
                  {ev.distanceKm} km • {ev.points} pts
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
