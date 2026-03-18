"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { LoginCredentials } from "@/types";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [creds, setCreds] = useState<LoginCredentials>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  // GSAP entrance
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.fromTo(".login-form-el", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out", delay: 0.1 });
      }, containerRef);
    })();
    return () => { ctx?.revert(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await login(creds);
    if (err) { setError(err); setSubmitting(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 16px 13px 44px",
    borderRadius: 12,
    border: "1.5px solid var(--border)",
    background: "var(--bg)",
    fontSize: 14,
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-sans)",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--heading)";
    e.target.style.boxShadow = "0 0 0 3px rgba(30,97,87,0.12)";
    e.target.style.background = "#fff";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "var(--bg)";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)", background: "var(--bg)" }}>

      {/* Left: Visual Panel */}
      <div style={{ width: "42%", position: "sticky", top: 0, height: "100vh", background: "linear-gradient(145deg, #1E6157 0%, #0e3f38 45%, #0a2e2a 100%)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -50, width: 400, height: 400, borderRadius: "50%", background: "rgba(30,97,87,0.4)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: 140, height: 140, borderRadius: "50%", background: "rgba(200,215,210,0.08)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "grid", placeItems: "center", backdropFilter: "blur(10px)" }}>
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#fff", fontWeight: 600 }}>Taskflow</span>
        </div>

        {/* Mid content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,2.8vw,38px)", fontWeight: 600, color: "#fff", lineHeight: 1.3, maxWidth: 340, marginBottom: 20, opacity: 0.95 }}>
            Process text tasks at scale, instantly.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 300 }}>
            Queue thousands of async jobs and watch them complete with real-time logs.
          </p>
        </div>

        {/* Bottom glass card */}
        <div style={{ position: "relative", zIndex: 1, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.15)", padding: "20px 22px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {["uppercase", "word_count", "reverse"].map((op) => (
              <span key={op} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 99, fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
                {op.replace("_", " ")}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            4 powerful text operations, Redis-backed queue, live log streaming.
          </p>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }}>
        <div ref={containerRef} style={{ width: "100%", maxWidth: 420 }}>

          {/* Logo (mobile) */}
          <div className="login-form-el" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--heading)", display: "grid", placeItems: "center" }}>
              <Zap size={13} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--heading)", fontWeight: 600 }}>Taskflow</span>
          </div>

          <h1 className="login-form-el" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,34px)", fontWeight: 600, color: "var(--heading)", lineHeight: 1.2, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p className="login-form-el" style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.5 }}>
            Sign in to your workspace
          </p>

          {error && (
            <div className="toast-error login-form-el" style={{ marginBottom: 20 }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Email */}
            <div className="login-form-el" style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)", pointerEvents: "none" }} />
              <input
                type="email"
                value={creds.email}
                onChange={(e) => setCreds((p) => ({ ...p, email: e.target.value }))}
                required
                placeholder="hello@company.com"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Password */}
            <div className="login-form-el" style={{ position: "relative" }}>
              <Lock size={14} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)", pointerEvents: "none" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={creds.password}
                onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))}
                required
                placeholder="Password"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", display: "flex", alignItems: "center" }}>
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Submit */}
            <button
              className="login-form-el"
              type="submit"
              disabled={submitting}
              style={{ marginTop: 6, padding: "14px", borderRadius: 12, background: submitting ? "var(--surface)" : "var(--heading)", color: submitting ? "var(--text-light)" : "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", transition: "all 0.2s", boxShadow: submitting ? "none" : "0 4px 16px rgba(30,97,87,0.28)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "var(--accent-hover)"; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = "var(--heading)"; }}
            >
              {submitting ? "Signing in…" : (<>Sign In <ArrowRight size={15} /></>)}
            </button>
          </form>

          <p className="login-form-el" style={{ marginTop: 24, fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--heading)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
