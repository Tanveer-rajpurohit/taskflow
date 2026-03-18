"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, Type, RefreshCcw, Hash, AlertCircle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import AuthGuard from "@/components/AuthGuard";
import { useTasks } from "@/hooks/useTasks";
import type { TaskOperation } from "@/types";

type UIOperation = { value: TaskOperation; label: string; description: string; icon: React.ElementType };

const OPERATIONS: UIOperation[] = [
  { value: "uppercase",  label: "Uppercase",   description: "Convert all text to UPPERCASE",       icon: Type },
  { value: "lowercase",  label: "Lowercase",   description: "Convert all text to lowercase",       icon: Type },
  { value: "reverse",    label: "Reverse",     description: "Reverse the entire string",           icon: RefreshCcw },
  { value: "word_count", label: "Word Count",  description: "Count total words in the text",       icon: Hash },
];

const MAX_INPUT_CHARS = 50000;
const MAX_TITLE_CHARS = 120;

export default function NewTaskPage(): React.JSX.Element {
  const router = useRouter();
  const { createTask, isLoading, error: taskError } = useTasks();
  const [title, setTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [operation, setOperation] = useState<TaskOperation>("uppercase");
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || taskError;
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.fromTo(".form-field", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: "power2.out", delay: 0.1 });
        gsap.fromTo(".op-btn", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: "back.out(1.4)", delay: 0.35 });
      }, containerRef);
    })();
    return () => { ctx?.revert(); };
  }, []);

  const wordCount = inputText.trim().length > 0 ? inputText.trim().split(/\s+/).length : 0;
  const isFormValid = title.trim().length > 0 && inputText.trim().length > 0 && inputText.length <= MAX_INPUT_CHARS;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLocalError(null);
    if (!isFormValid) return;

    const task = await createTask({ title: title.trim(), inputText, operation });
    if (task) {
      router.push(`/tasks/${task._id}`);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid var(--border)",
    background: "var(--bg)",
    fontSize: 14,
    color: "var(--text)",
    outline: "none",
    fontFamily: "var(--font-sans)",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "var(--heading)";
    e.target.style.boxShadow = "0 0 0 3px rgba(30,97,87,0.12)";
    e.target.style.background = "#fff";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "var(--bg)";
  };

  const selectedOp = OPERATIONS.find((o) => o.value === operation);

  return (
    <AuthGuard>
      <DashboardShell>
        {/* Header */}
        <header className="dash-header" style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <Link
            href="/dashboard"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 9, border: "1.5px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.15s" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--accent-light)"; el.style.borderColor = "var(--heading)"; el.style.color = "var(--heading)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-muted)"; }}
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--heading)", lineHeight: 1 }}>
              New Task
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, fontFamily: "var(--font-sans)" }}>
              Configure and queue a text processing task
            </p>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "40px 32px", display: "flex", justifyContent: "center" }}>
          <div ref={containerRef} style={{ width: "100%", maxWidth: 620 }}>

            {/* Error */}
            {displayError && (
              <div className="toast-error" style={{ marginBottom: 20 }}>
                <AlertCircle size={15} />
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Task title */}
              <div className="form-field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--heading)", marginBottom: 7, fontFamily: "var(--font-sans)" }}>
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Process customer feedback"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  style={inputStyle}
                  maxLength={MAX_TITLE_CHARS}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4, fontSize: 11, color: "var(--text-light)", fontFamily: "var(--font-sans)" }}>
                  {title.length}/{MAX_TITLE_CHARS}
                </div>
              </div>

              {/* Input text */}
              <div className="form-field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--heading)", marginBottom: 7, fontFamily: "var(--font-sans)" }}>
                  Input Text
                </label>
                <textarea
                  placeholder="Paste or type the text you want to process…"
                  value={inputText}
                  rows={8}
                  onChange={(e) => setInputText(e.target.value)}
                  onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
                  onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "var(--text-light)", fontFamily: "var(--font-sans)" }}>
                  <span>{wordCount > 0 ? `${wordCount} word${wordCount === 1 ? "" : "s"}` : ""}</span>
                  <span style={{ color: inputText.length > MAX_INPUT_CHARS ? "var(--danger)" : "var(--text-light)" }}>
                    {inputText.length.toLocaleString()}/{MAX_INPUT_CHARS.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Operation selector */}
              <div className="form-field">
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--heading)", marginBottom: 10, fontFamily: "var(--font-sans)" }}>
                  Operation
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                  {OPERATIONS.map((op) => {
                    const isSelected = operation === op.value;
                    const OpIcon = op.icon;
                    return (
                      <button
                        key={op.value}
                        type="button"
                        className="op-btn"
                        onClick={() => setOperation(op.value)}
                        style={{
                          padding: "12px 10px 10px",
                          borderRadius: 12,
                          border: isSelected ? "2px solid var(--heading)" : "1.5px solid var(--border)",
                          background: isSelected ? "var(--heading)" : "var(--bg)",
                          color: isSelected ? "#fff" : "var(--text-muted)",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.18s",
                          fontFamily: "var(--font-sans)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: isSelected ? "0 4px 14px rgba(30,97,87,0.28)" : "none",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "var(--heading)"; e.currentTarget.style.color = "var(--heading)"; } }}
                        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; } }}
                      >
                        <OpIcon size={16} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{op.label}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedOp && (
                  <p style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>
                    {selectedOp.description}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--border)" }} />

              {/* Submit */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                <Link
                  href="/dashboard"
                  style={{ padding: "12px 22px", borderRadius: 99, border: "1.5px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "all 0.15s", fontFamily: "var(--font-sans)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "12px 28px",
                    borderRadius: 99,
                    background: isFormValid && !isLoading ? "var(--heading)" : "var(--surface)",
                    color: isFormValid && !isLoading ? "#fff" : "var(--text-light)",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.2s",
                    boxShadow: isFormValid && !isLoading ? "0 2px 10px rgba(30,97,87,0.28)" : "none",
                  }}
                  onMouseEnter={(e) => { if (isFormValid && !isLoading) e.currentTarget.style.background = "var(--accent-hover)"; }}
                  onMouseLeave={(e) => { if (isFormValid && !isLoading) e.currentTarget.style.background = "var(--heading)"; }}
                >
                  <Zap size={14} strokeWidth={2.5} />
                  {isLoading ? "Queuing…" : "Run Task"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </DashboardShell>
    </AuthGuard>
  );
}
