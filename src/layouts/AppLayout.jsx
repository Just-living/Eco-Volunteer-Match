import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import LeafLogo from "../components/LeafLogo";
import { Home, Users, Gift, User, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const navigate = useNavigate();
  const { me, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="sideBrand">
          <div className="sideIcon">
            <LeafLogo size={34} strokeWidth={3} />
          </div>
          <div>
            <div className="sideTitle">Eco-Volunteer</div>
            <div className="sideSub">Match</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            to="/app"
            end
            className={({ isActive }) => (isActive ? "navItem navActive" : "navItem")}
          >
            <Home size={20} /> <span>Home</span>
          </NavLink>

          <NavLink
            to="/app/community"
            className={({ isActive }) => (isActive ? "navItem navActive" : "navItem")}
          >
            <Users size={20} /> <span>Community</span>
          </NavLink>

          <NavLink
            to="/app/map"
            className={({ isActive }) => (isActive ? "navItem navActive" : "navItem")}
          >
            <MapPin size={20} /> <span>Map</span>
          </NavLink>

          <NavLink
            to="/app/rewards"
            className={({ isActive }) => (isActive ? "navItem navActive" : "navItem")}
          >
            <Gift size={20} /> <span>Rewards</span>
          </NavLink>

          <NavLink
            to="/app/profile"
            className={({ isActive }) => (isActive ? "navItem navActive" : "navItem")}
          >
            <User size={20} /> <span>Profile</span>
          </NavLink>
        </nav>

        <div className="profileCard">
          <div className="avatar">🙂</div>
          <div className="profileText">
            <div className="profileName">{me?.name || "User"}</div>
            <div className="profilePoints">{me?.points ?? 0} points</div>
          </div>
          <button className="ghostBtn" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      {/* All /app pages render here */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
