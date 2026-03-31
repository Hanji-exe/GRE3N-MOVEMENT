"use client";

import { useEffect, useRef, useState } from "react";

const PARKS = [
  {
    id: "QC-MEMORIAL-001",
    name: "Quezon Memorial Circle",
    lat: 14.6517, lng: 121.0490,
    trees: 312, goal: 500, funded: 78,
    status: "active", tag: "Registered",
    rating: 4.7, liveVisitors: 284,
    crowdLabel: "Busy", crowdColor: "#facc15", crowdBars: 4,
    reviews: [
      { name: "Maria S.", stars: 5, comment: "Beautiful park, lots of new trees planted!" },
      { name: "Juan D.", stars: 4, comment: "Great place but parking is limited on weekends." },
    ],
  },
  {
    id: "QC-LAMESA-002",
    name: "La Mesa Eco Park",
    lat: 14.7117, lng: 121.0650,
    trees: 280, goal: 400, funded: 62,
    status: "active", tag: "Funded",
    rating: 4.5, liveVisitors: 132,
    crowdLabel: "Moderate", crowdColor: "#a3e635", crowdBars: 3,
    reviews: [
      { name: "Ana R.", stars: 5, comment: "So peaceful and full of wildlife. Love it." },
      { name: "Carlo M.", stars: 4, comment: "Nice trails, could use more benches." },
    ],
  },
  {
    id: "MNL-NINOY-003",
    name: "Ninoy Aquino Parks & Wildlife",
    lat: 14.6360, lng: 121.0390,
    trees: 198, goal: 350, funded: 45,
    status: "active", tag: "Growing",
    rating: 4.2, liveVisitors: 76,
    crowdLabel: "Quiet", crowdColor: "#4ade80", crowdBars: 2,
    reviews: [
      { name: "Rosa T.", stars: 4, comment: "Underrated gem, very calming atmosphere." },
      { name: "Ben L.", stars: 4, comment: "Animals are well kept. Great for kids." },
    ],
  },
  {
    id: "MNL-RIZAL-004",
    name: "Rizal Park",
    lat: 14.5831, lng: 120.9794,
    trees: 255, goal: 300, funded: 91,
    status: "active", tag: "Nearly Full",
    rating: 4.8, liveVisitors: 521,
    crowdLabel: "Very Busy", crowdColor: "#f87171", crowdBars: 5,
    reviews: [
      { name: "Liza P.", stars: 5, comment: "Iconic Manila landmark, always well maintained." },
      { name: "Marco V.", stars: 5, comment: "Best park in the city. Come early to avoid crowds!" },
    ],
  },
  {
    id: "MNL-ARROCEROS-005",
    name: "Arroceros Forest Park",
    lat: 14.5940, lng: 120.9820,
    trees: 195, goal: 250, funded: 55,
    status: "active", tag: "Growing",
    rating: 4.4, liveVisitors: 98,
    crowdLabel: "Moderate", crowdColor: "#a3e635", crowdBars: 3,
    reviews: [
      { name: "Tina G.", stars: 5, comment: "Last urban forest in Manila. Treasure it!" },
      { name: "Paolo F.", stars: 4, comment: "Surprisingly lush for being in the middle of the city." },
    ],
  },
];

