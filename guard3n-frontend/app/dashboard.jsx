"use client";

import { useState } from "react";

const MOCK_BARANGAYS = [
  { rank: 1, name: "Brgy. Bagong Pag-asa", city: "Quezon City", trees: 3240, donors: 812, tokens: "48,600", change: "+8.2%", up: true },
  { rank: 2, name: "Brgy. Holy Spirit", city: "Quezon City", trees: 2980, donors: 754, tokens: "44,700", change: "+5.1%", up: true },
  { rank: 3, name: "Brgy. Matandang Balara", city: "Quezon City", trees: 2710, donors: 690, tokens: "40,650", change: "+3.8%", up: true },
  { rank: 4, name: "Brgy. Tandang Sora", city: "Quezon City", trees: 2450, donors: 601, tokens: "36,750", change: "-1.2%", up: false },
  { rank: 5, name: "Brgy. Payatas", city: "Quezon City", trees: 2100, donors: 530, tokens: "31,500", change: "+2.4%", up: true },
];

const MILESTONES = [
  { label: "Total Trees Planted", value: "1,24,000", sub: "Nationwide", icon: "tree" },
  { label: "Active Parks", value: "38", sub: "Across 12 cities", icon: "park" },
  { label: "GR3EN Minted", value: "₱2.4M", sub: "Total value locked", icon: "coin" },
  { label: "Verified Milestones", value: "214", sub: "On Stellar testnet", icon: "check" },
];

function TreeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-7" /><path d="M9 9H5l7-7 7 7h-4" /><path d="M9 15H5l7-7 7 7h-4" />
    </svg>
  );
}

function ParkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 3h4.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function UpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#a3e635" stroke="none">
      <path d="M12 4l8 16H4z" />
    </svg>
  );
}

function DownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
      <path d="M12 20l8-16H4z" />
    </svg>
  );
}

