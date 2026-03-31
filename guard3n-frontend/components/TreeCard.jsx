"use client";

const SPECIES_EMOJI = {
  Narra: "🌳", Molave: "🌲", Kamagong: "🌿", Talisay: "🍃", Acacia: "🌴",
};

export default function TreeCard({ treeData, mini = false }) {
  const emoji = SPECIES_EMOJI[treeData?.species] || "🌱";

  const handleShare = async () => {
    const shareData = {
      title: "I own a tree with GUARD3N!",
      text: `I virtually own a ${treeData.species} tree (${treeData.id}) at ${treeData.park}. Earth Is Your ResponsibiliTree 🌱`,
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
    <div style={{
      width: "100%",
      background: "linear-gradient(145deg, #0d1a0d, #111a0f)",
      border: "1px solid rgba(132,204,22,0.25)",
      borderRadius: mini ? "1rem" : "1.5rem",
      padding: mini ? "1rem" : "1.25rem",
      position: "relative", overflow: "hidden",
      boxShadow: "0 0 40px rgba(132,204,22,0.06)",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140,
        background: "radial-gradient(circle, rgba(132,204,22,0.1), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Brand row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: mini ? "0.78rem" : "0.9rem",
            background: "linear-gradient(135deg, #a3e635, #84cc16)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>GUARD3N</p>
          <p style={{ color: "#2d4a2d", fontSize: "0.48rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
            Earth Is Your ResponsibiliTree
          </p>
        </div>
        <span style={{ fontSize: mini ? "1.6rem" : "2rem" }}>{emoji}</span>
      </div>

      {/* Tree name */}
      <p style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: mini ? "0.95rem" : "1.2rem", color: "#f0fdf4", lineHeight: 1.1,
        marginBottom: "0.2rem",
      }}>{treeData?.species || "Unknown"} Tree</p>
      <p style={{ color: "#a3e635", fontSize: mini ? "0.6rem" : "0.72rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        📍 {treeData?.park || "Metro Manila"}
      </p>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mini ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: "0.4rem", marginBottom: "0.75rem",
      }}>
        {[
          { label: "Tree ID", value: treeData?.id || "—" },
          { label: "Date Owned", value: treeData?.date || "—" },
          ...(!mini ? [{ label: "Network", value: "Stellar" }] : []),
        ].map((s) => (
          <div key={s.label} style={{
            background: "rgba(132,204,22,0.05)", border: "1px solid rgba(132,204,22,0.1)",
            borderRadius: "0.5rem", padding: "0.45rem 0.55rem",
          }}>
            <p style={{ color: "#4b6b4b", fontSize: "0.48rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
            <p style={{ color: "#f0fdf4", fontWeight: 700, fontSize: "0.65rem", marginTop: "0.1rem", wordBreak: "break-all" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {!mini && (
        <button onClick={handleShare} style={{
          width: "100%", padding: "0.65rem",
          background: "linear-gradient(135deg, #a3e635, #84cc16)",
          border: "none", borderRadius: "0.75rem", color: "#0a0f0a",
          fontWeight: 800, fontSize: "0.75rem", cursor: "pointer",
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
      )}
    </div>
  );
}