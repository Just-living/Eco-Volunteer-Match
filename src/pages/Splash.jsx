import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeafLogo from "../components/LeafLogo";

export default function Splash() {
  const navigate = useNavigate();
  const slides = useMemo(
    () => [
      { title: "Eco-Volunteer Match", subtitle: "Volunteer locally. Impact globally." },
      { title: "Find Local Events", subtitle: "Cleanups, planting, sustainability drives." },
      { title: "Earn Rewards", subtitle: "Track points, badges, and impact." },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setActive((p) => (p + 1) % slides.length), 1200);
    const t2 = setTimeout(() => navigate("/auth"), 2200);
    return () => {
      clearInterval(t1);
      clearTimeout(t2);
    };
  }, [navigate, slides.length]);

  return (
    <div className="splash" onClick={() => navigate("/auth")} role="button" tabIndex={0}>
      <div className="splashCenter">
        <div className="splashLogo">
          <LeafLogo size={78} strokeWidth={3.2} />
        </div>

        <h1 className="splashTitle">{slides[active].title}</h1>
        <div className="splashBadge">Preview</div>
        <p className="splashSubtitle">{slides[active].subtitle}</p>

        <div className="dots" aria-label="carousel dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === active ? "dotActive" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
            />
          ))}
        </div>

        <div className="splashHint">Click anywhere to continue</div>
      </div>
    </div>
  );
}
