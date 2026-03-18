"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  LayoutList,
  LayoutGrid,
  Trash2,
  ListTodo,
  Zap,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import AuthGuard from "@/components/AuthGuard";
import type { ITask } from "@/types";

type ViewMode = "list" | "grid";

const OPERATION_STYLE: Record<string, { bg: string; text: string; abbr: string }> = {
  uppercase:  { bg: "var(--heading)", text: "#fff",              abbr: "UP" },
  lowercase:  { bg: "var(--accent-light)", text: "var(--heading)", abbr: "LO" },
  reverse:    { bg: "#E8F0EC", text: "#2D5F42",                   abbr: "RE" },
  word_count: { bg: "#EAF2FF", text: "var(--info)",               abbr: "WC" },
};

const STATUS_META: Record<string, { cls: string; label: string; icon: React.ElementType }> = {
  pending: { cls: "badge badge-pending", label: "Pending",  icon: Clock },
  running: { cls: "badge badge-running", label: "Running",  icon: Loader2 },
  success: { cls: "badge badge-success", label: "Success",  icon: CheckCircle2 },
  failed:  { cls: "badge badge-failed",  label: "Failed",   icon: XCircle },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", gap: 14, borderBottom: "1px solid var(--border)" }}>
      <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0 }} />
      <div className="skeleton" style={{ flex: 1, height: 14, borderRadius: 6 }} />
      <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 99 }} />
      <div className="skeleton" style={{ width: 80, height: 22, borderRadius: 99 }} />
      <div className="skeleton" style={{ width: 64, height: 12, borderRadius: 6 }} />
    </div>
  );
}

