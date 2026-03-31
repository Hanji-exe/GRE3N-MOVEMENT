"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import WalletConnect from "@/components/WalletConnect";
import ProfileScreen from "@/app/profile";
import TreeCard from "@/components/TreeCard";
import Dashboard from "@/app/dashboard";

// Dynamic import — required to avoid Leaflet SSR crash in Next.js App Router
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [walletAddress, setWalletAddress] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [selectedParkForDonate, setSelectedParkForDonate] = useState(null);

  const handleDonateFromMap = (park) => {
    setSelectedParkForDonate(park);
    setActiveNav("donate");
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(132,204,22,0.15) 0%, #0a0f0a 60%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
      fontFamily: "'Space Grotesk', sans-serif",
    }}>

      {/* Ambient glow orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(132,204,22,0.08) 0%, transparent 70%)",
          top: "5%", left: "50%", transform: "translateX(-50%)",
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300,
          background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          bottom: "10%", right: "15%",
        }} />
      </div>

      {/* Phone Frame */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 390,
        height: 844,
        borderRadius: "3rem",
        border: "8px solid #1a2410",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(132,204,22,0.15), 0 40px 80px rgba(0,0,0,0.8), inset 0 0 60px rgba(132,204,22,0.03)",
        background: "#0a0f0a",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Notch */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 126, height: 30, background: "#0a0f0a",
          borderRadius: "0 0 1.2rem 1.2rem",
          border: "1px solid #1a2410",
          zIndex: 999,
        }} />

        {/* Status Bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0.6rem 1.8rem 0",
          marginTop: "0.2rem",
          flexShrink: 0,
        }}>
          <span style={{ color: "#e8f5e9", fontSize: "0.75rem", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>9:41</span>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <span style={{ color: "#86efac", fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace" }}>LTE</span>
            <div style={{
              width: 22, height: 11, border: "1.5px solid #86efac", borderRadius: 3,
              position: "relative", display: "flex", alignItems: "center", padding: "1px",
            }}>
              <div style={{ width: "70%", height: "100%", background: "#84cc16", borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {screen === "landing" ? (
            <LandingScreen
              onGetStarted={() => setScreen("home")}
              onConnect={setWalletAddress}
            />
          ) : (
            <>
              {activeNav === "home" && (
                <HomeScreen walletAddress={walletAddress} />
              )}
              {activeNav === "map" && (
                <MapScreen onDonate={handleDonateFromMap} />
              )}
              {activeNav === "donate" && (
                <DonateScreen
                  selectedPark={selectedParkForDonate}
                  onClear={() => setSelectedParkForDonate(null)}
                />
              )}
{activeNav === "dashboard" && <Dashboard />}

{activeNav === "profile" && <ProfileScreen walletAddress={walletAddress} />}


            </>
          )}
        </div>

        {/* Bottom Nav */}
        {screen === "home" && (
          <BottomNav active={activeNav} setActive={setActiveNav} />
        )}

        {/* Home Indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "0.5rem", flexShrink: 0 }}>
          <div style={{ width: 120, height: 4, background: "#1a2410", borderRadius: 999 }} />
        </div>

      </div>
    </main>
  );
}

// ─── LANDING SCREEN ──────────────────────────────────────────────────────────

function LandingScreen({ onGetStarted, onConnect }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "2.5rem 1.5rem 2rem",
      textAlign: "center",
    }}>

      {/* Badge */}
      <div style={{
        background: "rgba(146, 22, 204, 0.1)",
        border: "1px solid rgba(116, 22, 204, 0.25)",
        color: "#e209ff",
        fontSize: "0.6rem",
        fontWeight: 700,
        padding: "0.35rem 1rem",
        borderRadius: 999,
        marginTop: "1.5rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
      }}>
        Powered by Stellar Blockchain
      </div>

      {/* Tree Illustration */}
      <div style={{
        width: 200, height: 200,
        background: "radial-gradient(circle at 40% 40%, rgba(132,204,22,0.18), rgba(34,197,94,0.06) 60%, transparent)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(132,204,22,0.1)",
      }}>
        <svg width="90" height="110" viewBox="0 0 90 110" fill="none">
          <rect x="38" y="75" width="14" height="30" rx="4" fill="#1a2e1a" />
          <ellipse cx="45" cy="55" rx="35" ry="40" fill="rgba(132,204,22,0.15)" />
          <ellipse cx="45" cy="50" rx="28" ry="32" fill="rgba(132,204,22,0.2)" />
          <ellipse cx="45" cy="44" rx="20" ry="24" fill="#84cc16" opacity="0.9" />
          <ellipse cx="45" cy="38" rx="13" ry="16" fill="#a3e635" />
        </svg>
      </div>

      {/* Headline */}
      <div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2.8rem",
          fontWeight: 750,
          lineHeight: 2,
          marginBottom: "0.75rem",
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #a3e635, #84cc16, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          GUARD3N
        </h1>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "#f0fdf4",
          letterSpacing: "0.05em",
          marginBottom: "0.75rem",
          textTransform: "uppercase",
        }}>
          Join the GRE3N Movement
        </p>
        <p style={{
          color: "#4b6b4b",
          fontSize: "0.78rem",
          lineHeight: 1.6,
          maxWidth: 240,
          margin: "10px auto",
        }}>
          Fund real trees in real parks.<br />
          Earn GR3EN tokens on Stellar.
        </p>
      </div>

      {/* CTA */}
      <WalletConnect onConnect={(key) => { onConnect(key); onGetStarted(); }} />

    </div>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────

