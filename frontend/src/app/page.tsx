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
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 48px",
        height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--primary)", display: "grid", placeItems: "center",
            boxShadow: "0 4px 12px rgba(31, 27, 24, 0.15)",
          }}>
            <Zap size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-display" style={{ fontSize: 22, fontWeight: 400, color: "var(--primary)", letterSpacing: "-0.02em" }}>Taskflow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>
          <Link href="#features" style={{ textDecoration: "none", color: "inherit", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>Features</Link>
          <Link href="#pricing" style={{ textDecoration: "none", color: "inherit", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>Pricing</Link>
          <Link href="/login" style={{ textDecoration: "none", color: "inherit", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>Demo</Link>
          <Link href="/login" style={{
            padding: "11px 28px", borderRadius: 99,
            background: "var(--primary)", color: "#fff",
            textDecoration: "none", transition: "all 0.3s",
            boxShadow: "0 8px 24px rgba(31, 27, 24, 0.2)",
            fontWeight: 600,
            fontSize: 14,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(31, 27, 24, 0.3)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(31, 27, 24, 0.2)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 180, paddingBottom: 100,
        maxWidth: 1300, margin: "0 auto", padding: "180px 40px 100px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        position: "relative"
      }}>
        <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--surface-light)", color: "var(--primary)",
            padding: "9px 22px", borderRadius: 99,
            fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
            border: "1px solid var(--border)",
            marginBottom: 40,
            boxShadow: "0 2px 8px rgba(31, 27, 24, 0.04)",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
          Intelligent Execution, Fully Managed
        </div>

        <h1 className="fade-up font-display" style={{
          fontSize: "clamp(48px, 7vw, 84px)",
          fontWeight: 400, lineHeight: 1.08,
          color: "var(--primary)", marginBottom: 32,
          letterSpacing: "-0.02em", maxWidth: 920,
        }}>
          AI-Driven Task Management <br/>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontStyle: "normal", color: "var(--accent)", background: "linear-gradient(135deg, #D4A373, #C0925C)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>at Scale</span>
        </h1>

        <p className="fade-up" style={{
          fontSize: "clamp(17px, 2.2vw, 21px)", color: "var(--text-secondary)",
          lineHeight: 1.7, maxWidth: 700, marginBottom: 56,
          fontWeight: 400,
        }}>
          From concept to completion—manage thousands of async background tasks seamlessly with real-time analytics and intelligent insights.
        </p>

        <div className="fade-up" style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 120, justifyContent: "center" }}>
          <Link href="/login" style={{
            background: "var(--primary)", color: "#fff",
            padding: "16px 44px", borderRadius: 99,
            fontWeight: 600, fontSize: 15, textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 12px 32px rgba(31, 27, 24, 0.25)",
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(31, 27, 24, 0.35)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(31, 27, 24, 0.25)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}>
            Start for Free
          </Link>
          <Link href="/login" style={{
            background: "var(--white)", color: "var(--primary)",
            border: "1.5px solid var(--border)",
            padding: "16px 44px", borderRadius: 99,
            fontWeight: 600, fontSize: 15, textDecoration: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 12px rgba(31, 27, 24, 0.08)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(212, 163, 115, 0.15)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(31, 27, 24, 0.08)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}>
            See a Demo
          </Link>
        </div>

        {/* Dashboard Visual Area */}
        <div style={{ position: "relative", width: "100%", maxWidth: 1000, margin: "0 auto", paddingBottom: 100 }}>
          
          {/* Main Dashboard Panel with Premium Styling */}
          <div className="hero-dashboard" style={{
            background: "linear-gradient(135deg, #FAFAFA 0%, #F5F3F1 100%)",
            borderRadius: "40px",
            border: "1px solid var(--border)",
            boxShadow: "0 32px 80px rgba(31, 27, 24, 0.12), 0 0 1px rgba(31, 27, 24, 0.05)",
            padding: 14,
            width: "100%",
            height: 560,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            <div style={{ background: "#fff", borderRadius: 32, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
               {/* Browser bar - Premium */}
               <div style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)" }}>
                 <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F56" }} />
                 <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FFBD2E" }} />
                 <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#27C93F" }} />
                 <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <div style={{ background: "var(--surface-light)", height: 30, width: 320, borderRadius: 8, border: "1px solid var(--border)" }} />
                 </div>
               </div>
               
               {/* App Content - Elevated */}
               <div style={{ display: "flex", flex: 1, padding: 36, gap: 36, background: "linear-gradient(180deg, #FAFAFA 0%, #F5F3F1 100%)", overflow: "hidden" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
                     <div style={{ width: 160, height: 22, background: "var(--text-muted)", borderRadius: 6, opacity: 0.3 }} />
                     <div style={{ width: 320, height: 42, background: "var(--primary)", borderRadius: 10, opacity: 0.9 }} />

                     <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 12 }}>
                        {[1, 2, 3].map(i => (
                           <div key={i} style={{ height: 68, background: "#fff", borderRadius: 16, border: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 26px", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(31, 27, 24, 0.04)" }}>
                              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                                 <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #D4A373, #C0925C)", opacity: 0.2 }} />
                                 <div>
                                   <div style={{ width: 140, height: 14, background: "var(--primary)", borderRadius: 5, marginBottom: 7, opacity: 0.8 }} />
                                   <div style={{ width: 100, height: 11, background: "var(--text-secondary)", borderRadius: 4, opacity: 0.4 }} />
                                 </div>
                              </div>
                              <div style={{ width: 70, height: 28, background: "var(--accent)", opacity: 0.15, borderRadius: 14 }} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Floating Widget 1 - Premium */}
          <div className="hero-widget float-slow" style={{
            position: "absolute", top: 50, left: -50,
            background: "#fff", borderRadius: 28, padding: "24px 28px",
            boxShadow: "0 16px 48px rgba(31, 27, 24, 0.16), 0 0 1px rgba(31, 27, 24, 0.04)", 
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 22, width: 280
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #D4A373, #C0925C)", opacity: 0.15, display: "grid", placeItems: "center" }}>
              <Activity size={32} color="var(--primary)" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.02em" }}>EFFICIENCY</div>
              <div style={{ fontSize: 28, color: "var(--primary)", fontWeight: 700, fontFamily: "var(--font-display)", lineHeight: 1 }}>98.9%</div>
            </div>
          </div>

          {/* Floating Widget 2 - Premium */}
          <div className="hero-widget float-fast" style={{
            position: "absolute", top: 240, right: -70,
            background: "#fff", borderRadius: 28, padding: "28px",
            boxShadow: "0 16px 48px rgba(31, 27, 24, 0.16), 0 0 1px rgba(31, 27, 24, 0.04)", 
            border: "1px solid var(--border)",
            width: 260
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--primary)", marginBottom: 3 }}>Tasks Run</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>This week</div>
              </div>
              <span className="badge badge-success">Live</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
               <div style={{ fontSize: 48, fontWeight: 400, lineHeight: 1, fontFamily: "var(--font-display)", color: "var(--primary)" }}>8k</div>
               <div style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 500 }}>+</div>
            </div>
          </div>

          {/* Floating Widget 3 - Premium */}
          <div className="hero-widget float-med" style={{
            position: "absolute", bottom: -28, left: 80,
            background: "#fff", borderRadius: 99, padding: "14px 28px",
            boxShadow: "0 16px 48px rgba(31, 27, 24, 0.16), 0 0 1px rgba(31, 27, 24, 0.04)", 
            border: "1px solid var(--border)",
          }}>
             <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
               <div style={{ display: "flex", gap: 5 }}>
                 {[1,2,3,4,5].map(i => <div key={i} style={{ color: "#FFB800", fontSize: 18, lineHeight: 1 }}>★</div>)}
               </div>
               <span style={{ fontSize: 15, fontWeight: 700, color: "var(--primary)" }}>4.9 Rating</span>
             </div>
          </div>
          
        </div>
      </section>

      {/* Grid Features Section - Premium Design */}
      <section id="features" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F5F3F1 100%)", padding: "140px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: 100 }}>
             <h2 className="font-display scroll-fade" style={{ fontSize: "clamp(38px, 4.5vw, 52px)", color: "var(--primary)", marginBottom: 20, fontWeight: 400, letterSpacing: "-0.01em" }}>
               Get started in minutes
             </h2>
             <p className="scroll-fade" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 400, maxWidth: 600, margin: "0 auto" }}>Explore what's possible with our fully automated, intelligent task runner.</p>
          </div>

           <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
              {[
                { title: "Create Tasks", desc: "Start new intelligent tasks in seconds.", icon: <Play size={26} /> },
                { title: "Connect Tools", desc: "Integrate with your favorite apps.", icon: <Calendar size={26} /> },
                { title: "Smart Agents", desc: "Leverage AI-powered processing agents.", icon: <Activity size={26} /> },
                { title: "Upload Data", desc: "Batch process files and documents.", icon: <DownloadCloud size={26} /> },
                { title: "Scale Operations", desc: "Handle thousands of tasks concurrently.", icon: <Layers size={26} /> },
                { title: "Custom Workflows", desc: "Build tailored automation workflows.", icon: <CheckCircle2 size={26} /> },
              ].map((f, i) => (
                 <div key={i} className="feature-card" style={{
                   background: "#fff",
                   borderRadius: "28px",
                   padding: 32,
                   border: "1px solid var(--border)",
                   transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                   cursor: "pointer",
                   display: "flex", flexDirection: "column",
                   boxShadow: "0 4px 12px rgba(31, 27, 24, 0.05)",
                 }}
                 onMouseEnter={e => { 
                   const el = e.currentTarget as HTMLElement;
                   el.style.borderColor = "var(--accent)"; 
                   el.style.boxShadow = "0 16px 40px rgba(212, 163, 115, 0.12), 0 0 1px rgba(212, 163, 115, 0.1)";
                   el.style.transform = "translateY(-8px)";
                 }}
                 onMouseLeave={e => { 
                   const el = e.currentTarget as HTMLElement;
                   el.style.borderColor = "var(--border)"; 
                   el.style.boxShadow = "0 4px 12px rgba(31, 27, 24, 0.05)";
                   el.style.transform = "translateY(0)";
                 }}
                 >
                    <div style={{
                      height: 100, background: "linear-gradient(135deg, #D4A373, #C0925C)", borderRadius: 18, marginBottom: 28,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "none",
                      boxShadow: "none",
                      opacity: 0.12,
                    }}>
                       <div style={{
                         color: "var(--primary)",
                         display: "flex", alignItems: "center", justifyContent: "center",
                       }}>
                          {f.icon}
                       </div>
                    </div>
                    <div style={{ padding: "0" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)", marginBottom: 8, letterSpacing: "-0.01em" }}>{f.title}</div>
                      <div style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 400, lineHeight: 1.6 }}>{f.desc}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "64px 40px",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F5F3F1 100%)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--primary)", display: "grid", placeItems: "center", boxShadow: "0 4px 12px rgba(31, 27, 24, 0.15)" }}>
              <Zap size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-display" style={{ fontSize: 20, color: "var(--primary)", fontWeight: 400, letterSpacing: "-0.02em" }}>Taskflow</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>© 2026 Taskflow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
