"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft, User } from "lucide-react";
import { gsap } from "gsap";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Setup timeline for staggering elements on the left panel
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(".animate-item", 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1 }
      );

      // Fade up and scale the right side glass card
      tl.fromTo(".glass-panel",
        { opacity: 0, scale: 0.95, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "expo.out" },
        "-=0.6"
      );

      // Subtle float for the decorative elements
      gsap.to(".bg-shape-1", { x: -30, y: 20, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".bg-shape-2", { x: 40, y: -30, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      
      {/* LEFT PANEL : Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative z-10 h-full">
        
        {/* Navigation / Back */}
        <Link href="/" className="absolute top-10 left-8 sm:left-16 lg:left-24 flex items-center gap-2 group animate-item">
          <ArrowLeft size={16} className="text-[var(--warm-400)] group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium text-[var(--warm-600)]">Back to home</span>
        </Link>

        <div className="max-w-sm w-full mx-auto mt-12">
          {/* Logo */}
          <div className="animate-item flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[var(--warm-800)] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-[var(--warm-800)]">Taskflow</span>
          </div>

          <h1 className="animate-item font-display text-[2.5rem] leading-tight mb-3 text-[var(--warm-800)]">
            Create an account
          </h1>
          <p className="animate-item text-[var(--warm-400)] text-[15px] mb-8">
            Enter your details below to get started securely.
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {/* Name Input */}
            <div className="animate-item relative">
              <label className="sr-only">Full Name</label>
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <User size={18} className="text-[var(--warm-400)]" />
              </div>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full pl-12 pr-5 py-4 bg-[var(--surface)] text-[var(--warm-800)] rounded-full border border-transparent focus:bg-white focus:border-[var(--warm-200)] focus:shadow-sm focus:outline-none transition-all placeholder:text-[var(--warm-400)] text-[15px] font-medium"
              />
            </div>

            {/* Email Input */}
            <div className="animate-item relative">
              <label className="sr-only">Email address</label>
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Mail size={18} className="text-[var(--warm-400)]" />
              </div>
              <input 
                type="email" 
                placeholder="hello@company.com" 
                className="w-full pl-12 pr-5 py-4 bg-[var(--surface)] text-[var(--warm-800)] rounded-full border border-transparent focus:bg-white focus:border-[var(--warm-200)] focus:shadow-sm focus:outline-none transition-all placeholder:text-[var(--warm-400)] text-[15px] font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="animate-item relative">
              <label className="sr-only">Password</label>
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--warm-400)]" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password (min 8 characters)" 
                className="w-full pl-12 pr-12 py-4 bg-[var(--surface)] text-[var(--warm-800)] rounded-full border border-transparent focus:bg-white focus:border-[var(--warm-200)] focus:shadow-sm focus:outline-none transition-all placeholder:text-[var(--warm-400)] text-[15px] font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-[var(--warm-400)] hover:text-[var(--warm-800)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Sign Up Button (With margin top to distance from password) */}
            <button className="animate-item w-full py-4 mt-4 bg-[var(--warm-800)] hover:bg-[var(--warm-600)] text-white rounded-full font-medium text-[15px] transition-all transform active:scale-[0.98] shadow-md shadow-neutral-200">
              Create Account
            </button>

            {/* Divider */}
            <div className="animate-item relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--warm-100)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-[var(--warm-400)]">or register with</span>
              </div>
            </div>

            {/* Social Auth */}
            <button className="animate-item w-full py-4 bg-white border border-[var(--warm-200)] hover:bg-[var(--surface)] text-[var(--warm-800)] rounded-full font-semibold text-[15px] transition-all flex items-center justify-center gap-3">
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </form>

          <p className="animate-item text-center mt-8 text-[14px] text-[var(--warm-600)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--warm-800)] hover:text-[var(--accent)] transition-colors">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL : Visual */}
      <div className="hidden lg:flex w-[55%] xl:w-[60%] relative bg-[var(--warm-800)] items-center justify-center p-12">
        {/* Abstract shapes making up the background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-shape-1 absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--danger)] mix-blend-screen opacity-40 blur-[100px]" />
          <div className="bg-shape-2 absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--accent)] mix-blend-screen opacity-30 blur-[120px]" />
        </div>

        {/* 3D-like structural element (pure CSS approximation of a clean geometric object) */}
        <div className="absolute inset-0 flex items-center justify-center p-20 opacity-70 pointer-events-none">
           <div className="w-[450px] h-[300px] border border-white/10 rounded-[40px] rotate-[-5deg] flex relative overflow-hidden backdrop-blur-sm bg-white/5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[var(--accent)]/50 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full" />
           </div>
        </div>

        {/* Glassmorphic overlay card */}
        <div className="glass-panel relative z-10 w-full max-w-lg p-10 bg-[#3A2F2D]/60 backdrop-blur-xl border border-[#6B5F5C]/40 rounded-3xl shadow-2xl">
           <div className="flex gap-4 items-center mb-8">
              <div className="text-white/40 font-mono text-[10px] tracking-[0.2em]">01 SYSTEM START</div>
              <div className="h-px bg-white/20 flex-1" />
           </div>

           <h3 className="text-4xl font-display text-white leading-tight mb-4">
             Streamlined logic <br />
             <span className="text-[var(--accent)] italic font-sans font-normal border-b-2 border-[var(--danger)]">without limits.</span>
           </h3>
           <p className="text-[#D5CECC] text-[15px] leading-relaxed mb-10">
             Taskflow isolates your operations in dedicated backgrounds. Our Python runner executes them and seamlessly syncs results directly to your dashboard.
           </p>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                 <div className="text-white text-2xl font-display font-medium">99.9%</div>
                 <div className="text-[#9D918E] text-[12px] uppercase tracking-wider mt-1">Uptime</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                 <div className="text-white text-2xl font-display font-medium">~5ms</div>
                 <div className="text-[#9D918E] text-[12px] uppercase tracking-wider mt-1">Latency</div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
