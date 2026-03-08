import React, { useEffect, useMemo, useState } from "react";
import { Search, Map, SlidersHorizontal, CalendarDays, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

function StatCard({ icon, value, label, tintClass }) {
  return (
    <div className={`statCard ${tintClass}`}>
      <div className="statIcon">{icon}</div>
      <div>
        <div className="statValue">{value}</div>
        <div className="statLabel">{label}</div>
      </div>
    </div>
  );
}

function EventCard({ ev, joined, onJoin }) {
  return (
    <div className="eventCard">
      <div className="eventTop">
        <div>
          <div className="eventTitle">{ev.title}</div>
          <div className="eventTag">{ev.category}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="eventPoints">
            <span className="eventPointsIcon">🏅</span>
            {ev.points}
          </div>

          <button
            className="pillBtn"
            onClick={() => onJoin(ev._id || ev.id)}
            disabled={joined}
            style={{ opacity: joined ? 0.6 : 1 }}
            type="button"
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>
      </div>

      <div className="eventMeta">
        <div className="metaRow">
          <CalendarDays size={16} />
          <span>{new Date(ev.dateISO).toDateString()}</span>
        </div>
        <div className="metaRow">
          <MapPin size={16} />
          <span>
            {ev.address || ev.location} {ev.distanceKm ? <span className="muted">• {ev.distanceKm} km</span> : null}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { me, refreshMe } = useAuth();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.listEvents({ q, category });
        setEvents(list);
      } catch (error) {
        console.error("Failed to load events:", error);
        setEvents([]);
      }
    })();
  }, [q, category]);

  const joinedCount = me?.joinedEventIds?.length || 0;

  const nearbyCount = useMemo(() => {
    return events.filter((e) => e.distanceKm <= 5).length;
  }, [events]);

  async function onJoin(eventId) {
    await api.joinEvent(eventId);
    await refreshMe();
  }

  return (
    <div className="page">
      <div className="topRow">
        <div>
          <h1 className="hello">
            Welcome back, {me?.name?.split(" ")[0] || "Friend"} <span className="wave">👋</span>
          </h1>
          <div className="subHello">Find your next volunteering opportunity</div>
        </div>

        <button className="pillBtn" type="button">
          <Map size={18} /> Map View
        </button>
      </div>

      <div className="searchRow">
        <div className="searchBox">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events by name, location, or category..."
          />
        </div>

        <button className="pillBtn" type="button">
          <SlidersHorizontal size={18} /> Filters
        </button>

        <select
          className="pillBtn"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "12px 12px" }}
        >
          <option value="all">All</option>
          <option value="cleanup">Cleanup</option>
          <option value="planting">Planting</option>
          <option value="recycling">Recycling</option>
        </select>
      </div>

      <div className="stats">
        <StatCard tintClass="tintGreen" icon={<span>🏅</span>} value={me?.points ?? 0} label="Total Points" />
        <StatCard tintClass="tintBlue" icon={<span>📅</span>} value={joinedCount} label="Events Joined" />
        <StatCard tintClass="tintPurple" icon={<span>📍</span>} value={nearbyCount} label="Nearby Events" />
        <StatCard tintClass="tintYellow" icon={<span>🏆</span>} value={me?.badges?.length ?? 0} label="Badges Earned" />
      </div>

      <h2 className="sectionTitle">Upcoming Events Near You</h2>

      <div className="eventsGrid">
        {events.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            No events found. Try adjusting your search or filters.
          </div>
        ) : (
          events.map((ev) => (
            <EventCard
              key={ev._id || ev.id}
              ev={ev}
              joined={me?.joinedEventIds?.some((id) => String(id) === String(ev._id || ev.id))}
              onJoin={onJoin}
            />
          ))
        )}
      </div>
    </div>
  );
}
