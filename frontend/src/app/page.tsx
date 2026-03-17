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
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--warm-100)",
        padding: "0 40px",
        height: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--warm-800)", display: "grid", placeItems: "center",
          }}>
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="font-display" style={{ fontSize: 20, color: "var(--warm-800)" }}>Taskflow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 15, fontWeight: 500, color: "var(--warm-600)" }}>
          <Link href="#features" style={{ textDecoration: "none", color: "inherit" }}>Features</Link>
          <Link href="#pricing" style={{ textDecoration: "none", color: "inherit" }}>Pricing</Link>
          <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>Book A Demo</Link>
          <Link href="/login" style={{
            padding: "10px 24px", borderRadius: 99,
            background: "var(--warm-800)", color: "#fff",
            textDecoration: "none", transition: "opacity 0.2s",
            boxShadow: "0 2px 10px rgba(58,47,45,0.22)",
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: 180, paddingBottom: 100,
        maxWidth: 1200, margin: "0 auto", padding: "180px 20px 100px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        position: "relative"
      }}>
        <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "var(--surface)", color: "var(--warm-800)",
            padding: "8px 20px", borderRadius: 99,
            fontSize: 14, fontWeight: 500,
            border: "1px solid var(--warm-100)",
            marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
          Intelligent execution, fully managed.
        </div>

        <h1 className="fade-up font-display" style={{
          fontSize: "clamp(42px, 6vw, 76px)",
          fontWeight: 400, lineHeight: 1.1,
          color: "var(--warm-800)", marginBottom: 28,
          letterSpacing: "-0.01em", maxWidth: 850
        }}>
          AI-Driven Task Management <br/>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontStyle: "italic", color: "var(--accent)" }}>Right Away</span>
        </h1>

        <p className="fade-up" style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: "var(--warm-400)",
          lineHeight: 1.6, maxWidth: 640, marginBottom: 48,
        }}>
          From concept to completion — manage thousands of async background tasks seamlessly with live analytics.
        </p>

        <div className="fade-up" style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 100 }}>
          <Link href="/login" style={{
            background: "var(--warm-800)", color: "#fff",
            padding: "18px 40px", borderRadius: 99,
            fontWeight: 500, fontSize: 16, textDecoration: "none",
            transition: "opacity 0.2s, transform 0.15s",
            boxShadow: "0 4px 14px rgba(58,47,45,0.25)",
          }}>
            Start for Free
          </Link>
          <Link href="/login" style={{
            background: "var(--white)", color: "var(--warm-800)",
            border: "1.5px solid var(--warm-200)",
            padding: "18px 40px", borderRadius: 99,
            fontWeight: 500, fontSize: 16, textDecoration: "none",
            transition: "border-color 0.2s, background 0.2s",
          }}>
            See a Demo
          </Link>
        </div>

        {/* Dashboard Visual Area */}
        <div style={{ position: "relative", width: "100%", maxWidth: 960, margin: "0 auto", paddingBottom: 80 }}>
          
          {/* Main Dashboard Panel */}
          <div className="hero-dashboard" style={{
            background: "var(--surface)",
            borderRadius: "32px",
            border: "1px solid var(--warm-100)",
            boxShadow: "0 24px 60px rgba(78,72,69,0.1)",
            padding: 12,
            width: "100%",
            height: 540,
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ background: "#fff", borderRadius: 24, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
               {/* Browser bar */}
               <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--warm-100)" }}>
                 <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--danger)" }} />
                 <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent)" }} />
                 <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--success)" }} />
                 <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <div style={{ background: "var(--surface)", height: 28, width: 300, borderRadius: 6 }} />
                 </div>
               </div>
               
               {/* App Content */}
               <div style={{ display: "flex", flex: 1, padding: 32, gap: 32, background: "var(--surface)", borderTopLeftRadius: 24, borderTopRightRadius: 24, margin: "8px 8px 0" }}>
                  <div style={{ flex: 1 }}>
                     <div style={{ width: 140, height: 20, background: "var(--warm-200)", borderRadius: 4, marginBottom: 12 }} />
                     <div style={{ width: 280, height: 36, background: "var(--warm-800)", borderRadius: 6, marginBottom: 32 }} />

                     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[1, 2, 3].map(i => (
                           <div key={i} style={{ height: 64, background: "#fff", borderRadius: 12, border: "1px solid var(--warm-100)", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
                              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                 <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-light)" }} />
                                 <div>
                                   <div style={{ width: 120, height: 12, background: "var(--warm-800)", borderRadius: 4, marginBottom: 6 }} />
                                   <div style={{ width: 80, height: 10, background: "var(--warm-200)", borderRadius: 4 }} />
                                 </div>
                              </div>
                              <div style={{ width: 60, height: 24, background: "var(--accent)", opacity: 0.25, borderRadius: 12 }} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Floating Widget 1 */}
          <div className="hero-widget float-slow" style={{
            position: "absolute", top: 40, left: -40,
            background: "#fff", borderRadius: 24, padding: "20px 24px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)", border: "1px solid var(--warm-100)",
            display: "flex", alignItems: "center", gap: 20, width: 260
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-light)", display: "grid", placeItems: "center" }}>
              <Activity size={28} color="var(--warm-800)" />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--warm-400)", fontWeight: 500, marginBottom: 4 }}>Job Efficiency</div>
              <div style={{ fontSize: 24, color: "var(--warm-800)", fontWeight: 700, fontFamily: "var(--font-display)" }}>98.9%</div>
            </div>
          </div>

          {/* Floating Widget 2 */}
          <div className="hero-widget float-fast" style={{
            position: "absolute", top: 220, right: -60,
            background: "#fff", borderRadius: 24, padding: "24px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)", border: "1px solid var(--warm-100)",
            width: 240
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--warm-800)", marginBottom: 2 }}>Tasks Run</div>
                <div style={{ fontSize: 13, color: "var(--warm-400)" }}>This week</div>
              </div>
              <span className="badge badge-success">Live</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
               <div style={{ fontSize: 42, fontWeight: 400, lineHeight: 1, fontFamily: "var(--font-display)" }}>8k+</div>
            </div>
          </div>

          {/* Floating Widget 3 */}
          <div className="hero-widget float-med" style={{
            position: "absolute", bottom: -20, left: 60,
            background: "#fff", borderRadius: 99, padding: "12px 24px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.06)", border: "1px solid var(--warm-100)",
          }}>
             <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
               <div style={{ display: "flex", gap: 4 }}>
                 {[1,2,3,4,5].map(i => <div key={i} style={{ color: "var(--warm-800)", fontSize: 18 }}>★</div>)}
               </div>
               <span style={{ fontSize: 15, fontWeight: 600, color: "var(--warm-800)" }}>4.9/5 Rating</span>
             </div>
          </div>
          
        </div>
      </section>

      {/* Grid Features Section - Theme matching Acme AI image */}
      <section id="features" style={{ background: "var(--white)", padding: "120px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: 80 }}>
             <h2 className="font-display scroll-fade" style={{ fontSize: "clamp(32px, 4vw, 44px)", color: "var(--warm-800)", marginBottom: 16 }}>
               Ready to assign your task?
             </h2>
             <p className="scroll-fade" style={{ fontSize: 18, color: "var(--warm-400)" }}>Explore what's possible with our fully automated runner.</p>
          </div>

           <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {[
                { title: "Create new task", desc: "Start something new.", icon: <Play size={24} /> },
                { title: "Connect calendar", desc: "Sync your schedule.", icon: <Calendar size={24} /> },
                { title: "Browse available agents", desc: "See what agents can do.", icon: <Activity size={24} /> },
                { title: "Upload your first file", desc: "Drop in a doc.", icon: <DownloadCloud size={24} /> },
                { title: "Explore use cases", desc: "See what's possible.", icon: <Layers size={24} /> },
                { title: "Customize workspaces", desc: "Find one and make it yours.", icon: <CheckCircle2 size={24} /> },
              ].map((f, i) => (
                 <div key={i} className="feature-card" style={{
                   background: "var(--surface)",
                   borderRadius: "24px",
                   padding: 24,
                   border: "1px dashed var(--warm-200)",
                   transition: "border-color 0.2s, background 0.2s",
                   cursor: "pointer",
                   display: "flex", flexDirection: "column",
                 }}
                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--warm-400)"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--warm-200)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                 >
                    <div style={{
                      height: 160, background: "#fff", borderRadius: 16, marginBottom: 24,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid var(--warm-100)",
                      boxShadow: "var(--shadow-xs)"
                    }}>
                       <div style={{
                         width: 56, height: 56, borderRadius: "50%",
                         background: "var(--warm-800)", color: "#fff",
                         display: "grid", placeItems: "center",
                         boxShadow: "0 8px 20px rgba(58,47,45,0.2)"
                       }}>
                          {f.icon}
                       </div>
                    </div>
                    <div style={{ padding: "0 8px" }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: "var(--warm-800)", marginBottom: 6 }}>{f.title}</div>
                      <div style={{ fontSize: 15, color: "var(--warm-400)" }}>{f.desc}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--warm-100)",
        padding: "48px 40px",
        background: "var(--white)"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--warm-800)", display: "grid", placeItems: "center" }}>
              <Zap size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-display" style={{ fontSize: 18, color: "var(--warm-800)" }}>Taskflow</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--warm-400)" }}>© 2026 Taskflow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}