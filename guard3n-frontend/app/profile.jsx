"use client";

import { useState, useEffect, useRef } from "react";


const SPECIES_EMOJI = {
  Narra: "🌳", Molave: "🌲", Kamagong: "🌿", Talisay: "🍃", Acacia: "🌴",
};

// ─── MINI TREE CARD ───────────────────────────────────────────────────────────
function MiniTreeCard({ tree, onClick }) {
  const emoji = SPECIES_EMOJI[tree.species] || "🌱";
  return (
    <div onClick={() => onClick(tree)} style={{
      background: "linear-gradient(145deg, #0d1a0d, #111a0f)",
      border: "1px solid rgba(132,204,22,0.2)",
      borderRadius: "1rem",
      padding: "0.85rem",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.15s",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: "radial-gradient(circle, rgba(132,204,22,0.08), transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "1.6rem" }}>{emoji}</span>
        <span style={{
          fontSize: "0.48rem", fontWeight: 700, color: "#a3e635",
          background: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.2)",
          borderRadius: 999, padding: "0.15rem 0.4rem",
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em",
        }}>{tree.id}</span>
      </div>
      <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: "0.78rem", fontFamily: "'Syne', sans-serif" }}>
        {tree.species} Tree
      </p>
      <p style={{ color: "#4b6b4b", fontSize: "0.58rem", marginTop: "0.15rem" }}>📍 {tree.park}</p>
      <p style={{ color: "#2d4a2d", fontSize: "0.52rem", marginTop: "0.25rem", fontFamily: "'JetBrains Mono', monospace" }}>
        {tree.date}
      </p>
    </div>
  );
}

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────────
function TreeBottomSheet({ tree, onClose }) {
  const emoji = SPECIES_EMOJI[tree?.species] || "🌱";

  const handleShare = async () => {
    const shareData = {
      title: "I own a tree with GUARD3N!",
      text: `I virtually own a ${tree.species} tree (${tree.id}) at ${tree.park}. Join the GRE3N Movement 🌱`,
      url: "https://guard3n.app",
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert("Copied to clipboard!");
      }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
        zIndex: 50, backdropFilter: "blur(2px)",
      }} />

      {/* Sheet */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(180deg, #0d1a0d, #0a0f0a)",
        border: "1px solid rgba(132,204,22,0.2)",
        borderRadius: "1.5rem 1.5rem 0 0",
        padding: "1.25rem 1.5rem 2rem",
        zIndex: 51,
        animation: "slideUp 0.25s ease-out",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ width: 40, height: 4, background: "rgba(132,204,22,0.2)", borderRadius: 999 }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "2.5rem" }}>{emoji}</span>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f0fdf4" }}>
                {tree.species} Tree
              </p>
              <p style={{ color: "#a3e635", fontSize: "0.7rem", fontWeight: 600 }}>📍 {tree.park}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.15)",
            color: "#4b6b4b", cursor: "pointer", fontSize: "0.85rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* GUARD3N brand */}
        <div style={{
          background: "rgba(132,204,22,0.05)", border: "1px solid rgba(132,204,22,0.12)",
          borderRadius: "0.8rem", padding: "0.6rem 0.75rem", marginBottom: "1rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.85rem",
              background: "linear-gradient(135deg, #a3e635, #84cc16)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>GUARD3N</p>
            <p style={{ color: "#2d4a2d", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
              Join the GRE3N Movement
            </p>
          </div>
          <div style={{
            background: "rgba(132,204,22,0.1)", border: "1px solid rgba(132,204,22,0.2)",
            borderRadius: 999, padding: "0.25rem 0.65rem",
          }}>
            <p style={{ color: "#a3e635", fontSize: "0.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
              Stellar Network
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
          {[
            { label: "Tree ID", value: tree.id },
            { label: "Species", value: tree.species },
            { label: "Park", value: tree.park },
            { label: "Date Owned", value: tree.date },
            { label: "GR3EN Spent", value: `${tree.gr3en} GR3EN` },
            { label: "Network", value: "Stellar" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(132,204,22,0.04)", border: "1px solid rgba(132,204,22,0.08)",
              borderRadius: "0.65rem", padding: "0.5rem 0.65rem",
            }}>
              <p style={{ color: "#4b6b4b", fontSize: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
              <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: "0.7rem", marginTop: "0.1rem", wordBreak: "break-all" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {tree.txHash && (
          <p style={{
            color: "#2d4a2d", fontSize: "0.52rem",
            fontFamily: "'JetBrains Mono', monospace",
            wordBreak: "break-all", marginBottom: "0.75rem",
          }}>TX: {tree.txHash}</p>
        )}

        {/* Share button */}
        <button onClick={handleShare} style={{
          width: "100%", padding: "0.75rem",
          background: "linear-gradient(135deg, #a3e635, #84cc16)",
          border: "none", borderRadius: "0.8rem", color: "#0a0f0a",
          fontWeight: 800, fontSize: "0.78rem", cursor: "pointer",
          fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
        }}>
          <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
            <circle cx="14" cy="3" r="2" stroke="#0a0f0a" strokeWidth="1.5" />
            <circle cx="14" cy="15" r="2" stroke="#0a0f0a" strokeWidth="1.5" />
            <circle cx="4" cy="9" r="2" stroke="#0a0f0a" strokeWidth="1.5" />
            <path d="M6 8l6-4M6 10l6 4" stroke="#0a0f0a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Share My Tree
        </button>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </>
  );
}

// ─── QR CODE (SVG-based placeholder pattern) ──────────────────────────────────
function QRPlaceholder({ value }) {
  // Simple visual QR placeholder — replace with real qrcode lib if needed
  const cells = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const corner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
      const border = r === 0 || r === 6 || c === 0 || c === 6;
      const inner = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      return corner || border || inner
        ? Math.random() > 0.35
        : Math.random() > 0.55;
    })
  );
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ borderRadius: "0.5rem" }}>
      <rect width="72" height="72" fill="#0d1a0d" rx="6" />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c * 9 + 4} y={r * 9 + 4} width="7" height="7" rx="1.5" fill="#a3e635" />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
export default function ProfileScreen({ walletAddress }) {
  const [showCollection, setShowCollection] = useState(false);
  const [balance, setBalance] = useState(500);
  const [spent, setSpent] = useState(0);
  const [trees, setTrees] = useState([]);
  const [topping, setTopping] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [guardianId] = useState(() => {
    let id = localStorage.getItem("guard3n_gid");
    if (!id) {
      id = "GRD-" + Math.random().toString(36).slice(2, 10).toUpperCase();
      localStorage.setItem("guard3n_gid", id);
    }
    return id;
  });

  useEffect(() => {
    setBalance(Number(localStorage.getItem("guard3n_balance") || 500));
    setSpent(Number(localStorage.getItem("guard3n_spent") || 0));
    setTrees(JSON.parse(localStorage.getItem("guard3n_trees") || "[]"));
  }, []);
const [showTopUp, setShowTopUp] = useState(false);
const [topUpAmount, setTopUpAmount] = useState("");
  const handleTopUp = () => {
   if (!topUpAmount || Number(topUpAmount) < 1) return;
  setTopping(true);
  setTimeout(() => {
    const newBalance = balance + Number(topUpAmount);
    setBalance(newBalance);
    localStorage.setItem("guard3n_balance", newBalance);
    setTopping(false);
    setShowTopUp(false);
    setTopUpAmount("");
  }, 1200);
  };

  const shortWallet = walletAddress
    ? walletAddress.slice(0, 9) + "------------------" + walletAddress.slice(-3)
    : "Not connected";

  // ── Collection view ──
  if (showCollection) {
    return (
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "1rem 1.5rem", gap: "1rem", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => setShowCollection(false)} style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.15)",
            color: "#a3e635", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
          }}>←</button>
          <div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#f0fdf4" }}>My Collection</p>
            <p style={{ color: "#4b6b4b", fontSize: "0.6rem" }}>{trees.length} tree{trees.length !== 1 ? "s" : ""} owned</p>
          </div>
        </div>

        {trees.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "3rem" }}>🌱</span>
            <p style={{ color: "#4b6b4b", fontSize: "0.75rem", textAlign: "center" }}>
              No trees yet. Donate 50 GR3EN to own your first tree!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            {trees.map((tree, i) => (
              <MiniTreeCard key={i} tree={tree} onClick={setSelectedTree} />
            ))}
          </div>
        )}

        {selectedTree && (
          <TreeBottomSheet tree={selectedTree} onClose={() => setSelectedTree(null)} />
        )}
      </div>
    );
  }

  // ── Main profile view ──
  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "1rem 1.5rem", gap: "1rem" }}>

      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f0fdf4" }}>Profile</p>

      {/* ── Wallet Card ── */}
      <div style={{
        background: "linear-gradient(145deg, #0d1a0d, #0f1f0f)",
        border: "1px solid rgba(132,204,22,0.25)",
        borderRadius: "1.5rem", padding: "1.25rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 160, height: 160,
          background: "radial-gradient(circle, rgba(132,204,22,0.1), transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Identity row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 46, height: 46,
              background: "linear-gradient(135deg, #a3e635, #84cc16)",
              borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3.5" stroke="#0a0f0a" strokeWidth="1.8" />
                <path d="M2 16c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#0a0f0a" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#f0fdf4" }}>Guardian</p>
              <p style={{ color: "#4b6b4b", fontSize: "0.55rem", fontFamily: "'JetBrains Mono', monospace" }}>{guardianId}</p>
            </div>
          </div>
          <QRPlaceholder value={guardianId} />
        </div>

        {/* Wallet address */}
        <div style={{
          background: "rgba(132,204,22,0.04)", border: "1px solid rgba(132,204,22,0.1)",
          borderRadius: "0.65rem", padding: "0.5rem 0.75rem", marginBottom: "0.85rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ color: "#4b6b4b", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Stellar Wallet</p>
            <p style={{ color: "#f0fdf4", fontWeight: 600, fontSize: "1rem", fontFamily: "'JetBrains Mono', monospace", marginTop: "0.1rem" }}>
              {shortWallet}
            </p>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: walletAddress ? "#a3e635" : "#4b6b4b",
            boxShadow: walletAddress ? "0 0 6px #a3e635" : "none",
          }} />
        </div>

        {/* Balance + Spent */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
          {[
            { label: "GR3EN Balance", value: balance.toLocaleString(), color: "#a3e635" },
            { label: "Total Spent", value: spent.toLocaleString(), color: "#4b6b4b" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(132,204,22,0.04)", border: "1px solid rgba(132,204,22,0.08)",
              borderRadius: "0.65rem", padding: "0.55rem 0.65rem",
            }}>
              <p style={{ color: "#4b6b4b", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
              <p style={{ color: s.color, fontWeight: 800, fontSize: "1rem", fontFamily: "'Syne', sans-serif", marginTop: "0.1rem" }}>
                {s.value} <span style={{ fontSize: "0.55rem", fontWeight: 400 }}>GR3EN</span>
              </p>
            </div>
          ))}
        </div>

        

                {/* Top Up */}
        {!showTopUp ? (
  <button onClick={() => setShowTopUp(true)} style={{
    width: "100%", padding: "0.65rem",
    background: "linear-gradient(135deg, #a3e635, #84cc16)",
    border: "none", borderRadius: "0.75rem",
    color: "#0a0f0a", fontWeight: 800, fontSize: "0.75rem",
    cursor: "pointer", fontFamily: "'Syne', sans-serif",
    letterSpacing: "0.05em",
    boxShadow: "0 0 16px rgba(132,204,22,0.2)",
  }}>
    ⚡ Top Up GR3EN
  </button>
) : (
  <div style={{
    background: "rgba(132,204,22,0.04)",
    border: "1px solid rgba(132,204,22,0.15)",
    borderRadius: "0.75rem", padding: "0.75rem",
  }}>
    <p style={{ color: "#4b6b4b", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
      Select Amount
    </p>
    <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
      {[50, 100, 250, 500].map((v) => (
        <button key={v} onClick={() => setTopUpAmount(String(v))} style={{
          flex: 1, padding: "0.4rem 0",
          background: Number(topUpAmount) === v ? "linear-gradient(135deg, #a3e635, #84cc16)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${Number(topUpAmount) === v ? "transparent" : "rgba(132,204,22,0.12)"}`,
          borderRadius: "0.5rem",
          color: Number(topUpAmount) === v ? "#0a0f0a" : "#6b7280",
          fontSize: "0.65rem", fontWeight: 700, cursor: "pointer",
          fontFamily: "'Space Grotesk', sans-serif",
        }}>{v}</button>
      ))}
    </div>
    <div style={{
      display: "flex", alignItems: "center",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(132,204,22,0.12)",
      borderRadius: "0.6rem", padding: "0.45rem 0.75rem",
      gap: "0.5rem", marginBottom: "0.5rem",
    }}>
      <span style={{ color: "#a3e635", fontSize: "0.7rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>GR3EN</span>
      <input
        type="number" min={1} placeholder="Custom amount"
        value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: "#f0fdf4", fontSize: "0.85rem", fontWeight: 700,
          fontFamily: "'Syne', sans-serif",
        }}
      />
    </div>
    <div style={{ display: "flex", gap: "0.4rem" }}>
      <button onClick={() => { setShowTopUp(false); setTopUpAmount(""); }} style={{
        flex: 1, padding: "0.55rem",
        background: "transparent",
        border: "1px solid rgba(132,204,22,0.15)",
        borderRadius: "0.6rem", color: "#4b6b4b",
        fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
        fontFamily: "'Syne', sans-serif",
      }}>Cancel</button>
      <button onClick={handleTopUp} disabled={topping || !topUpAmount || Number(topUpAmount) < 1} style={{
        flex: 2, padding: "0.55rem",
        background: (!topUpAmount || Number(topUpAmount) < 1) ? "rgba(132,204,22,0.08)" : "linear-gradient(135deg, #a3e635, #84cc16)",
        border: "none", borderRadius: "0.6rem",
        color: (!topUpAmount || Number(topUpAmount) < 1) ? "#4b6b4b" : "#0a0f0a",
        fontSize: "0.7rem", fontWeight: 800, cursor: "pointer",
        fontFamily: "'Syne', sans-serif",
      }}>
        {topping ? "Adding..." : `⚡ Add ${topUpAmount || 0} GR3EN`}
      </button>
    </div>
  </div>
)}        
      </div>

      {/* Collection Button */}
      <button onClick={() => setShowCollection(true)} style={{
        width: "100%", padding: "1rem",
        background: "rgba(132,204,22,0.04)",
        border: "1px solid rgba(132,204,22,0.12)",
        borderRadius: "1.25rem", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40,
            background: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.15)",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "1.1rem" }}>🌳</span>
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: "0.82rem", fontFamily: "'Syne', sans-serif" }}>
              My Tree Collection
            </p>
            <p style={{ color: "#4b6b4b", fontSize: "0.58rem" }}>
              {trees.length} tree{trees.length !== 1 ? "s" : ""} owned · Tap to view
            </p>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="#4b6b4b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

    </div>
  );
}


