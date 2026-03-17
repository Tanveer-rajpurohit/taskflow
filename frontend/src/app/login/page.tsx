"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft } from "lucide-react";
import { gsap } from "gsap";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Setup timeline for staggering elements on the left panel
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(".animate-item", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }
      );

      // Fade up and scale the right side glass card
      tl.fromTo(".glass-panel",
        { opacity: 0, y: 30, backdropFilter: "blur(0px)" },
        { opacity: 1, y: 0, backdropFilter: "blur(16px)", duration: 1.2, ease: "power2.out" },
        "-=0.6"
      );

      // Subtle float for the decorative elements
      gsap.to(".bg-shape-1", { x: 30, y: -20, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".bg-shape-2", { x: -40, y: 30, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });

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
            Welcome to <br />Taskflow
          </h1>
          <p className="animate-item text-[var(--warm-400)] text-[15px] mb-8">
            Please enter your details to sign in to your workspace.
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="Password" 
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

            {/* Extras */}
            <div className="animate-item flex items-center justify-between pt-1 pb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--warm-200)] text-[var(--warm-800)] focus:ring-[var(--warm-800)]" />
                <span className="text-[13px] text-[var(--warm-600)] group-hover:text-[var(--warm-800)] transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-[13px] font-semibold text-[var(--warm-800)] hover:text-[var(--accent)] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button className="animate-item w-full py-4 bg-[var(--warm-800)] hover:bg-[var(--warm-600)] text-white rounded-full font-medium text-[15px] transition-all transform active:scale-[0.98] shadow-md shadow-neutral-200">
              Sign In
            </button>

            {/* Divider */}
            <div className="animate-item relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--warm-100)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-[var(--warm-400)]">or continue with</span>
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
              Sign in with Google
            </button>
          </form>

          <p className="animate-item text-center mt-8 text-[14px] text-[var(--warm-600)]">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--warm-800)] hover:text-[var(--accent)] transition-colors">
              Sign up today
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL : Visual */}
      <div className="hidden lg:flex w-[55%] xl:w-[60%] relative bg-[#E1E7E6] items-center justify-center p-12">
        {/* Abstract shapes making up the background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-shape-1 absolute top-[-5%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-[var(--surface)] to-[#D3DDDB] blur-[80px]" />
          <div className="bg-shape-2 absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-l from-[#C8CFCE] to-[#EAEFEB] blur-[100px]" />
        </div>

        {/* 3D-like structural element (pure CSS approximation of a clean geometric object) */}
        <div className="absolute inset-0 flex items-center justify-center p-20 opacity-80 pointer-events-none">
           <div className="w-[400px] h-[400px] bg-gradient-to-tr from-[#FFFFFF] to-[#E1E7E6] rounded-3xl shadow-[30px_30px_60px_rgba(0,0,0,0.05),-30px_-30px_60px_rgba(255,255,255,0.8)] rotate-12 flex relative">
              <div className="absolute inset-8 bg-gradient-to-bl from-[#FFFFFF] to-[#E1E7E6] rounded-xl shadow-[inset_10px_10px_20px_rgba(0,0,0,0.03),inset_-10px_-10px_20px_rgba(255,255,255,0.9)] flex items-center justify-center">
                 <div className="w-1/2 h-1/2 rounded-full border-[16px] border-[#F1F5F4] shadow-inner" />
              </div>
           </div>
        </div>

        {/* Glassmorphic overlay card (like BonSante / RenderWonders combo) */}
        <div className="glass-panel relative z-10 w-full max-w-lg p-10 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--warm-800)] animate-ping" />
              </div>
              <span className="text-[13px] font-semibold tracking-widest uppercase text-[var(--warm-800)]">Process Execution</span>
           </div>

           <h3 className="text-3xl font-display text-[var(--warm-800)] leading-[1.2] mb-4">
             AI Revolutionizing the way we batch and compute operations.
           </h3>
           <p className="text-[var(--warm-600)] text-[15px] leading-relaxed mb-8">
             Taskflow delegates text tasks asynchronously. Build powerful queues and let our workers scale your productivity safely and seamlessly.
           </p>

           <div className="flex items-center justify-between pt-6 border-t border-white/40">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E1E7E6] flex items-center justify-center text-xs font-bold text-gray-400">T1</div>
                 <div className="w-10 h-10 rounded-full bg-white border-2 border-[#E1E7E6] flex items-center justify-center text-xs font-bold text-gray-400">T2</div>
                 <div className="w-10 h-10 rounded-full bg-[var(--warm-800)] border-2 border-[#E1E7E6] flex items-center justify-center z-10 text-white text-xs">+</div>
              </div>
              <span className="text-[13px] font-medium text-[var(--warm-800)]">Join 20k+ Users!</span>
           </div>
        </div>
      </div>

    </div>
  );
}
