"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, Activity, CheckCircle2, BarChart3, Layers, Play, Calendar, DownloadCloud } from "lucide-react";
import Lenis from "lenis";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    let lenis: Lenis;

    const initLenisAndGSAP = async () => {
      // Initialize Lenis
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
      });

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Tie Lenis to GSAP Ticker
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // GSAP Animations (Minimalist & Clean)
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // Gentle Hero entrance
        tl.fromTo(".fade-up", 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
        );

        // Smooth Dashboard mockup reveal
        tl.fromTo(".hero-dashboard", 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 1.2 },
          "-=0.6"
        );

        // Subtle Floating widgets pop in
        tl.fromTo(".hero-widget",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" },
          "-=0.8"
        );

        // Continuous floating animation (very subtle)
        gsap.to(".float-slow", { y: -8, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".float-fast", { y: -5, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });
        gsap.to(".float-med", { y: -6, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });

        // Scroll animations for features grid
        gsap.fromTo(".feature-card",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
            scrollTrigger: { trigger: ".features-grid", start: "top 85%" }
          }
        );

        // Scroll animations for headings
        gsap.utils.toArray('.scroll-fade').forEach(el => {
          gsap.fromTo(el as Element, 
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
              scrollTrigger: { trigger: el as Element, start: "top 90%" }
            }
          );
        });

      }, containerRef);
    };

    initLenisAndGSAP();

    return () => {
      ctx?.revert();
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ background: "var(--white)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#FFFFFF",
        borderBottom: "1px solid var(--surface-border)",
        padding: "0 56px",
        height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #0A4A8E 0%, #00D9FF 100%)", 
            display: "grid", placeItems: "center",
          }}>
            <Zap size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-display" style={{ fontSize: 24, fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em" }}>Taskflow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40, fontSize: 15, fontWeight: 600, color: "var(--text-secondary)" }}>
          <Link href="#features" style={{ textDecoration: "none", color: "inherit" }}>Features</Link>
          <Link href="#pricing" style={{ textDecoration: "none", color: "inherit" }}>Pricing</Link>
          <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>Demo</Link>
          <Link href="/login" style={{
            padding: "12px 32px", borderRadius: 8,
            background: "linear-gradient(135deg, #0A4A8E 0%, #0F5FA8 100%)", 
            color: "#fff",
            textDecoration: "none", transition: "all 0.3s",
            fontWeight: 700,
            fontSize: 14,
            boxShadow: "0 4px 16px rgba(10, 74, 142, 0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).boxShadow = "0 8px 32px rgba(10, 74, 142, 0.4)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).boxShadow = "0 4px 16px rgba(10, 74, 142, 0.3)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 160, paddingBottom: 120,
        maxWidth: 1400, margin: "0 auto", padding: "160px 56px 120px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        position: "relative"
      }}>
        <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#E0F2FE", color: "#0369A1",
            padding: "10px 24px", borderRadius: 8,
            fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
            marginBottom: 48,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00D9FF", display: "inline-block", flexShrink: 0 }} />
          Intelligent Automation at Scale
        </div>

        <h1 className="fade-up font-display" style={{
          fontSize: "clamp(52px, 8vw, 96px)",
          fontWeight: 700, lineHeight: 1.05,
          color: "var(--primary)", marginBottom: 24,
          letterSpacing: "-0.03em", maxWidth: 1000,
        }}>
          Process Tasks with <br/>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 800, background: "linear-gradient(135deg, #0A4A8E 0%, #00D9FF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI-Powered Intelligence</span>
        </h1>

        <p className="fade-up" style={{
          fontSize: "clamp(18px, 2.2vw, 22px)", color: "var(--text-secondary)",
          lineHeight: 1.7, maxWidth: 760, marginBottom: 56,
          fontWeight: 500,
        }}>
          Automate thousands of background tasks with real-time insights, intelligent routing, and seamless integration into your workflow.
        </p>

        <div className="fade-up" style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 140, justifyContent: "center" }}>
          <Link href="/login" style={{
            background: "linear-gradient(135deg, #0A4A8E 0%, #0F5FA8 100%)", 
            color: "#fff",
            padding: "16px 48px", borderRadius: 8,
            fontWeight: 700, fontSize: 16, textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 24px rgba(10, 74, 142, 0.3)",
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(10, 74, 142, 0.4)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(10, 74, 142, 0.3)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}>
            Start Free
          </Link>
          <Link href="/login" style={{
            background: "transparent", color: "var(--primary)",
            border: "2px solid var(--primary)",
            padding: "14px 44px", borderRadius: 8,
            fontWeight: 700, fontSize: 16, textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--primary)";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--primary)";
          }}>
            View Demo
          </Link>
        </div>

        {/* Dashboard Visual - Minimal approach */}
        <div style={{ position: "relative", width: "100%", maxWidth: 1100, margin: "0 auto", paddingBottom: 80 }}>
          <div className="hero-dashboard" style={{
            background: "linear-gradient(135deg, #0A4A8E 0%, #052E5C 100%)",
            borderRadius: 20,
            border: "1px solid rgba(0, 217, 255, 0.2)",
            padding: "40px",
            width: "100%",
            minHeight: 480,
            display: "flex", flexDirection: "column", gap: 32,
            boxShadow: "0 20px 60px rgba(10, 74, 142, 0.2)",
          }}>
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#00D9FF", marginBottom: 8, letterSpacing: "0.05em" }}>DASHBOARD</div>
                <h3 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 0 }}>Active Tasks</h3>
              </div>
              <div style={{ padding: "8px 16px", background: "#10B981", borderRadius: 6, color: "#fff", fontWeight: 700, fontSize: 12 }}>LIVE</div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { label: "Processed", value: "8,420" },
                { label: "Success Rate", value: "98.9%" },
                { label: "Avg Speed", value: "2.3s" }
              ].map((stat, i) => (
                <div key={i} style={{ borderLeft: "2px solid #00D9FF", paddingLeft: 16 }}>
                  <div style={{ fontSize: 12, color: "#7DD3FC", fontWeight: 700, marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Task List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", background: "rgba(0, 217, 255, 0.1)", borderRadius: 10,
                  border: "1px solid rgba(0, 217, 255, 0.2)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Task {i}</div>
                      <div style={{ fontSize: 12, color: "#7DD3FC" }}>Processing data batch</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>Complete</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - No Cards */}
      <section id="features" style={{ background: "#fff", padding: "160px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: 100 }}>
             <h2 className="font-display scroll-fade" style={{ fontSize: "clamp(42px, 5vw, 56px)", color: "var(--primary)", marginBottom: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
               Powerful Features
             </h2>
             <p className="scroll-fade" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 500, maxWidth: 700, margin: "0 auto" }}>Everything you need to automate and scale your task management operations.</p>
          </div>

          {/* Feature List - Minimal Design */}
          <div className="features-grid" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { title: "Instant Task Creation", desc: "Create and deploy tasks in seconds with our intuitive interface.", icon: <Play size={28} /> },
              { title: "AI-Powered Routing", desc: "Intelligent agents automatically route tasks to optimal processors.", icon: <Activity size={28} /> },
              { title: "Real-Time Analytics", desc: "Monitor task performance with live dashboards and insights.", icon: <BarChart3 size={28} /> },
              { title: "Seamless Integration", desc: "Connect with your existing tools and workflows effortlessly.", icon: <Layers size={28} /> },
              { title: "Enterprise Scale", desc: "Process millions of tasks concurrently with zero downtime.", icon: <CheckCircle2 size={28} /> },
              { title: "Advanced Security", desc: "Enterprise-grade security with full compliance standards.", icon: <DownloadCloud size={28} /> },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{
                padding: "28px 32px",
                borderBottom: "1px solid var(--surface-border)",
                display: "flex", alignItems: "center", gap: 28,
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={e => { 
                (e.currentTarget as HTMLElement).style.background = "#F9FAFB";
                (e.currentTarget as HTMLElement).style.paddingLeft = "40px";
              }}
              onMouseLeave={e => { 
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.paddingLeft = "32px";
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 12,
                  background: "linear-gradient(135deg, #0A4A8E 0%, #00D9FF 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 500 }}>{f.desc}</div>
                </div>
                <div style={{ fontSize: 20, color: "var(--accent)", fontWeight: 700 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--surface-border)",
        padding: "56px 56px",
        background: "#fff"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #0A4A8E 0%, #00D9FF 100%)", display: "grid", placeItems: "center" }}>
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-display" style={{ fontSize: 22, color: "var(--primary)", fontWeight: 600, letterSpacing: "-0.02em" }}>Taskflow</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>© 2026 Taskflow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
