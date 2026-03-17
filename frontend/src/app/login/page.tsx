"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";

const AVATAR_COLORS = [
  { bg: "#EAD5C0", text: "#7A5A40", label: "A" },
  { bg: "#C4D4E8", text: "#3A5A80", label: "B" },
  { bg: "#C8E8C4", text: "#2E6A2E", label: "C" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="flex min-h-screen relative"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* ── RIGHT VISUAL PANEL ─────────────────────────────────────────
          Mobile : absolute full-screen background (z-0)
          Desktop: flex item, 45% width                                */}
      <div
        className="absolute inset-0 z-0 lg:relative lg:inset-auto lg:z-auto lg:w-[45%] lg:order-2 flex flex-col justify-between"
        style={{
          background:
            "linear-gradient(145deg, #C8A882 0%, #7d5a45 50%, #3A2F2D 100%)",
          padding: "56px 48px",
          overflow: "hidden",
        }}
      >
        {/* BG decoration circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "35%",
            right: "8%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(200,168,130,0.18)",
            pointerEvents: "none",
          }}
        />

        {/* Top headline */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 2.8vw, 34px)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.35,
              maxWidth: 340,
              opacity: 0.95,
            }}
          >
            AI-driven task management for modern teams.
          </h2>
        </div>

        {/* Mid: geometric art */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div style={{ position: "relative", width: 280, height: 280 }}>
            <div
              style={{
                position: "absolute",
                top: "10%",
                left: "5%",
                width: 155,
                height: 155,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 28,
                border: "1.5px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
                transform: "rotate(-12deg)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 18,
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  borderRadius: 12,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "38%",
                width: 120,
                height: 120,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 20,
                border: "1.5px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                transform: "rotate(14deg)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 15,
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom glass card */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(16px)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.22)",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#C8A882",
              }}
            />
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>
              Active
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.88)",
              lineHeight: 1.65,
              marginBottom: 16,
            }}
          >
            Manage thousands of async background tasks seamlessly with live
            analytics and AI-powered insights.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {["←", "→"].map((arrow, i) => (
              <button
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.28)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
              >
                {arrow}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── LEFT FORM PANEL ────────────────────────────────────────────
          Mobile : z-10 transparent, form shows as white card over bg
          Desktop: 55% width, solid white background                  */}
      <div
        className="relative z-10 w-full min-h-screen flex flex-col lg:w-[55%] lg:order-1 lg:bg-white"
      >
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:px-16 lg:py-12">
          {/* Form card — card on mobile, transparent on desktop */}
          <div
            className="w-full max-w-sm lg:max-w-md"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              borderRadius: 28,
              padding: "36px 32px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "var(--warm-800)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Zap size={14} color="#fff" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  color: "var(--warm-800)",
                }}
              >
                Taskflow
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 4vw, 34px)",
                fontWeight: 400,
                color: "var(--warm-800)",
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--warm-400)",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              Sign in to your Taskflow workspace
            </p>

            {/* Form */}
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                e.preventDefault()
              }
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {/* Email */}
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--warm-400)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="hello@company.com"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 16px 13px 44px",
                    borderRadius: 99,
                    border: "1.5px solid var(--warm-100)",
                    background: "var(--surface)",
                    fontSize: 14,
                    color: "var(--warm-800)",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "var(--warm-100)";
                    e.target.style.background = "var(--surface)";
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--warm-400)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 44px 13px 44px",
                    borderRadius: 99,
                    border: "1.5px solid var(--warm-100)",
                    background: "var(--surface)",
                    fontSize: 14,
                    color: "var(--warm-800)",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "var(--warm-100)";
                    e.target.style.background = "var(--surface)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--warm-400)",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginTop: -4 }}>
                <Link
                  href="#"
                  style={{
                    fontSize: 13,
                    color: "var(--warm-400)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  marginTop: 4,
                  padding: "14px",
                  borderRadius: 99,
                  background: "var(--warm-800)",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "opacity 0.2s, transform 0.1s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.opacity = "0.88")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.opacity = "1")
                }
                onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Sign In
              </button>
            </form>

            {/* Footer link */}
            <p
              style={{
                marginTop: 20,
                fontSize: 14,
                color: "var(--warm-400)",
                textAlign: "center",
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                style={{
                  color: "var(--warm-800)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Social proof — bottom of form panel (desktop only) */}
        <div
          className="hidden lg:flex"
          style={{
            padding: "20px 48px 32px",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ display: "flex" }}>
            {AVATAR_COLORS.map((av, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: av.bg,
                  border: "2.5px solid #fff",
                  marginLeft: i > 0 ? -10 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: av.text,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                {av.label}
              </div>
            ))}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--warm-800)",
              }}
            >
              Join 20k+ users
            </div>
            <div style={{ fontSize: 12, color: "var(--warm-400)" }}>
              Let&apos;s see our happy customers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
