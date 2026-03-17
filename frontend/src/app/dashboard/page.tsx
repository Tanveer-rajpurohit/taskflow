"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

type TaskStatus = "pending" | "running" | "completed" | "failed";
type OperationType = "Uppercase" | "Lowercase" | "Reverse" | "Word Count";
type ViewMode = "list" | "grid";

type Task = {
  id: string;
  title: string;
  operation: OperationType;
  status: TaskStatus;
  createdAt: string;
};

const MOCK_TASKS: Task[] = [
  { id: "2", title: "Normalize API response data", operation: "Lowercase", status: "running", createdAt: "12 min ago" },
  { id: "3", title: "Analyze word frequency in docs", operation: "Word Count", status: "pending", createdAt: "1h ago" },
  { id: "1", title: "Process customer feedback", operation: "Uppercase", status: "completed", createdAt: "2h ago" },
  { id: "5", title: "Uppercase product name batch", operation: "Uppercase", status: "completed", createdAt: "3h ago" },
  { id: "6", title: "Process daily log entries", operation: "Word Count", status: "completed", createdAt: "5h ago" },
  { id: "4", title: "Reverse encoded string tokens", operation: "Reverse", status: "failed", createdAt: "6h ago" },
];

type StatItem = {
  label: string;
  value: number;
  color: string;
};

const STATS: StatItem[] = [
  { label: "Total", value: MOCK_TASKS.length, color: "var(--warm-800)" },
  { label: "Running", value: MOCK_TASKS.filter((t) => t.status === "running").length, color: "#1565C0" },
  { label: "Completed", value: MOCK_TASKS.filter((t) => t.status === "completed").length, color: "#2E7D32" },
  { label: "Failed", value: MOCK_TASKS.filter((t) => t.status === "failed").length, color: "#C62828" },
];

type OperationStyle = { bg: string; text: string };

const OPERATION_STYLE: Record<OperationType, OperationStyle> = {
  Uppercase: { bg: "var(--warm-800)", text: "#fff" },
  Lowercase: { bg: "var(--warm-100)", text: "var(--warm-800)" },
  Reverse: { bg: "#F0EBE8", text: "var(--warm-600)" },
  "Word Count": { bg: "#EAF2FF", text: "#1565C0" },
};

type StatusMeta = { cls: string; label: string; icon: React.ElementType };

const STATUS_META: Record<TaskStatus, StatusMeta> = {
  pending: { cls: "badge badge-pending", label: "Pending", icon: Clock },
  running: { cls: "badge badge-running", label: "Running", icon: Loader2 },
  completed: { cls: "badge badge-success", label: "Completed", icon: CheckCircle2 },
  failed: { cls: "badge badge-failed", label: "Failed", icon: XCircle },
};

const OPERATION_ABBR: Record<OperationType, string> = {
  Uppercase: "UP",
  Lowercase: "LO",
  Reverse: "RE",
  "Word Count": "WC",
};