export default function DashboardPage(): React.JSX.Element {
  const [view, setView] = useState<ViewMode>("list");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { tasks, isLoading, fetchTasks, deleteTask } = useTasks();
  const { user } = useAuthStore();
  const headerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // GSAP entrance animation
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".dash-header",
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        gsap.fromTo(
          ".stat-card",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.2 }
        );
        gsap.fromTo(
          ".task-row",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out", delay: 0.4 }
        );
      });
    })();
    return () => { ctx?.revert(); };
  }, [tasks]);

  const safeTasks = tasks ?? [];

  const stats = useMemo(() => [
    { label: "Total",     value: safeTasks.length,                                                          color: "var(--heading)" },
    { label: "Running",   value: safeTasks.filter((t) => t.status === "running").length,                    color: "var(--info)" },
    { label: "Completed", value: safeTasks.filter((t) => t.status === "success").length,                    color: "var(--success)" },
    { label: "Failed",    value: safeTasks.filter((t) => t.status === "failed").length,                     color: "var(--danger)" },
  ], [safeTasks]);

  const handleDelete = async (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this task? This cannot be undone.")) return;
    setDeletingId(taskId);
    await deleteTask(taskId);
    setDeletingId(null);
  };

  const renderTaskCard = (task: ITask) => {
    const op = OPERATION_STYLE[task.operation] ?? { bg: "var(--surface)", text: "var(--text)", abbr: "??" };
    const meta = STATUS_META[task.status] ?? STATUS_META.pending;
    const StatusIcon = meta.icon;
    const isDeleting = deletingId === task._id;

    if (view === "grid") {
      return (
        <Link
          key={task._id}
          href={`/tasks/${task._id}`}
          className="task-row"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "#fff",
            textDecoration: "none",
            transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
            opacity: isDeleting ? 0.5 : 1,
            pointerEvents: isDeleting ? "none" : "auto",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "#A8C5BE";
            el.style.boxShadow = "var(--shadow-md)";
            el.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border)";
            el.style.boxShadow = "none";
            el.style.transform = "translateY(0)";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: op.bg, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 800, color: op.text, letterSpacing: "0.04em" }}>
              {op.abbr}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-light)" }}>
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={(e) => handleDelete(e, task._id)}
                title="Delete task"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 7, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", color: "var(--text-light)", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--danger-light)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "rgba(192,69,58,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-light)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 14, flex: 1 }}>
            {task.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: op.bg, color: op.text }}>
              {task.operation}
            </span>
            <span className={meta.cls} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <StatusIcon size={10} strokeWidth={2.5} className={task.status === "running" ? "animate-spin" : ""} />
              {meta.label}
            </span>
          </div>
        </Link>
      );
    }

    // List view
    const isLast = safeTasks[safeTasks.length - 1]?._id === task._id;
    return (
      <div
        key={task._id}
        className="task-row"
        style={{ position: "relative", borderBottom: isLast ? "none" : "1px solid var(--border)", opacity: isDeleting ? 0.5 : 1 }}
      >
        <Link
          href={`/tasks/${task._id}`}
          style={{ display: "flex", alignItems: "center", padding: "14px 20px", textDecoration: "none", gap: 14, transition: "background 0.12s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <div style={{ width: 34, height: 34, borderRadius: 9, background: op.bg, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 9, fontWeight: 800, color: op.text, letterSpacing: "0.04em" }}>
            {op.abbr}
          </div>
          <div style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {task.title}
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: op.bg, color: op.text, flexShrink: 0 }}>
            {task.operation}
          </span>
          <span className={meta.cls} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, minWidth: 84 }}>
            <StatusIcon size={10} strokeWidth={2.5} className={task.status === "running" ? "animate-spin" : ""} />
            {meta.label}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-light)", flexShrink: 0, minWidth: 76, textAlign: "right" }}>
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <ArrowRight size={13} color="var(--border-strong)" style={{ flexShrink: 0 }} />
        </Link>
        <button
          onClick={(e) => handleDelete(e, task._id)}
          title="Delete task"
          style={{ position: "absolute", right: 52, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 7, border: "1px solid transparent", background: "transparent", cursor: "pointer", color: "var(--text-light)", transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--danger-light)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "rgba(192,69,58,0.25)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-light)"; e.currentTarget.style.borderColor = "transparent"; }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    );
  };

  return (
    <AuthGuard>
      <DashboardShell>
        {/* Header */}
        <header
          ref={headerRef}
          className="dash-header"
          style={{ borderBottom: "1px solid var(--border)", padding: "0 36px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg)" }}
        >
          <div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>Dashboard</span>
          </div>
          <Link
            href="/tasks/new"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 99, background: "var(--heading)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600, transition: "all 0.2s", boxShadow: "0 2px 10px rgba(30,97,87,0.25)", fontFamily: "var(--font-sans)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,97,87,0.35)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--heading)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(30,97,87,0.25)"; }}
          >
            <Plus size={14} strokeWidth={2.5} />
            New Task
          </Link>
        </header>

        <main style={{ flex: 1, padding: "44px 36px 36px" }}>
          {/* Greeting */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,34px)", fontWeight: 600, color: "var(--heading)", lineHeight: 1.15, marginBottom: 6 }}>
              {getGreeting()}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 400 }}>
              {safeTasks.length > 0 ? `You have ${safeTasks.length} task${safeTasks.length === 1 ? "" : "s"} in your workspace.` : "Ready to create your first task?"}
            </p>
          </div>

          {/* Stats Strip */}
          <div ref={statsRef} style={{ display: "flex", gap: 0, marginBottom: 44, flexWrap: "wrap" }}>
            {stats.map(({ label, value, color }, idx) => (
              <div
                key={label}
                className="stat-card"
                style={{ paddingRight: 36, marginRight: 36, borderRight: idx < stats.length - 1 ? "1px solid var(--border)" : "none", marginBottom: 8 }}
              >
                <div style={{ fontSize: 38, fontWeight: 700, color, fontFamily: "var(--font-display)", lineHeight: 1, marginBottom: 4 }}>
                  {value}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Tasks Section */}
          <div>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-sans)" }}>
                Recent Tasks
              </span>

              {/* View toggle */}
              <div style={{ display: "flex", gap: 2, background: "var(--surface)", borderRadius: 9, padding: 3 }}>
                {(["list", "grid"] as ViewMode[]).map((mode) => {
                  const active = view === mode;
                  const Icon = mode === "list" ? LayoutList : LayoutGrid;
                  return (
                    <button
                      key={mode}
                      onClick={() => setView(mode)}
                      title={`${mode} view`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, border: "none", background: active ? "#fff" : "transparent", color: active ? "var(--heading)" : "var(--text-light)", cursor: "pointer", boxShadow: active ? "var(--shadow-xs)" : "none", transition: "all 0.15s" }}
                    >
                      <Icon size={14} strokeWidth={2} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loading state */}
            {isLoading && safeTasks.length === 0 && (
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
                {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && safeTasks.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "#fff", borderRadius: 20, border: "1.5px dashed var(--border-strong)", gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-light)", display: "grid", placeItems: "center" }}>
                  <ListTodo size={28} color="var(--heading)" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: "var(--heading)", marginBottom: 6, fontFamily: "var(--font-display)" }}>No tasks yet</div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Create your first task to get started.</div>
                </div>
                <Link
                  href="/tasks/new"
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 99, background: "var(--heading)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 10px rgba(30,97,87,0.25)", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--heading)"; }}
                >
                  <Zap size={14} /> Create Task
                </Link>
              </div>
            )}

            {/* List view */}
            {!isLoading && safeTasks.length > 0 && view === "list" && (
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
                {safeTasks.map((task) => renderTaskCard(task))}
              </div>
            )}

            {/* Grid view */}
            {!isLoading && safeTasks.length > 0 && view === "grid" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
                {safeTasks.map((task) => renderTaskCard(task))}
              </div>
            )}
          </div>
        </main>
      </DashboardShell>
    </AuthGuard>
  );
}