const iconMap = { tree: <TreeIcon />, park: <ParkIcon />, coin: <CoinIcon />, check: <CheckIcon /> };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("barangay");

  const s = {
    wrap: {
      width: "100%",
      height: "100%",
      overflowY: "auto",
      background: "transparent",
      color: "#f0fdf4",
      fontFamily: "'Space Grotesk', sans-serif",
      paddingBottom: "2rem",
    },
    header: {
      padding: "1.25rem 1.25rem 0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "1.2rem",
      fontWeight: 700,
      background: "linear-gradient(135deg, #a3e635, #84cc16, #22c55e)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.02em",
    },
    badge: {
      fontSize: "0.65rem",
      color: "#a3e635",
      border: "1px solid rgba(163,230,53,0.3)",
      borderRadius: "999px",
      padding: "2px 10px",
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.04em",
    },
    tabs: {
      display: "flex",
      margin: "0.75rem 1.25rem",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(132,204,22,0.1)",
      borderRadius: "0.75rem",
      padding: "3px",
      gap: "3px",
    },
    tab: (active) => ({
      flex: 1,
      padding: "0.45rem 0",
      borderRadius: "0.6rem",
      fontSize: "0.72rem",
      fontWeight: 600,
      textAlign: "center",
      cursor: "pointer",
      border: "none",
      background: active ? "linear-gradient(135deg,#a3e635,#84cc16)" : "transparent",
      color: active ? "#0a0f0a" : "#4b6b4b",
      transition: "all 0.2s",
    }),
    sectionLabel: {
      fontSize: "0.7rem",
      fontWeight: 600,
      color: "#4b6b4b",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      margin: "1rem 1.25rem 0.5rem",
    },
    milestoneGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.6rem",
      margin: "0 1.25rem",
    },
    milestoneCard: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(132,204,22,0.12)",
      borderRadius: "1rem",
      padding: "0.85rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
    },
    milestoneValue: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "1.3rem",
      fontWeight: 700,
      color: "#f0fdf4",
      lineHeight: 1,
    },
    milestoneSub: {
      fontSize: "0.65rem",
      color: "#4b6b4b",
    },
    milestoneLabel: {
      fontSize: "0.7rem",
      color: "#a3e635",
      fontWeight: 600,
    },
    rankList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      margin: "0 1.25rem",
    },
    rankCard: (rank) => ({
      background: rank === 1 ? "rgba(163,230,53,0.06)" : "rgba(255,255,255,0.02)",
      border: rank === 1 ? "1px solid rgba(163,230,53,0.25)" : "1px solid rgba(132,204,22,0.08)",
      borderRadius: "1rem",
      padding: "0.85rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    }),
    rankNum: (rank) => ({
      fontFamily: "'Syne', sans-serif",
      fontSize: "1rem",
      fontWeight: 700,
      color: rank === 1 ? "#a3e635" : "#2d4a2d",
      minWidth: "1.5rem",
      textAlign: "center",
    }),
    rankInfo: {
      flex: 1,
    },
    rankName: {
      fontSize: "0.78rem",
      fontWeight: 600,
      color: "#f0fdf4",
      lineHeight: 1.3,
    },
    rankCity: {
      fontSize: "0.65rem",
      color: "#4b6b4b",
    },
    rankStats: {
      textAlign: "right",
    },
    rankTrees: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "0.85rem",
      fontWeight: 700,
      color: "#a3e635",
    },
    rankTokens: {
      fontSize: "0.62rem",
      color: "#4b6b4b",
    },
    rankChange: (up) => ({
      display: "flex",
      alignItems: "center",
      gap: "3px",
      fontSize: "0.62rem",
      color: up ? "#a3e635" : "#ef4444",
      justifyContent: "flex-end",
      marginTop: "2px",
    }),
    divider: {
      height: "1px",
      background: "rgba(132,204,22,0.08)",
      margin: "1rem 1.25rem",
    },
    phFlag: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      margin: "0 1.25rem 0.5rem",
    },
    flagBar: {
      height: "3px",
      flex: 1,
      borderRadius: "999px",
      background: "linear-gradient(90deg, #0038a8 33%, #ffffff 33%, #ffffff 66%, #ce1126 66%)",
      opacity: 0.4,
    },
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>Barangay Board</span>
        <span style={s.badge}>PH LIVE</span>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button style={s.tab(activeTab === "barangay")} onClick={() => setActiveTab("barangay")}>
          Top Barangays
        </button>
        <button style={s.tab(activeTab === "milestones")} onClick={() => setActiveTab("milestones")}>
          PH Milestones
        </button>
      </div>

      {/* ── TOP BARANGAYS TAB ── */}
      {activeTab === "barangay" && (
        <>
          <p style={s.sectionLabel}>Ranked by Trees Planted</p>
          <div style={s.rankList}>
            {MOCK_BARANGAYS.map((b) => (
              <div key={b.rank} style={s.rankCard(b.rank)}>
                <div style={s.rankNum(b.rank)}>#{b.rank}</div>
                <div style={s.rankInfo}>
                  <div style={s.rankName}>{b.name}</div>
                  <div style={s.rankCity}>{b.city} · {b.donors} donors</div>
                </div>
                <div style={s.rankStats}>
                  <div style={s.rankTrees}>{b.trees.toLocaleString()} 🌳</div>
                  <div style={s.rankTokens}>{b.tokens} GR3EN</div>
                  <div style={s.rankChange(b.up)}>
                    {b.up ? <UpIcon /> : <DownIcon />}
                    {b.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={s.divider} />

          <p style={s.sectionLabel}>Nationwide Summary</p>
          <div style={s.milestoneGrid}>
            {MILESTONES.map((m) => (
              <div key={m.label} style={s.milestoneCard}>
                {iconMap[m.icon]}
                <div style={s.milestoneValue}>{m.value}</div>
                <div style={s.milestoneLabel}>{m.label}</div>
                <div style={s.milestoneSub}>{m.sub}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── PH MILESTONES TAB ── */}
      {activeTab === "milestones" && (
        <>
          <div style={s.phFlag}>
            <div style={s.flagBar} />
            <span style={{ fontSize: "0.65rem", color: "#4b6b4b", whiteSpace: "nowrap" }}>Philippines</span>
            <div style={s.flagBar} />
          </div>

          <p style={s.sectionLabel}>National Milestones</p>
          <div style={s.milestoneGrid}>
            {MILESTONES.map((m) => (
              <div key={m.label} style={s.milestoneCard}>
                {iconMap[m.icon]}
                <div style={s.milestoneValue}>{m.value}</div>
                <div style={s.milestoneLabel}>{m.label}</div>
                <div style={s.milestoneSub}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div style={s.divider} />

          <p style={s.sectionLabel}>Recent Verified Milestones</p>
          <div style={s.rankList}>
            {[
              { park: "QC Memorial Circle", date: "Mar 28, 2025", trees: 120, txn: "GAB3...F92C" },
              { park: "Rizal Park, Manila", date: "Mar 25, 2025", trees: 85, txn: "GCD1...A04E" },
              { park: "La Mesa Eco Park", date: "Mar 21, 2025", trees: 200, txn: "GEF7...B31A" },
              { park: "Paco Park, Manila", date: "Mar 18, 2025", trees: 60, txn: "GHK2...C77D" },
            ].map((m, i) => (
              <div key={i} style={{ ...s.rankCard(0), flexDirection: "column", alignItems: "flex-start", gap: "0.35rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={s.rankName}>{m.park}</span>
                  <span style={{ fontSize: "0.65rem", color: "#a3e635", fontWeight: 600 }}>{m.trees} trees</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={s.rankCity}>{m.date}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#2d4a2d" }}>{m.txn}</span>
                </div>
                <div style={{ height: "3px", width: "100%", borderRadius: "999px", background: "rgba(163,230,53,0.1)" }}>
                  <div style={{ height: "100%", width: `${(m.trees / 200) * 100}%`, borderRadius: "999px", background: "linear-gradient(90deg,#a3e635,#22c55e)" }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}