import React, { useEffect, useState } from "react";
import { Gift, ShoppingBag, Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

function RewardCard({ reward, onRedeem, disabled }) {
  return (
    <div className="card">
      <div className="rowBetween">
        <div className="row" style={{ gap: 12 }}>
          <div className="badgeIcon">🎁</div>
          <div>
            <div className="bold" style={{ fontSize: 18 }}>
              {reward.title}
            </div>
            <div className="mutedSmall">{reward.description}</div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="bold" style={{ fontSize: 18 }}>
            {reward.cost} pts
          </div>
          <button
            className="primaryBtn smallBtn"
            onClick={() => onRedeem(reward._id || reward.id)}
            disabled={disabled}
            type="button"
            style={{ marginTop: 10, width: "140px" }}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Rewards() {
  const { me, refreshMe } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const list = await api.listRewards();
      setRewards(list);
    })();
  }, []);

  async function onRedeem(rewardId) {
    setErr("");
    setMsg("");
    try {
      await api.redeemReward(rewardId);
      await refreshMe();
      setMsg("Redeemed successfully ✅");
    } catch (e) {
      setErr(e?.message || "Redeem failed");
    }
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Rewards</h1>
          <div className="pageSub">Use your points to redeem eco rewards</div>
        </div>

        <div className="pillInfo">
          <Trophy size={18} />
          <span className="bold">{me?.points ?? 0}</span>
          <span className="mutedSmall">points</span>
        </div>
      </div>

      <div className="card">
        <div className="cardTitleRow">
          <div className="cardTitle">
            <Gift size={18} /> Reward Store
          </div>
          <div className="mutedSmall">Redeem what you love</div>
        </div>

        {msg ? <div className="successText">{msg}</div> : null}
        {err ? <div className="errorText">{err}</div> : null}

        <div className="grid1" style={{ marginTop: 12 }}>
          {rewards.length === 0 ? (
            <div className="mutedSmall">No rewards available at the moment.</div>
          ) : (
            rewards.map((r) => (
              <RewardCard
                key={r._id || r.id}
                reward={r}
                onRedeem={onRedeem}
                disabled={(me?.points ?? 0) < r.cost}
              />
            ))
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="cardTitleRow">
          <div className="cardTitle">
            <ShoppingBag size={18} /> Tips to earn more points
          </div>
        </div>
        <ul className="list">
          <li>Join higher-point events like cleanups and planting.</li>
          <li>Post your volunteering stories to motivate others.</li>
          <li>Maintain a streak: volunteer every week.</li>
        </ul>
      </div>
    </div>
  );
}
