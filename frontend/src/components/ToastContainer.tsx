"use client";
import React from "react";
import { useToastStore, ToastType } from "../store/useToastStore";
import { AlertCircle, CheckCircle, X, Info } from "lucide-react";

const ICON_MAP: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const CLASS_MAP: Record<ToastType, string> = {
  success: "toast-success",
  error: "toast-error",
  info: "toast-info", // Will fall back to basic styling if not in CSS
};

export const ToastContainer = (): React.JSX.Element | null => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const Icon = ICON_MAP[toast.type];
        return (
          <div
            key={toast.id}
            className={CLASS_MAP[toast.type]}
            style={{
              pointerEvents: "auto",
              minWidth: 280,
              maxWidth: 400,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              animation: "fadeInUp 0.3s ease-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              background: toast.type === 'error' ? 'var(--danger-light)' : 'var(--success-light)',
              color: toast.type === 'error' ? 'var(--danger)' : 'var(--success)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(192,69,58,0.2)' : 'rgba(46,125,50,0.2)'}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon size={18} strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)" }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                color: "inherit",
                opacity: 0.6,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
