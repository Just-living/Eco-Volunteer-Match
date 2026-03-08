import React, { useEffect, useState } from "react";
import { Save, User2, MapPin, Tags } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

export default function Profile() {
  const { me, refreshMe } = useAuth();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [interests, setInterests] = useState(""); // comma separated
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!me) return;
    setName(me.name || "");
    setCity(me.city || "");
    setInterests((me.interests || []).join(", "));
  }, [me]);

  async function onSave(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const patch = {
        name: name.trim() || "Volunteer",
        city: city.trim() || "Your City",
        interests: interests
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };
      await api.updateMe(patch);

      await refreshMe();
      setMsg("Profile updated ✅");
    } catch (e2) {
      setErr(e2?.message || "Failed to update profile");
    }
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Profile</h1>
          <div className="pageSub">Update your details & preferences</div>
        </div>
      </div>

      <div className="card">
        <div className="cardTitleRow">
          <div className="cardTitle">
            <User2 size={18} /> Your Profile
          </div>
          <div className="mutedSmall">Saved locally (fake DB)</div>
        </div>

        {msg ? <div className="successText">{msg}</div> : null}
        {err ? <div className="errorText">{err}</div> : null}

        <form onSubmit={onSave} className="formGrid">
          <div>
            <label className="label">Name</label>
            <div className="inputWrap">
              <User2 size={18} className="inputIcon" />
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">City</label>
            <div className="inputWrap">
              <MapPin size={18} className="inputIcon" />
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label className="label">Interests (comma separated)</label>
            <div className="inputWrap">
              <Tags size={18} className="inputIcon" />
              <input
                className="input"
                placeholder="cleanup, planting, recycling"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="primaryBtn smallBtn" type="submit">
              <Save size={16} /> Save changes
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardTitleRow">
          <div className="cardTitle">Quick stats</div>
        </div>
        <div className="statsRow">
          <div className="miniStat">
            <div className="miniValue">{me?.points ?? 0}</div>
            <div className="mutedSmall">Points</div>
          </div>
          <div className="miniStat">
            <div className="miniValue">{me?.joinedEventIds?.length ?? 0}</div>
            <div className="mutedSmall">Events joined</div>
          </div>
          <div className="miniStat">
            <div className="miniValue">{me?.badges?.length ?? 0}</div>
            <div className="mutedSmall">Badges</div>
          </div>
        </div>
      </div>
    </div>
  );
}