export default function MapView({ onDonate }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParks = PARKS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. CSS inject
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  // 2. Map init
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current._leaflet_id) return;

      const map = L.map(mapRef.current, {
        center: [14.6517, 121.0490],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      const makeIcon = (funded) => {
        const color = funded >= 80 ? "#a3e635" : funded >= 50 ? "#84cc16" : "#4ade80";
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
          <ellipse cx="16" cy="36" rx="8" ry="4" fill="${color}" fill-opacity="0.2"/>
          <path d="M16 2C10.477 2 6 6.477 6 12c0 7.732 10 22 10 22S26 19.732 26 12C26 6.477 21.523 2 16 2z"
            fill="${color}" stroke="#0a0f0a" stroke-width="1.5"/>
          <circle cx="16" cy="12" r="5" fill="#0a0f0a" opacity="0.6"/>
          <path d="M16 8v8M13 11l3-3 3 3" stroke="${color}" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        return L.divIcon({
          className: "",
          html: svg,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -42],
        });
      };

      PARKS.forEach((park) => {
        const marker = L.marker([park.lat, park.lng], { icon: makeIcon(park.funded) }).addTo(map);
        marker.on("click", () => {
          setSelectedPark(park);
          map.flyTo([park.lat, park.lng], 14, { duration: 0.8 });
        });
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 100);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const flyToPark = (park) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([park.lat, park.lng], 15, { duration: 0.8 });
      setSelectedPark(park);
      setSearchQuery("");
    }
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      background: "#0a0f0a",
    }}>

      {/* Leaflet Map — Leaflet owns this div, nothing else renders inside it */}
      <div ref={mapRef} style={{ width: "100%", height: "680px" , marginTop: "0.5rem"} } />

      {/* Search Bar */}
      <div style={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        right: "1rem",
        zIndex: 1000,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "rgba(10,15,10,0.92)",
          border: "1px solid rgba(132,204,22,0.25)",
          borderRadius: "0.875rem",
          padding: "0.6rem 0.875rem",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5" stroke="#4b6b4b" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="#4b6b4b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search parks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#f0fdf4",
              fontSize: "0.78rem",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#4b6b4b", fontSize: "0.85rem", padding: 0 }}
            >✕</button>
          )}
        </div>

        {searchQuery && filteredParks.length > 0 && (
          <div style={{
            marginTop: "0.4rem",
            background: "rgba(10,15,10,0.96)",
            border: "1px solid rgba(132,204,22,0.15)",
            borderRadius: "0.875rem",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}>
            {filteredParks.map((park, i) => (
              <button
                key={park.id}
                onClick={() => flyToPark(park)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.875rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: i < filteredParks.length - 1 ? "1px solid rgba(132,204,22,0.06)" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: "rgba(132,204,22,0.1)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2C6.24 2 4 4.24 4 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z" stroke="#a3e635" strokeWidth="1.5" />
                    <circle cx="9" cy="7" r="1.5" stroke="#a3e635" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <p style={{ color: "#f0fdf4", fontSize: "0.75rem", fontWeight: 600 }}>{park.name}</p>
                  <p style={{ color: "#4b6b4b", fontSize: "0.6rem" }}>{park.trees} trees · {park.funded}% funded</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Park Count Badge */}
      <div style={{
        position: "absolute",
        top: "calc(1rem + 48px + 0.5rem)",
        right: "1rem",
        zIndex: 999,
        background: "rgba(10,15,10,0.9)",
        border: "1px solid rgba(132,204,22,0.2)",
        borderRadius: "0.6rem",
        padding: "0.35rem 0.65rem",
        backdropFilter: "blur(8px)",
      }}>
        <p style={{
          color: "#a3e635", fontSize: "0.6rem", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
        }}>{PARKS.length} Parks</p>
      </div>

      {/* Popup — sibling to map div, never nested inside it */}
      {selectedPark && (
        <div style={{
          position: "absolute",
          bottom: "1rem",
          left: "1rem",
          right: "1rem",
          zIndex: 1000,
          background: "rgba(10,15,10,0.96)",
          border: "1px solid rgba(132,204,22,0.2)",
          borderRadius: "1.25rem",
          padding: "1.1rem 1.1rem 1rem",
          boxShadow: "0 -4px 40px rgba(132,204,22,0.08), 0 8px 32px rgba(0,0,0,0.7)",
          backdropFilter: "blur(16px)",
          animation: "slideUp 0.25s ease",
          overflowY: "auto",
          maxHeight: "72%",
        }}>

          {/* Close */}
          <button
            onClick={() => setSelectedPark(null)}
            style={{
              position: "absolute", top: "0.75rem", right: "0.875rem",
              background: "rgba(132,204,22,0.08)",
              border: "1px solid rgba(132,204,22,0.15)",
              borderRadius: "50%",
              width: 26, height: 26,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#4b6b4b", fontSize: "0.7rem",
            }}
          >✕</button>

          {/* Tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            background: "rgba(132,204,22,0.1)", border: "1px solid rgba(132,204,22,0.2)",
            borderRadius: 999, padding: "0.2rem 0.6rem", marginBottom: "0.5rem",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#a3e635" }} />
            <span style={{
              color: "#a3e635", fontSize: "0.58rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{selectedPark.tag}</span>
          </div>

          {/* Name + ID */}
          <p style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "1rem", color: "#f0fdf4",
            marginBottom: "0.25rem", paddingRight: "1.5rem",
          }}>{selectedPark.name}</p>
          <p style={{
            color: "#4b6b4b", fontSize: "0.6rem",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.85rem",
          }}>{selectedPark.id}</p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
            {[
              { value: selectedPark.trees.toLocaleString(), label: "Trees" },
              { value: `${selectedPark.goal - selectedPark.trees}`, label: "Needed" },
              { value: `${selectedPark.funded}%`, label: "Funded" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(132,204,22,0.05)", border: "1px solid rgba(132,204,22,0.1)",
                borderRadius: "0.75rem", padding: "0.5rem 0.25rem", textAlign: "center",
              }}>
                <p style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem",
                  background: "linear-gradient(135deg, #a3e635, #84cc16)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{s.value}</p>
                <p style={{ color: "#4b6b4b", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.1rem" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Funding Progress */}
          <div style={{ marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span style={{ color: "#4b6b4b", fontSize: "0.6rem" }}>Funding Progress</span>
              <span style={{ color: "#a3e635", fontSize: "0.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{selectedPark.funded}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(132,204,22,0.08)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                width: `${selectedPark.funded}%`, height: "100%",
                background: "linear-gradient(90deg, #84cc16, #a3e635)",
                borderRadius: 999, transition: "width 0.6s ease",
                boxShadow: "0 0 8px rgba(132,204,22,0.4)",
              }} />
            </div>
          </div>

          {/* Rating + Crowd */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem" }}>
            {/* Rating */}
            <div style={{
              flex: 1, background: "rgba(132,204,22,0.05)",
              border: "1px solid rgba(132,204,22,0.1)",
              borderRadius: "0.75rem", padding: "0.6rem 0.5rem", textAlign: "center",
            }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "0.2rem" }}>
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1l1.2 2.5L9 3.8 7 5.7l.5 2.8L5 7.2 2.5 8.5 3 5.7 1 3.8l2.8-.3z"
                      fill={s <= Math.round(selectedPark.rating ?? 0) ? "#a3e635" : "rgba(132,204,22,0.15)"} />
                  </svg>
                ))}
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem",
                background: "linear-gradient(135deg, #a3e635, #84cc16)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{selectedPark.rating?.toFixed(1) ?? "N/A"}</p>
              <p style={{ color: "#4b6b4b", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rating</p>
            </div>

            {/* Crowd */}
            <div style={{
              flex: 1, background: "rgba(132,204,22,0.05)",
              border: "1px solid rgba(132,204,22,0.1)",
              borderRadius: "0.75rem", padding: "0.6rem 0.5rem", textAlign: "center",
            }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "2px", marginBottom: "0.2rem", height: 18 }}>
                {[0.3, 0.55, 0.8, 1, 0.65].map((h, i) => (
                  <div key={i} style={{
                    width: 4, height: `${h * 18}px`, borderRadius: 2,
                    background: i < selectedPark.crowdBars
                      ? "linear-gradient(180deg, #a3e635, #84cc16)"
                      : "rgba(132,204,22,0.12)",
                  }} />
                ))}
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.85rem",
                color: selectedPark.crowdColor,
              }}>{selectedPark.crowdLabel}</p>
              <p style={{ color: "#4b6b4b", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Crowd</p>
            </div>
          </div>

          {/* Recent Reviews */}
          <div style={{ marginBottom: "0.85rem" }}>
            <p style={{
              color: "#4b6b4b", fontSize: "0.6rem",
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem",
            }}>Recent Reviews</p>
            {selectedPark.reviews.map((r, i) => (
              <div key={i} style={{
                padding: "0.5rem 0",
                borderBottom: i < selectedPark.reviews.length - 1 ? "1px solid rgba(132,204,22,0.05)" : "none",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                  <p style={{ color: "#f0fdf4", fontSize: "0.7rem", fontWeight: 600 }}>{r.name}</p>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1l1.2 2.5L9 3.8 7 5.7l.5 2.8L5 7.2 2.5 8.5 3 5.7 1 3.8l2.8-.3z"
                          fill={s <= r.stars ? "#a3e635" : "rgba(132,204,22,0.15)"} />
                      </svg>
                    ))}
                  </div>
                </div>
                <p style={{ color: "#4b6b4b", fontSize: "0.65rem", lineHeight: 1.5 }}>{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Donate Button */}
          <button
            onClick={() => {
              setSelectedPark(null);
              if (onDonate) onDonate(selectedPark);
            }}
            style={{
              width: "100%", padding: "0.75rem",
              background: "linear-gradient(135deg, #a3e635, #84cc16)",
              border: "none", borderRadius: "0.875rem",
              color: "#0a0f0a", fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: "0.85rem", cursor: "pointer",
              letterSpacing: "0.03em", boxShadow: "0 0 20px rgba(132,204,22,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v14M5 6l4-4 4 4" stroke="#0a0f0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Donate to This Park
          </button>

        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(132,204,22,0.2) !important;
          border-radius: 0.75rem !important;
          overflow: hidden;
          background: rgba(10,15,10,0.9) !important;
          box-shadow: none !important;
        }
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background: transparent !important;
          color: #a3e635 !important;
          border-bottom: 1px solid rgba(132,204,22,0.15) !important;
          font-size: 1.1rem !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
        }
        .leaflet-control-zoom-out { border-bottom: none !important; }
        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background: rgba(132,204,22,0.1) !important;
          color: #f0fdf4 !important;
        }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-container { background: #0a0f0a; }
      `}</style>
    </div>
  );
}