export default function DashboardPage(): React.JSX.Element {
  const [view, setView] = useState<ViewMode>("list");

  return (
    <DashboardShell>
      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--warm-100)",
          padding: "0 36px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--warm-400)" }}>
            Dashboard
          </span>
        </div>
        <Link
          href="/tasks/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            borderRadius: 99,
            background: "var(--warm-800)",
            color: "#fff",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
            transition: "opacity 0.2s",
            boxShadow: "0 2px 8px rgba(58,47,45,0.18)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "0.88")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.opacity = "1")
          }
        >
          <Plus size={14} strokeWidth={2.5} />
          New Task
        </Link>
      </header>

      {/* ── CONTENT ───────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "48px 36px 36px" }}>

        {/* ── Greeting ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3vw, 36px)",
              fontWeight: 400,
              color: "var(--warm-800)",
              lineHeight: 1.15,
              marginBottom: 6,
            }}
          >
            Good afternoon!
          </h1>
          <p style={{ fontSize: 15, color: "var(--warm-400)", fontWeight: 400 }}>
            Ready to assign your task?
          </p>
        </div>

        {/* ── Stats strip ───────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 44,
          }}
        >
          {STATS.map(({ label, value, color }, idx) => (
            <div
              key={label}
              style={{
                paddingRight: 36,
                marginRight: 36,
                borderRight:
                  idx < STATS.length - 1
                    ? "1px solid var(--warm-100)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 700,
                  color,
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                  marginBottom: 5,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--warm-400)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tasks section ─────────────────────────────────────── */}
        <div>
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--warm-600)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Recent Tasks
            </span>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                gap: 2,
                background: "#F6F6F6",
                borderRadius: 9,
                padding: 3,
              }}
            >
              {(["list", "grid"] as ViewMode[]).map((mode) => {
                const isActive = view === mode;
                const Icon = mode === "list" ? LayoutList : LayoutGrid;
                return (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    title={mode === "list" ? "List view" : "Grid view"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      border: "none",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "var(--warm-800)" : "var(--warm-400)",
                      cursor: "pointer",
                      boxShadow: isActive ? "0 1px 3px rgba(58,47,45,0.10)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon size={14} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── LIST VIEW ─────────────────────────────────────────── */}
          {view === "list" && (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--warm-100)",
              }}
            >
              {MOCK_TASKS.map((task, idx) => {
                const opStyle = OPERATION_STYLE[task.operation];
                const meta = STATUS_META[task.status];
                const StatusIcon = meta.icon;
                const isLast = idx === MOCK_TASKS.length - 1;

                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 20px",
                      borderBottom: isLast ? "none" : "1px solid var(--warm-100)",
                      textDecoration: "none",
                      gap: 14,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "#FAFAFA")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "transparent")
                    }
                  >
                    {/* Operation badge */}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: opStyle.bg,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        fontSize: 9,
                        fontWeight: 800,
                        color: opStyle.text,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {OPERATION_ABBR[task.operation]}
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--warm-800)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.title}
                    </div>

                    {/* Operation pill */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 600,
                        background: opStyle.bg,
                        color: opStyle.text,
                        flexShrink: 0,
                      }}
                    >
                      {task.operation}
                    </span>

                    {/* Status */}
                    <span
                      className={meta.cls}
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        minWidth: 90,
                      }}
                    >
                      <StatusIcon size={10} strokeWidth={2.5} />
                      {meta.label}
                    </span>

                    {/* Date */}
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--warm-400)",
                        flexShrink: 0,
                        minWidth: 76,
                        textAlign: "right",
                      }}
                    >
                      {task.createdAt}
                    </span>

                    <ArrowRight
                      size={14}
                      color="var(--warm-200)"
                      style={{ flexShrink: 0 }}
                    />
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── GRID VIEW ─────────────────────────────────────────── */}
          {view === "grid" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {MOCK_TASKS.map((task) => {
                const opStyle = OPERATION_STYLE[task.operation];
                const meta = STATUS_META[task.status];
                const StatusIcon = meta.icon;

                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                      borderRadius: 14,
                      border: "1px solid var(--warm-100)",
                      background: "#fff",
                      textDecoration: "none",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      gap: 0,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--warm-200)";
                      el.style.boxShadow = "0 4px 16px rgba(58,47,45,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--warm-100)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Top row: operation badge + date */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 11,
                          background: opStyle.bg,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          color: opStyle.text,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {OPERATION_ABBR[task.operation]}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--warm-400)",
                        }}
                      >
                        {task.createdAt}
                      </span>
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--warm-800)",
                        lineHeight: 1.4,
                        marginBottom: 14,
                        flex: 1,
                      }}
                    >
                      {task.title}
                    </div>

                    {/* Bottom row: operation + status */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 600,
                          background: opStyle.bg,
                          color: opStyle.text,
                        }}
                      >
                        {task.operation}
                      </span>
                      <span
                        className={meta.cls}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <StatusIcon size={10} strokeWidth={2.5} />
                        {meta.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}
