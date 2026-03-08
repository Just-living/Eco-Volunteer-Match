import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Splash from "./pages/Splash";
import Auth from "./pages/Auth";

import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/community";
import Rewards from "./pages/rewards";
import Profile from "./pages/profile";
import MapPage from "./pages/MapPage";


function Protected({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        Loading...
      </div>
    );
  }

  return token ? children : <Navigate to="/auth" replace />;
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/auth" element={<Auth />} />

      {/* Shared layout for all /app pages */}
      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="community" element={<Community />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="profile" element={<Profile />} />
        <Route path="map" element={<MapPage />} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
