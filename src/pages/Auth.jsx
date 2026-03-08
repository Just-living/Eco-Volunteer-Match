import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeafLogo from "../components/LeafLogo";
import { Eye, EyeOff, Mail, Lock, User2, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPw, setShowPw] = useState(false);

  // Signup fields
  const [name, setName] = useState("Sarah Johnson");
  const [city, setCity] = useState("Hyderabad");

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const leftItems = useMemo(
    () => [
      { icon: "🌱", title: "Find Local Events", desc: "Discover volunteering opportunities near you" },
      { icon: "🤝", title: "Join Community", desc: "Connect with like-minded volunteers" },
      { icon: "🏆", title: "Earn Rewards", desc: "Track your impact and achievements" },
    ],
    []
  );

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      if (mode === "signup") {
        // Basic validation
        if (!name.trim()) throw new Error("Name is required");
        if (!city.trim()) throw new Error("City is required");
        if (!email.trim()) throw new Error("Email is required");
        if (password.trim().length < 6) throw new Error("Password must be at least 6 characters");

        await register({
          name: name.trim(),
          city: city.trim(),
          email: email.trim(),
          password: password.trim(),
        });
      } else {
        await login(email.trim(), password.trim());
      }

      navigate("/app");
    } catch (e2) {
      // Axios errors: e2.response.data.message
      const msg = e2?.response?.data?.message || e2?.message || "Auth failed";
      setErr(msg);
      console.log("AUTH ERROR:", e2?.response?.status, e2?.response?.data || e2?.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authPage">
      <div className="authShell">
        <aside className="authLeft">
          <div className="brandRow">
            <div className="brandIcon">
              <LeafLogo size={44} strokeWidth={3} />
            </div>
            <div>
              <div className="brandTitle">Eco-Volunteer</div>
              <div className="brandTitle">Match</div>
            </div>
          </div>

          <div className="tagline">Volunteer locally. Impact globally.</div>

          <div className="featureList">
            {leftItems.map((x) => (
              <div className="feature" key={x.title}>
                <div className="featureIcon">{x.icon}</div>
                <div>
                  <div className="featureTitle">{x.title}</div>
                  <div className="featureDesc">{x.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="authRight">
          <div className="authCard">
            <h1 className="authHeading">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
            <div className="authSub">
              {mode === "login"
                ? "Login to continue your journey"
                : "Sign up to start volunteering near you"}
            </div>

            <div className="segmented">
              <button
                className={`segBtn ${mode === "login" ? "segActive" : ""}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={`segBtn ${mode === "signup" ? "segActive" : ""}`}
                onClick={() => setMode("signup")}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={onSubmit} className="form">
              {err ? <div style={{ color: "crimson", fontWeight: 900, marginBottom: 10 }}>{err}</div> : null}

              {mode === "signup" && (
                <>
                  <label className="label">Full Name</label>
                  <div className="inputWrap">
                    <User2 size={18} className="inputIcon" />
                    <input
                      className="input"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <label className="label" style={{ marginTop: 14 }}>
                    City
                  </label>
                  <div className="inputWrap">
                    <MapPin size={18} className="inputIcon" />
                    <input
                      className="input"
                      placeholder="Hyderabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <label className="label" style={{ marginTop: mode === "signup" ? 14 : 0 }}>
                Email
              </label>
              <div className="inputWrap">
                <Mail size={18} className="inputIcon" />
                <input
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label className="label" style={{ marginTop: 14 }}>
                Password
              </label>
              <div className="inputWrap">
                <Lock size={18} className="inputIcon" />
                <input
                  className="input"
                  placeholder="Minimum 6 characters"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="iconBtn"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label="toggle password visibility"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="primaryBtn" type="submit" disabled={busy}>
                {busy ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
              </button>

              {mode === "login" ? (
                <div className="finePrint">
                  Don’t have an account?{" "}
                  <span className="linkLike" onClick={() => setMode("signup")} role="button">
                    Sign up
                  </span>
                </div>
              ) : (
                <div className="finePrint">
                  Already have an account?{" "}
                  <span className="linkLike" onClick={() => setMode("login")} role="button">
                    Login
                  </span>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
