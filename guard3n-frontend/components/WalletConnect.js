"use client";

import { useState } from "react";

const MOCK_ADDRESS = "GBDEMO123YOURTESTNETADDRESSHERE";

export default function WalletConnect({ onConnect }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    setTimeout(() => {
      setAddress(MOCK_ADDRESS);
      if (onConnect) onConnect(MOCK_ADDRESS);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ width: "100%" }}>
      {!address ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #4de635, #a911cb,  #540383)",
            border: "none",
            color: "#ffffff",
            padding: "1rem 2rem",
            borderRadius: "1rem",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            boxShadow: "0 0 24px rgba(132,204,22,0.35)",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s",
          }}
        >
          {loading ? "Connecting..." : "Connect Freighter Wallet"}
        </button>
      ) : (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(132,204,22,0.3)",
          color: "#a3e635",
          padding: "0.75rem 1.25rem",
          borderRadius: "1rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.8rem",
        }}>
          <span style={{
            width: 8,
            height: 8,
            background: "#a3e635",
            borderRadius: "50%",
            display: "inline-block",
            boxShadow: "0 0 8px #a3e635",
          }} />
          {address.slice(0, 6)}...{address.slice(-6)}
        </div>
      )}
    </div>
  );
}