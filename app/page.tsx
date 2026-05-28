"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useEffect, useState } from "react";

const AGENT_ID = "agent_5901ksrfb6dffkytwrjqr135rp2f";

type ConvStatus = "idle" | "connecting" | "connected" | "disconnected";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(24).fill(3));

  const conversation = useConversation({
    onConnect: () => console.log("Connected to Maya"),
    onDisconnect: () => console.log("Disconnected"),
    onError: (err) => console.error("ElevenLabs error:", err),
  });

  const status: ConvStatus = conversation.status as ConvStatus;
  const isSpeaking = conversation.isSpeaking;
  const isListening = status === "connected" && !isSpeaking;

  // Visualizer animation
  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (isSpeaking) {
        setBars(Array(24).fill(0).map(() => Math.random() * 38 + 6));
      } else if (isListening) {
        setBars(Array(24).fill(0).map(() => Math.random() * 20 + 4));
      } else if (status === "connecting") {
        setBars(Array(24).fill(0).map((_, i) => {
          const t = Date.now() / 300;
          return Math.abs(Math.sin(t + i * 0.4)) * 18 + 3;
        }));
      } else {
        setBars(prev => prev.map(v => Math.max(3, v * 0.88)));
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isSpeaking, isListening, status]);

  const startCall = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStarted(true);
      await conversation.startSession({ agentId: AGENT_ID });
    } catch (err) {
      console.error("Mic permission denied or session error:", err);
    }
  }, [conversation]);

  const endCall = useCallback(async () => {
    await conversation.endSession();
    setStarted(false);
  }, [conversation]);

  const statusLabel = () => {
    if (!started) return "Ready when you are";
    if (status === "connecting") return "Connecting to Maya...";
    if (isSpeaking) return "Maya is speaking";
    if (status === "connected") return "Listening...";
    return "Call ended";
  };

  const barColor = () => {
    if (isSpeaking) return (h: number) => `rgba(74, 220, 180, ${0.4 + (h / 50) * 0.6})`;
    if (isListening) return (h: number) => `rgba(74, 184, 200, ${0.3 + (h / 30) * 0.5})`;
    return () => "rgba(74, 184, 200, 0.15)";
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1e2e 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(32, 178, 170, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(64, 164, 196, 0.06) 0%, transparent 40%)
        `,
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "36px", zIndex: 1 }}>
        <div style={{
          fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase",
          color: "#4ab8c8", marginBottom: "10px",
          fontFamily: "'Courier New', monospace",
        }}>
          CivicReach
        </div>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 34px)", fontWeight: "400",
          color: "#d4eef5", letterSpacing: "0.5px", marginBottom: "6px",
        }}>
          Benefits Intake
        </h1>
        <p style={{
          fontSize: "12px", color: "#5a8a9a",
          fontFamily: "'Courier New', monospace", letterSpacing: "2px",
        }}>
          Housing · Food · Childcare
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "460px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "18px",
        border: "1px solid rgba(74, 184, 200, 0.15)",
        padding: "36px 28px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        zIndex: 1,
      }}>

        {!started ? (
          /* Start screen */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "76px", height: "76px", borderRadius: "50%",
              background: "linear-gradient(135deg, #1a4a5e, #0d2d3e)",
              border: "2px solid rgba(74, 184, 200, 0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: "30px",
            }}>
              🏛️
            </div>
            <h2 style={{
              fontSize: "19px", fontWeight: "400",
              color: "#c8e8f0", marginBottom: "12px",
            }}>
              Talk to Maya
            </h2>
            <p style={{
              fontSize: "13px", color: "#5a8a9a", lineHeight: "1.7",
              marginBottom: "28px", fontFamily: "'Courier New', monospace",
            }}>
              Maya is a voice benefits specialist who can help you find housing,
              food, and childcare programs you may qualify for.
            </p>
            <button
              onClick={startCall}
              style={{
                background: "linear-gradient(135deg, #1a6a7a, #0d4a5e)",
                color: "#d4eef5",
                border: "1px solid rgba(74, 184, 200, 0.4)",
                borderRadius: "8px",
                padding: "14px 36px",
                fontSize: "12px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg, #1e7a8c, #0f5a70)")}
              onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(135deg, #1a6a7a, #0d4a5e)")}
            >
              Begin Call
            </button>
          </div>
        ) : (
          /* Active call */
          <div style={{ textAlign: "center" }}>
            {/* Maya avatar */}
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: isSpeaking
                ? "linear-gradient(135deg, #1a7a6a, #0d5050)"
                : "linear-gradient(135deg, #1a4a5e, #0d2d3e)",
              border: `2px solid ${isSpeaking ? "rgba(74, 220, 180, 0.5)" : "rgba(74, 184, 200, 0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: "24px",
              transition: "all 0.3s",
              boxShadow: isSpeaking ? "0 0 28px rgba(74, 220, 180, 0.2)" : "none",
            }}>
              🏛️
            </div>

            {/* Visualizer */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "3px",
              height: "56px", marginBottom: "20px",
            }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width: "3px",
                  height: `${h}px`,
                  borderRadius: "2px",
                  background: barColor()(h),
                  transition: "height 0.07s ease",
                }} />
              ))}
            </div>

            {/* Status */}
            <div style={{
              fontSize: "11px", letterSpacing: "3px",
              color: isSpeaking ? "#4adcc8" : isListening ? "#4ab8c8" : "#3a6a7a",
              fontFamily: "'Courier New', monospace",
              textTransform: "uppercase", marginBottom: "28px",
              transition: "color 0.3s",
            }}>
              {statusLabel()}
            </div>

            {/* End call */}
            <button
              onClick={endCall}
              style={{
                background: "rgba(180, 60, 60, 0.15)",
                color: "#e8a0a0",
                border: "1px solid rgba(200, 80, 80, 0.25)",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "'Courier New', monospace",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(180, 60, 60, 0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(180, 60, 60, 0.15)")}
            >
              End Call
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "24px", fontSize: "10px",
        color: "#1a4a5a", letterSpacing: "2px",
        fontFamily: "'Courier New', monospace",
        textTransform: "uppercase", zIndex: 1,
      }}>
        Demo · Not a real agency · Powered by ElevenLabs
      </div>
    </main>
  );
}
