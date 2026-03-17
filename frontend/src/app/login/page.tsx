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
            "linear-gradient(135deg, #0A4A8E 0%, #052E5C 100%)",
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
          <p
            style={{
              color: "#7DD3FC",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.6,
              maxWidth: 360,
              fontWeight: 500,
            }}
          >
            Process millions of tasks seamlessly with intelligent routing and real-time insights.
          </p>
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
            background: "rgba(0, 217, 255, 0.1)",
            backdropFilter: "blur(16px)",
            borderRadius: 16,
            border: "1px solid rgba(0, 217, 255, 0.3)",
            padding: "24px 28px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0, 217, 255, 0.15)",
              borderRadius: 99,
              padding: "6px 16px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00D9FF",
              }}
            />
            <span style={{ fontSize: 12, color: "#00D9FF", fontWeight: 700 }}>
              ACTIVE
            </span>
          </div>
          <p
            style={{
              fontSize: 15,
              color: "#E0F2FE",
              lineHeight: 1.6,
              marginBottom: 18,
              fontWeight: 500,
            }}
          >
            Real-time automation with intelligent routing and predictive analytics across your entire task pipeline.
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
                gap: 10,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0A4A8E 0%, #00D9FF 100%)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Zap size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  color: "var(--primary)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Taskflow
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4.5vw, 40px)",
                fontWeight: 700,
                color: "var(--primary)",
                lineHeight: 1.15,
                marginBottom: 10,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-secondary)",
                marginBottom: 32,
                lineHeight: 1.6,
                fontWeight: 500,
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
                  size={16}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="hello@company.com"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 16px 14px 48px",
                    borderRadius: 10,
                    border: "1.5px solid var(--surface-border)",
                    background: "#F9FAFB",
                    fontSize: 15,
                    color: "var(--text-primary)",
                    outline: "none",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "#00D9FF";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "var(--surface-border)";
                    e.target.style.background = "#F9FAFB";
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 48px 14px 48px",
                    borderRadius: 10,
                    border: "1.5px solid var(--surface-border)",
                    background: "#F9FAFB",
                    fontSize: 15,
                    color: "var(--text-primary)",
                    outline: "none",
                    fontFamily: "inherit",
                    fontWeight: 500,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "#00D9FF";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    e.target.style.borderColor = "var(--surface-border)";
                    e.target.style.background = "#F9FAFB";
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
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: "right", marginTop: -2 }}>
                <Link
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#0A4A8E",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  marginTop: 8,
                  padding: "15px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #0A4A8E 0%, #0F5FA8 100%)",
                  color: "#fff",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 4px 16px rgba(10, 74, 142, 0.3)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(10, 74, 142, 0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(10, 74, 142, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
                }
              >
                Sign In
              </button>
            </form>

            {/* Footer link */}
            <p
              style={{
                marginTop: 24,
                fontSize: 15,
                color: "var(--text-secondary)",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                style={{
                  color: "#0A4A8E",
                  fontWeight: 700,
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
