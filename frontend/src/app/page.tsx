"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Activity,
  CheckCircle2,
  BarChart3,
  RefreshCw,
  Terminal,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let lenis: { raf: (t: number) => void; destroy: () => void; on: (e: string, cb: unknown) => void } | undefined;

    const init = async () => {
      const LenisModule = await import("lenis");
      const LenisClass = LenisModule.default;
      lenis = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        // Hero entrance
        gsap.fromTo(".hero-badge", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
        gsap.fromTo(".hero-h1", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.12 });
        gsap.fromTo(".hero-sub", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.26 });
        gsap.fromTo(".hero-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.38 });
        gsap.fromTo(".hero-mockup", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", delay: 0.5 });
        gsap.fromTo(".hero-widget", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.8 });

        // Float animations
        gsap.to(".float-a", { y: -10, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".float-b", { y: -7, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.8 });

        // Features scroll
        gsap.fromTo(".feat-card",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
            scrollTrigger: { trigger: ".features-grid", start: "top 85%" } }
        );

        // How-it-works
        gsap.fromTo(".step-item",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: "power2.out",
            scrollTrigger: { trigger: ".steps-list", start: "top 80%" } }
        );
      }, containerRef);
    };

    init();
    return () => { ctx?.revert(); lenis?.destroy(); };
  }, []);

  return (
    <div ref={containerRef} style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(254,253,244,0.88)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--heading)", display: "grid", placeItems: "center", boxShadow: "0 2px 8px rgba(30,97,87,0.28)" }}>
            <Zap size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--heading)", fontWeight: 600 }}>Taskflow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>
          <Link href="#features" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--heading)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>Features</Link>
          <Link href="#how-it-works" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--heading)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>How it works</Link>
          <Link href="/login" style={{ padding: "10px 24px", borderRadius: 99, background: "var(--heading)", color: "#fff", textDecoration: "none", transition: "all 0.2s", boxShadow: "0 2px 10px rgba(30,97,87,0.28)", fontWeight: 600 }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,97,87,0.38)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--heading)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(30,97,87,0.28)"; }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 180, paddingBottom: 120, maxWidth: 1160, margin: "0 auto", padding: "180px 24px 120px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
        <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-light)", color: "var(--heading)", padding: "7px 18px", borderRadius: 99, fontSize: 13, fontWeight: 600, marginBottom: 28, border: "1px solid rgba(30,97,87,0.15)", fontFamily: "var(--font-sans)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--heading)", display: "inline-block" }} />
          Fully async · Redis-backed · Real-time logs
        </div>

        <h1 className="hero-h1 font-display" style={{ fontSize: "clamp(42px,6vw,76px)", fontWeight: 700, lineHeight: 1.08, color: "var(--heading)", marginBottom: 24, letterSpacing: "-0.02em", maxWidth: 820 }}>
          Text Processing Tasks,{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--text-muted)" }}>Managed for You</span>
        </h1>

        <p className="hero-sub" style={{ fontSize: "clamp(16px,2vw,20px)", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: 600, marginBottom: 44, fontFamily: "var(--font-sans)" }}>
          Queue text operations — uppercase, lowercase, reverse, word count — and track them live with a real-time log stream and status polling.
        </p>

        <div className="hero-cta" style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 100, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--heading)", color: "#fff", padding: "16px 36px", borderRadius: 99, fontWeight: 600, fontSize: 15, textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(30,97,87,0.3)", fontFamily: "var(--font-sans)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 22px rgba(30,97,87,0.4)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--heading)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,97,87,0.3)"; }}>
            Start for Free <ArrowRight size={15} />
          </Link>
        </div>

        {/* App Mockup */}
        <div style={{ position: "relative", width: "100%", maxWidth: 920 }}>
          {/* Main panel */}
          <div className="hero-mockup" style={{ background: "var(--bg-subtle)", borderRadius: 28, border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)", padding: 12, width: "100%" }}>
            <div style={{ background: "#fff", borderRadius: 20, height: 500, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Browser bar */}
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--danger)" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#F4A623" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--success)" }} />
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <div style={{ background: "var(--surface)", height: 24, width: 260, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--text-light)", fontFamily: "var(--font-sans)" }}>taskflow.app/dashboard</span>
                  </div>
                </div>
              </div>
              {/* App UI preview */}
              <div style={{ display: "flex", flex: 1 }}>
                {/* Sidebar */}
                <div style={{ width: 48, borderRight: "1px solid var(--border)", background: "var(--bg-subtle)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--heading)", display: "grid", placeItems: "center" }}><Zap size={12} color="#fff" /></div>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--accent-light)" }} />
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "transparent", border: "1px solid var(--border)" }} />
                </div>
                {/* Content area */}
                <div style={{ flex: 1, padding: "24px 28px", background: "var(--bg)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                      <div style={{ width: 120, height: 20, background: "var(--heading)", borderRadius: 6, marginBottom: 6, opacity: 0.8 }} />
                      <div style={{ width: 180, height: 12, background: "var(--border)", borderRadius: 4 }} />
                    </div>
                    <div style={{ width: 90, height: 32, background: "var(--heading)", borderRadius: 99, opacity: 0.9 }} />
                  </div>
                  {/* Stats */}
                  <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                    {[{ c: "var(--heading)", w: 60 }, { c: "var(--info)", w: 40 }, { c: "var(--success)", w: 50 }, { c: "var(--danger)", w: 30 }].map((s, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: s.c, fontFamily: "var(--font-display)", lineHeight: 1 }}>
                          {[12, 3, 8, 1][i]}
                        </div>
                        <div style={{ width: s.w, height: 8, background: "var(--border)", borderRadius: 4, marginTop: 4 }} />
                      </div>
                    ))}
                  </div>
                  {/* Task rows */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { op: "UP", status: "success", color: "var(--heading)", statusBg: "var(--success-light)", statusColor: "var(--success)" },
                      { op: "LO", status: "running", color: "var(--accent-light)", statusBg: "var(--info-light)", statusColor: "var(--info)" },
                      { op: "WC", status: "pending", color: "#EAF2FF", statusBg: "var(--warning-light)", statusColor: "var(--warning)" },
                    ].map((row, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid var(--border)" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: row.color, display: "grid", placeItems: "center", fontSize: 8, fontWeight: 800, color: i === 0 ? "#fff" : "var(--heading)", flexShrink: 0 }}>{row.op}</div>
                        <div style={{ flex: 1, height: 10, background: "var(--border)", borderRadius: 4 }} />
                        <div style={{ padding: "3px 8px", borderRadius: 99, background: row.statusBg, color: row.statusColor, fontSize: 9, fontWeight: 700, fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>{row.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget A */}
          <div className="hero-widget float-a" style={{ position: "absolute", top: 40, left: -50, background: "#fff", borderRadius: 20, padding: "16px 20px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14, width: 230 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--accent-light)", display: "grid", placeItems: "center" }}>
              <Activity size={22} color="var(--heading)" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 2, fontFamily: "var(--font-sans)" }}>Efficiency Rate</div>
              <div style={{ fontSize: 22, color: "var(--heading)", fontWeight: 700, fontFamily: "var(--font-display)" }}>98.9%</div>
            </div>
          </div>

          {/* Widget B */}
          <div className="hero-widget float-b" style={{ position: "absolute", top: 200, right: -50, background: "#fff", borderRadius: 20, padding: "18px 20px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", width: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-sans)" }}>Tasks Run</span>
              <span className="badge badge-success" style={{ fontSize: 10 }}>Live</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--heading)", lineHeight: 1 }}>8k+</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-sans)" }}>This week</div>
          </div>

          {/* Widget C — log terminal */}
          <div className="hero-widget float-a" style={{ position: "absolute", bottom: -20, left: 40, background: "#1a1c18", borderRadius: 16, padding: "12px 16px", boxShadow: "var(--shadow-lg)", border: "1px solid #2a2e25", width: 280, fontFamily: "monospace", fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Terminal size={11} color="#4a6b62" />
              <span style={{ color: "#4a6b62", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Live Logs</span>
            </div>
            {["Task received — op: uppercase", "Worker picked up — pid: 4218", "✓ Task completed — 1.2s"].map((line, i) => (
              <div key={i} style={{ color: i === 2 ? "#a5d6a7" : i === 1 ? "#90caf9" : "#a8c5be" }}>{line}</div>
            ))}
            <div style={{ color: "#3a6055" }}><span style={{ animation: "blink 1s step-end infinite" }}>▋</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background: "var(--bg-subtle)", padding: "120px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)", color: "var(--heading)", marginBottom: 14, fontWeight: 700 }}>
              Everything you need
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Built for reliability, speed, and developer experience.</p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              { icon: <Zap size={22} />, title: "Redis Queue", desc: "Jobs are pushed to a Redis list and consumed by a worker process — zero job loss." },
              { icon: <Activity size={22} />, title: "Live Polling", desc: "Status updates every 3 seconds automatically; terminal stops when task completes." },
              { icon: <CheckCircle2 size={22} />, title: "4 Operations", desc: "Uppercase, lowercase, reverse, word count — all validated and processed server-side." },
              { icon: <Terminal size={22} />, title: "Log Streaming", desc: "Each task emits timestamped logs with info / success / error levels." },
              { icon: <BarChart3 size={22} />, title: "Dashboard Stats", desc: "See total, running, completed, and failed tasks at a glance." },
              { icon: <RefreshCw size={22} />, title: "Auto Retry", desc: "Failed tasks track retry count so you always know what happened." },
            ].map((f, i) => (
              <div
                key={i}
                className="feat-card"
                style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid var(--border)", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLElement).style.borderColor = "#A8C5BE"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-light)", display: "grid", placeItems: "center", marginBottom: 18, color: "var(--heading)" }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--heading)", marginBottom: 8, fontFamily: "var(--font-display)" }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, fontFamily: "var(--font-sans)" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "120px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(30px,4vw,42px)", color: "var(--heading)", marginBottom: 14, fontWeight: 700 }}>
              How it works
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>From sign up to completed task in under a minute.</p>
          </div>

          <div className="steps-list" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { num: "01", title: "Register & Sign In",     desc: "Create a free account. Your token is securely stored in an httpOnly-style cookie." },
              { num: "02", title: "Create a Task",          desc: "Give it a title, paste your input text, and pick an operation from the 4 available." },
              { num: "03", title: "Worker Picks It Up",     desc: "A Node.js worker BLPOPs from the Redis queue and processes your text asynchronously." },
              { num: "04", title: "Watch It Complete",      desc: "The UI polls every 3s and streams logs live. Result appears the moment it's done." },
            ].map((step) => (
              <div key={step.num} className="step-item" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-light)", display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--heading)" }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--heading)", marginBottom: 6, fontFamily: "var(--font-display)" }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, fontFamily: "var(--font-sans)" }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 64 }}>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--heading)", color: "#fff", padding: "16px 40px", borderRadius: 99, fontWeight: 600, fontSize: 15, textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(30,97,87,0.3)", fontFamily: "var(--font-sans)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--heading)"; }}>
              Get Started Now <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 48px", background: "var(--bg-subtle)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "var(--heading)", display: "grid", placeItems: "center" }}>
              <Zap size={12} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--heading)", fontWeight: 600 }}>Taskflow</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>© 2026 Taskflow — Built for the DevOps MERN Assignment.</p>
        </div>
      </footer>
    </div>
  );
}