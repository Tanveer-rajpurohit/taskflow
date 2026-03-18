"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  RefreshCw,
  Terminal,
  FileText,
  Info,
  Trash2,
  Timer,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import AuthGuard from "@/components/AuthGuard";
import { useTasks } from "@/hooks/useTasks";
import { useTaskStore } from "@/store/useTaskStore";
import { useTaskPolling } from "@/hooks/useTaskPolling";
import type { ITask, ITaskLog, TaskStatus } from "@/types";

const STATUS_META: Record<TaskStatus, { cls: string; label: string; icon: React.ElementType; dot: string }> = {
  pending: { cls: "badge badge-pending", label: "Pending",  icon: Clock,       dot: "var(--warning)" },
  running: { cls: "badge badge-running", label: "Running",  icon: Loader2,     dot: "var(--info)" },
  success: { cls: "badge badge-success", label: "Success",  icon: CheckCircle2,dot: "var(--success)" },
  failed:  { cls: "badge badge-failed",  label: "Failed",   icon: XCircle,     dot: "var(--danger)" },
};

const OPERATION_LABELS: Record<string, string> = {
  uppercase:  "UPPERCASE",
  lowercase:  "LOWERCASE",
  reverse:    "REVERSE",
  word_count: "WORD COUNT",
};

function logColor(level: ITaskLog["level"]): string {
  if (level === "error")   return "#ef9a9a";
  if (level === "success") return "#a5d6a7";
  return "#a8c5be"; // info — teal-ish
}