function HomeScreen({ walletAddress }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "1rem 1.5rem",
      gap: "1rem",
      overflowY: "auto",
    }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 42, height: 42,
            background: "linear-gradient(135deg, #a3e635, #84cc16)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="4" fill="#0a0f0a" />
              <path d="M2 17c0-4 3.6-7 8-7s8 3 8 7" stroke="#0a0f0a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p style={{
              color: "#f0fdf4", fontWeight: 700, fontSize: "1.25em",
              fontFamily: "'Syne', sans-serif",
            }}>
              Guardian
            </p>
            <p style={{
              color: "#4b6b4b", fontSize: "0.62rem",
              letterSpacing: "0.05em",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {walletAddress ? "ID :" + walletAddress.slice(0, 24) : "Not connected"}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            <svg key="search" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="#a3e635" strokeWidth="1.5" /><path d="M11 11L14 14" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" /></svg>,
            <svg key="bell" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a4 4 0 0 0-4 4v3l-1 2h10l-1-2V6a4 4 0 0 0-4-4z" stroke="#a3e635" strokeWidth="1.5" strokeLinejoin="round" /><path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="#a3e635" strokeWidth="1.5" /></svg>,
          ].map((icon, i) => (
            <div key={i} style={{
              width: 38, height: 38,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(132,204,22,0.12)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>{icon}</div>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["24h", "Week", "Month", "All Time"].map((t, i) => (
          <button key={t} style={{
            padding: "0.3rem 0.75rem",
            borderRadius: 999,
            border: "1px solid rgba(132,204,22,0.15)",
            cursor: "pointer",
            fontSize: "0.68rem",
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
            background: i === 1
              ? "linear-gradient(135deg, #a3e635, #84cc16)"
              : "rgba(255,255,255,0.03)",
            color: i === 1 ? "#0a0f0a" : "#6b7280",
          }}>{t}</button>
        ))}
      </div>

      {/* GR3EN Token Card */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(132,204,22,0.15)",
        borderRadius: "1.5rem",
        padding: "1.25rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #a3e635, #84cc16)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M4 4l3-3 3 3M4 10l3 3 3-3" stroke="#0a0f0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: "0.9rem" }}>GR3EN</p>
              <p style={{ color: "#4b6b4b", fontSize: "0.62rem" }}>1 GR3EN = ₱50 donated</p>
            </div>
          </div>
          <div style={{
            width: 32, height: 32,
            background: "rgba(132,204,22,0.08)",
            border: "1px solid rgba(132,204,22,0.2)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "#a3e635",
            fontSize: "0.9rem",
            fontWeight: 700,
          }}>⇄</div>
        </div>

        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2rem",
          fontWeight: 800,
          color: "#f0fdf4",
          marginBottom: "0.2rem",
        }}>2,450.00 <span style={{ fontSize: "1rem", color: "#4b6b4b" }}>GR3EN</span></p>

        <p style={{ color: "#a3e635", fontSize: "0.72rem", fontWeight: 600 }}>
          +12.4% this week
        </p>

        <svg width="100%" height="48" style={{ marginTop: "0.75rem" }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#84cc16" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a3e635" />
            </linearGradient>
          </defs>
          <polyline
            points="0,42 40,32 80,36 120,22 160,27 200,12 240,17 280,6 320,13"
            fill="none"
            stroke="url(#chartGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="320" cy="13" r="4" fill="#a3e635" />
        </svg>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
        {[
          { value: "1,240", label: "Trees" },
          { value: "38", label: "Parks" },
          { value: "₱2.4M", label: "Minted" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(132,204,22,0.08)",
            borderRadius: "1rem",
            padding: "0.85rem 0.5rem",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #a3e635, #84cc16)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{stat.value}</div>
            <div style={{
              color: "#4b6b4b", fontSize: "0.6rem",
              textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2rem",
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <p style={{
          color: "#4b6b4b", fontSize: "0.68rem",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem",
        }}>Recent Activity</p>
        {[
          { park: "Quezon Memorial Circle", amount: "+50 GR3EN", time: "2m ago" },
          { park: "La Mesa Eco Park", amount: "+120 GR3EN", time: "1h ago" },
          { park: "Ninoy Aquino Parks", amount: "+75 GR3EN", time: "3h ago" },
        ].map((item) => (
          <div key={item.park} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.75rem 0",
            borderBottom: "1px solid rgba(132,204,22,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 36, height: 36,
                background: "rgba(132,204,22,0.08)",
                border: "1px solid rgba(132,204,22,0.12)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v8M4 7l3 4 3-4" stroke="#84cc16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="11" width="8" height="1.5" rx="0.75" fill="#84cc16" />
                </svg>
              </div>
              <div>
                <p style={{ color: "#f0fdf4", fontSize: "0.78rem", fontWeight: 600 }}>{item.park}</p>
                <p style={{ color: "#4b6b4b", fontSize: "0.62rem" }}>{item.time}</p>
              </div>
            </div>
            <p style={{ color: "#a3e635", fontSize: "0.78rem", fontWeight: 700 }}>{item.amount}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

// ─── MAP SCREEN ───────────────────────────────────────────────────────────────

function MapScreen({ onDonate }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "0.75rem 1.5rem 0.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,  // ← prevents header from being squished
      }}>
        <div>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#f0fdf4",
          }}>Park Map</p>
          <p style={{
            color: "#4b6b4b",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>Metro Manila · 5 Parks</p>
        </div>
        <div style={{
          background: "rgba(132,204,22,0.08)",
          border: "1px solid rgba(132,204,22,0.2)",
          borderRadius: "0.6rem",
          padding: "0.3rem 0.65rem",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a3e635", boxShadow: "0 0 6px #a3e635" }} />
          <span style={{
            color: "#a3e635", fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
          }}>Live</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ flexShrink: 0 }}>
        <MapView onDonate={onDonate} />
      </div>
    </div>
  );
}

// ─── DONATE SCREEN (placeholder) ─────────────────────────────────────────────

function DonateScreen({ selectedPark, onClear }) {
  const [park, setPark] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select");
  const [treeData, setTreeData] = useState(null);

  const [parks, setParks] = useState(() => {
    const saved = localStorage.getItem("guard3n_parks");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Quezon Memorial Circle", trees: 340, goal: 500, species: "Narra" },
      { id: 2, name: "La Mesa Eco Park", trees: 210, goal: 400, species: "Molave" },
      { id: 3, name: "Ninoy Aquino Parks", trees: 180, goal: 300, species: "Kamagong" },
      { id: 4, name: "Arroceros Forest Park", trees: 95, goal: 200, species: "Talisay" },
      { id: 5, name: "Rizal Park", trees: 415, goal: 600, species: "Acacia" },
    ];
  });

  const activePark = park || (selectedPark ? parks.find(p => p.name === selectedPark.name) : null);

  const mockSorobanDonate = async (parkName, amountGr3en) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          txHash: "0x" + Math.random().toString(16).slice(2, 18).toUpperCase(),
          gr3enSpent: amountGr3en,
          species: parks.find(p => p.name === parkName)?.species || "Narra",
        });
      }, 1800);
    });
  };

  const handleDonate = async () => {
    if (!activePark || Number(amount) < 1) return;
    setLoading(true);

    const gr3en = Number(amount);
    const result = await mockSorobanDonate(activePark.name, gr3en);

    // Update park progress
    const updatedParks = parks.map(p => {
      if (p.id !== activePark.id) return p;
      const newTrees = Math.min(p.trees + Math.floor(gr3en / 50), p.goal);
      return { ...p, trees: newTrees };
    });
    setParks(updatedParks);
    localStorage.setItem("guard3n_parks", JSON.stringify(updatedParks));

    // Update balance and spent
    const currentBalance = Number(localStorage.getItem("guard3n_balance") || 0);
    const currentSpent = Number(localStorage.getItem("guard3n_spent") || 0);
    localStorage.setItem("guard3n_balance", Math.max(0, currentBalance - gr3en));
    localStorage.setItem("guard3n_spent", currentSpent + gr3en);

    // If 50+ GR3EN, own a tree
    const treesOwned = Math.floor(gr3en / 50);
    if (treesOwned > 0) {
      const existing = JSON.parse(localStorage.getItem("guard3n_trees") || "[]");
      const newTrees = Array.from({ length: treesOwned }, (_, i) => ({
        id: "GRD-TREE-" + String(existing.length + i + 1).padStart(6, "0"),
        species: result.species,
        park: activePark.name,
        date: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }),
        gr3en: 50,
      }));
      localStorage.setItem("guard3n_trees", JSON.stringify([...existing, ...newTrees]));
    }

    const updatedPark = updatedParks.find(p => p.id === activePark.id);
    const isFull = updatedPark.trees >= updatedPark.goal;

    setTreeData({
      species: result.species,
      park: activePark.name,
      gr3en: treesOwned,
      txHash: result.txHash,
      date: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }),
      isFull,
      parkName: activePark.name,
    });
    setLoading(false);
    setStep("success");
  };

  if (step === "success" && treeData) {
    return (
      <div style={{
        flex: 1, overflowY: "auto",
        display: "flex", flexDirection: "column",
        alignItems: "center", padding: "1.5rem",
        gap: "1rem", textAlign: "center",
      }}>
        <div style={{
          width: 80, height: 80,
          background: treeData.isFull
            ? "linear-gradient(135deg, #facc15, #f59e0b)"
            : "linear-gradient(135deg, #a3e635, #22c55e)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 48px ${treeData.isFull ? "rgba(250,204,21,0.5)" : "rgba(132,204,22,0.5)"}`,
          animation: "pulse 1.5s ease-in-out infinite",
        }}>
          <span style={{ fontSize: "2rem" }}>{treeData.isFull ? "🏆" : "🌱"}</span>
        </div>

        {treeData.isFull && (
          <div style={{
            background: "rgba(250,204,21,0.1)",
            border: "1px solid rgba(250,204,21,0.3)",
            borderRadius: "1rem",
            padding: "0.75rem 1.25rem",
          }}>
            <p style={{ color: "#facc15", fontWeight: 800, fontSize: "0.85rem", fontFamily: "'Syne', sans-serif" }}>
              🎉 Park Fully Funded!
            </p>
            <p style={{ color: "#a3a315", fontSize: "0.68rem", marginTop: "0.25rem" }}>
              {treeData.parkName} has been completely funded. A new tree has been registered on Stellar!
            </p>
          </div>
        )}

        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f0fdf4" }}>
            {treeData.isFull ? "Park Complete!" : "Donation Successful!"}
          </p>
          {treeData.gr3en > 0 ? (
            <p style={{ color: "#a3e635", fontSize: "0.78rem", fontWeight: 600 }}>
              +{treeData.gr3en} tree{treeData.gr3en > 1 ? "s" : ""} added to your collection
            </p>
          ) : (
            <p style={{ color: "#4b6b4b", fontSize: "0.75rem" }}>
              Keep donating! 50 GR3EN = 1 tree owned
            </p>
          )}
        </div>

        {treeData.gr3en > 0 && <TreeCard treeData={treeData} mini />}

        <p style={{ color: "#4b6b4b", fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>
          TX: {treeData.txHash}
        </p>

        <button
          onClick={() => { setStep("select"); setPark(null); setAmount(""); onClear && onClear(); }}
          style={{
            padding: "0.65rem 2rem",
            background: "rgba(132,204,22,0.08)",
            border: "1px solid rgba(132,204,22,0.2)",
            borderRadius: 999, color: "#a3e635",
            fontSize: "0.75rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
          }}>
          Donate Again
        </button>

        <style>{`@keyframes pulse { 0%,100% { box-shadow: 0 0 48px rgba(132,204,22,0.5); } 50% { box-shadow: 0 0 72px rgba(132,204,22,0.8); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "1rem 1.5rem", gap: "1rem" }}>
      <div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f0fdf4" }}>Donate</p>
        <p style={{ color: "#4b6b4b", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Fund a tree · Earn GR3EN</p>
      </div>

      <div>
        <p style={{ color: "#4b6b4b", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Select Park</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {parks.map((p) => {
            const pct = Math.min(Math.round((p.trees / p.goal) * 100), 100);
            const isFull = pct >= 100;
            const isSelected = activePark?.id === p.id;
            return (
              <div key={p.id} onClick={() => !isFull && setPark(p)} style={{
                background: isFull ? "rgba(250,204,21,0.06)" : isSelected ? "rgba(132,204,22,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isFull ? "rgba(250,204,21,0.3)" : isSelected ? "rgba(132,204,22,0.4)" : "rgba(132,204,22,0.08)"}`,
                borderRadius: "1rem", padding: "0.85rem 1rem",
                cursor: isFull ? "default" : "pointer", transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <div>
                    <p style={{ color: "#f0fdf4", fontSize: "0.8rem", fontWeight: 700 }}>{p.name}</p>
                    <p style={{ color: "#4b6b4b", fontSize: "0.6rem" }}>{p.species} · {p.trees}/{p.goal} trees</p>
                  </div>
                  {isFull ? (
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#facc15", background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.3)", borderRadius: 999, padding: "0.2rem 0.5rem", alignSelf: "center" }}>
                      ✅ Funded
                    </span>
                  ) : (
                    <div style={{
                      width: 28, height: 28,
                      background: isSelected ? "linear-gradient(135deg, #a3e635, #84cc16)" : "rgba(132,204,22,0.06)",
                      border: `1px solid ${isSelected ? "transparent" : "rgba(132,204,22,0.15)"}`,
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {isSelected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0a0f0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  )}
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: isFull ? "linear-gradient(90deg, #facc15, #f59e0b)" : "linear-gradient(90deg, #84cc16, #a3e635)",
                    borderRadius: 999,
                  }} />
                </div>
                <p style={{ color: "#4b6b4b", fontSize: "0.55rem", marginTop: "0.25rem", textAlign: "right" }}>{pct}% funded</p>
              </div>
            );
          })}
        </div>
      </div>

      {activePark && (
        <div>
          <p style={{ color: "#4b6b4b", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Amount in GR3EN (50 GR3EN = 1 tree)
          </p>
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem" }}>
            {[1, 5, 10, 50].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))} style={{
                flex: 1, padding: "0.4rem 0",
                background: Number(amount) === v ? "linear-gradient(135deg, #a3e635, #84cc16)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${Number(amount) === v ? "transparent" : "rgba(132,204,22,0.12)"}`,
                borderRadius: "0.6rem",
                color: Number(amount) === v ? "#0a0f0a" : "#6b7280",
                fontSize: "0.68rem", fontWeight: 700, cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}>{v}</button>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(132,204,22,0.15)",
            borderRadius: "0.8rem", padding: "0.6rem 1rem", gap: "0.5rem",
          }}>
            <span style={{ color: "#a3e635", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'JetBrains Mono', monospace" }}>GR3EN</span>
            <input
              type="number" min={1} placeholder="Custom amount"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#f0fdf4", fontSize: "1rem", fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
              }}
            />
            {amount && Number(amount) >= 50 && (
              <span style={{ color: "#4b6b4b", fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>
                = {Math.floor(Number(amount) / 50)} tree{Math.floor(Number(amount) / 50) > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {amount && Number(amount) < 1 && (
            <p style={{ color: "#f87171", fontSize: "0.62rem", marginTop: "0.3rem" }}>Minimum is 1 GR3EN</p>
          )}
        </div>
      )}

      <button
        onClick={handleDonate}
        disabled={!activePark || Number(amount) < 1 || loading}
        style={{
          marginTop: "auto", padding: "0.9rem",
          background: (!activePark || Number(amount) < 1) ? "rgba(132,204,22,0.1)" : "linear-gradient(135deg, #a3e635, #84cc16)",
          border: "1px solid rgba(132,204,22,0.2)", borderRadius: "1rem",
          color: (!activePark || Number(amount) < 1) ? "#4b6b4b" : "#0a0f0a",
          fontSize: "0.85rem", fontWeight: 800,
          cursor: (!activePark || Number(amount) < 1) ? "not-allowed" : "pointer",
          fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em", transition: "all 0.2s",
          boxShadow: (!activePark || Number(amount) < 1) ? "none" : "0 0 24px rgba(132,204,22,0.3)",
        }}>
        {loading ? "Processing on Stellar..." : "Donate GR3EN 🌱"}
      </button>
    </div>
  );
}


function PlaceholderScreen({ label, icon }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
    }}>
      <div style={{
        width: 64, height: 64,
        background: "rgba(132,204,22,0.08)",
        border: "1px solid rgba(132,204,22,0.15)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700, fontSize: "1rem", color: "#f0fdf4",
      }}>{label}</p>
      <p style={{
        color: "#4b6b4b", fontSize: "0.68rem",
        fontFamily: "'JetBrains Mono', monospace",
      }}>Coming soon</p>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────

function BottomNav({ active, setActive }) {
  const items = [
    {
      id: "home", label: "Home",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 8L9 2l7 6v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>,
    },
    {
      id: "map", label: "Map",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C6.24 2 4 4.24 4 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>,
    },
    {
      id: "donate", label: "Donate",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v14M5 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      id: "dashboard", label: "Board",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="10" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="7" y="6" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="12" y="2" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>,
    },
    {
      id: "profile", label: "Profile",
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2 16c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    },
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "0.6rem 0.5rem 0.4rem",
      background: "#0d140d",
      borderTop: "1px solid rgba(132,204,22,0.08)",
      flexShrink: 0,
    }}>
      {items.map((item) => {
        const isDonate = item.id === "donate";
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
              background: isDonate
                ? "linear-gradient(135deg, #a3e635, #84cc16)"
                : "transparent",
              border: "none",
              cursor: "pointer",
              padding: isDonate ? "0.55rem 1.1rem" : "0.4rem 0.5rem",
              borderRadius: isDonate ? 999 : "0.5rem",
              boxShadow: isDonate ? "0 0 18px rgba(132,204,22,0.35)" : "none",
              color: isDonate ? "#0a0f0a" : isActive ? "#a3e635" : "#4b6b4b",
              transition: "all 0.2s",
            }}>
            {item.icon}
            <span style={{
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: isDonate ? "#0a0f0a" : isActive ? "#a3e635" : "#4b6b4b",
            }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}