function formatTs(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, fontFamily: "var(--font-sans)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export default function TaskDetailPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const taskId = params?.id ?? "";
  const router = useRouter();
  const { getTaskById, deleteTask } = useTasks();
  const { tasks } = useTaskStore();
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Find from store (populated by fetch or polling)
  const task: ITask | undefined = tasks.find((t) => t._id === taskId);

  // Initial fetch
  useEffect(() => {
    if (!taskId) return;
    (async () => {
      setPageLoading(true);
      const result = await getTaskById(taskId);
      if (!result) setPageError("Task not found or access denied.");
      setPageLoading(false);
    })();
  }, [taskId, getTaskById]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [task?.logs]);

  // GSAP entrance
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!task) return;
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.fromTo(".detail-card", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
      }, containerRef);
    })();
    return () => { ctx?.revert(); };
  }, [task?._id]);

  // Polling — uses the hook
  useTaskPolling(taskId || null, task?.status);

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Delete this task? This cannot be undone.")) return;
    setDeleting(true);
    const ok = await deleteTask(taskId);
    if (ok) router.push("/dashboard");
    else setDeleting(false);
  };

  const handleCopyResult = (): void => {
    if (!task?.result) return;
    navigator.clipboard.writeText(task.result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ─── Loading / Error states ─────────────────────────────── */
  if (pageLoading) {
    return (
      <AuthGuard>
        <DashboardShell>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid var(--accent-light)", borderTopColor: "var(--heading)", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading task…</span>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  if (pageError || !task) {
    return (
      <AuthGuard>
        <DashboardShell>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 48 }}>
            <AlertCircle size={40} color="var(--danger)" strokeWidth={1.5} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--heading)", fontFamily: "var(--font-display)" }}>{pageError ?? "Task not found"}</div>
            <Link href="/dashboard" style={{ padding: "10px 24px", borderRadius: 99, background: "var(--heading)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Back to Dashboard
            </Link>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  const meta = STATUS_META[task.status] ?? STATUS_META.pending;
  const StatusIcon = meta.icon;
  const isActive = task.status === "pending" || task.status === "running";
  const hasResult = task.status === "success" && task.result;
  const hasFailed = task.status === "failed";

  return (
    <AuthGuard>
      <DashboardShell>
        {/* Header */}
        <header style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <Link
            href="/dashboard"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 9, border: "1.5px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.15s", flexShrink: 0 }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--accent-light)"; el.style.borderColor = "var(--heading)"; el.style.color = "var(--heading)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-muted)"; }}
          >
            <ArrowLeft size={15} />
          </Link>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--heading)", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {task.title}
              </h1>
              <span className={meta.cls} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
                <StatusIcon size={10} strokeWidth={2.5} className={task.status === "running" ? "animate-spin" : ""} />
                {meta.label}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Created {new Date(task.createdAt).toLocaleString()}
              </p>
              {isActive && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--info)" }}>
                  <RefreshCw size={10} className="animate-spin-slow" />
                  Polling every 3s
                </span>
              )}
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 99, border: "1.5px solid rgba(192,69,58,0.3)", background: "var(--danger-light)", color: "var(--danger)", cursor: deleting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)", transition: "all 0.15s", opacity: deleting ? 0.6 : 1, flexShrink: 0 }}
            onMouseEnter={(e) => { if (!deleting) { e.currentTarget.style.background = "var(--danger)"; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--danger-light)"; e.currentTarget.style.color = "var(--danger)"; }}
          >
            <Trash2 size={13} strokeWidth={2.5} />
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </header>

        {/* Content */}
        <main
          ref={containerRef}
          style={{ flex: 1, padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Task Info card */}
            <div className="detail-card" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={13} color="var(--text-muted)" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>Task Info</span>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18 }}>

                <InfoRow label="Operation">
                  <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: "var(--heading)", color: "#fff", letterSpacing: "0.04em", fontFamily: "var(--font-sans)" }}>
                    {OPERATION_LABELS[task.operation] ?? task.operation.toUpperCase()}
                  </span>
                </InfoRow>

                <InfoRow label="Status">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: meta.dot, flexShrink: 0, boxShadow: isActive ? `0 0 0 3px ${meta.dot}33` : "none", animation: isActive ? "pulse-dot 1.4s ease-in-out infinite" : "none" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-sans)" }}>{meta.label}</span>
                  </div>
                </InfoRow>

                <InfoRow label="Task ID">
                  <code style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface)", padding: "3px 8px", borderRadius: 6, fontFamily: "monospace", wordBreak: "break-all" }}>
                    {task._id}
                  </code>
                </InfoRow>

                {task.durationMs != null && (
                  <InfoRow label="Duration">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Timer size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-sans)" }}>
                        {task.durationMs < 1000 ? `${task.durationMs}ms` : `${(task.durationMs / 1000).toFixed(2)}s`}
                      </span>
                    </div>
                  </InfoRow>
                )}

                {task.retryCount > 0 && (
                  <InfoRow label="Retries">
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--warning)", fontFamily: "var(--font-sans)" }}>{task.retryCount}</span>
                  </InfoRow>
                )}

                {task.errorMessage && (
                  <InfoRow label="Error">
                    <span style={{ fontSize: 12, color: "var(--danger)", background: "var(--danger-light)", padding: "4px 10px", borderRadius: 8, display: "block", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                      {task.errorMessage}
                    </span>
                  </InfoRow>
                )}
              </div>
            </div>

            {/* Input text card */}
            {task.inputText && (
              <div className="detail-card" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>Input Text</span>
                </div>
                <div style={{ padding: "16px 20px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 200, overflowY: "auto" }}>
                  {task.inputText}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Result */}
            <div className="detail-card" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>Result</span>
                </div>
                {hasResult && (
                  <button
                    onClick={handleCopyResult}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 600, color: copied ? "var(--success)" : "var(--text-muted)", transition: "all 0.15s", fontFamily: "var(--font-sans)" }}
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>

              <div style={{ padding: "20px", minHeight: 120, display: "flex", alignItems: hasResult ? "flex-start" : "center", justifyContent: hasResult ? "flex-start" : "center" }}>
                {hasResult ? (
                  <pre style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "var(--text)", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", background: "var(--bg)", padding: "14px 16px", borderRadius: 10, width: "100%", boxSizing: "border-box", border: "1px solid var(--border)" }}>
                    {task.result}
                  </pre>
                ) : hasFailed ? (
                  <div style={{ textAlign: "center", color: "var(--danger)" }}>
                    <XCircle size={28} strokeWidth={1.5} style={{ marginBottom: 8, opacity: 0.6 }} />
                    <p style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-sans)" }}>Task failed — no output available</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                    <Loader2 size={24} strokeWidth={1.5} style={{ marginBottom: 8, opacity: 0.5, animation: isActive ? "spin 1.5s linear infinite" : "none" }} />
                    <p style={{ fontSize: 13, fontFamily: "var(--font-sans)" }}>
                      {task.status === "pending" ? "Waiting to be picked up…" : "Processing your task…"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Logs */}
            <div className="detail-card" style={{ background: "#1a1c18", border: "1px solid #2a2e25", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2e25", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={13} color="#4a6b62" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#4a6b62", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>Processing Logs</span>
                </div>
                <span style={{ fontSize: 11, color: "#3a5048", fontFamily: "var(--font-sans)" }}>
                  {task.logs.length} {task.logs.length === 1 ? "line" : "lines"}
                </span>
              </div>

              <div style={{ padding: "16px 20px", minHeight: 180, fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, overflowY: "auto", maxHeight: 300 }}>
                {task.logs.length === 0 ? (
                  <span style={{ color: "#3d5249" }}>Waiting for worker to pick up task…</span>
                ) : (
                  task.logs.map((log, i) => (
                    <div key={i} style={{ color: logColor(log.level), display: "flex", gap: 10 }}>
                      <span style={{ color: "#4a5a52", flexShrink: 0 }}>[{formatTs(log.timestamp)}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
                {isActive && (
                  <div style={{ color: "#3a6055", marginTop: 4 }}>
                    <span className="animate-blink">▋</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </main>
      </DashboardShell>
    </AuthGuard>
  );
}
