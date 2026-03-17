"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

type OperationType = "Uppercase" | "Lowercase" | "Reverse" | "Word Count";

type FormState = {
  title: string;
  inputText: string;
  operation: OperationType;
};

const OPERATIONS: { value: OperationType; label: string; description: string }[] = [
  { value: "Uppercase", label: "Uppercase", description: "Convert all text to UPPERCASE" },
  { value: "Lowercase", label: "Lowercase", description: "Convert all text to lowercase" },
  { value: "Reverse", label: "Reverse", description: "Reverse the entire string" },
  { value: "Word Count", label: "Word Count", description: "Count total words in text" },
];

const INITIAL_FORM: FormState = {
  title: "",
  inputText: "",
  operation: "Uppercase",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--warm-600)",
  marginBottom: 7,
};

const FIELD_STYLE: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1.5px solid var(--warm-100)",
  background: "var(--surface)",
  fontSize: 14,
  color: "var(--warm-800)",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, background 0.2s",
};

export default function NewTaskPage(): React.JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/tasks/2");
    }, 800);
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.background = "#fff";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    e.target.style.borderColor = "var(--warm-100)";
    e.target.style.background = "var(--surface)";
  };

  const isFormValid =
    form.title.trim().length > 0 && form.inputText.trim().length > 0;

  const wordCount =
    form.inputText.trim().length > 0
      ? form.inputText.trim().split(/\s+/).length
      : 0;

  return (
    <DashboardShell>
      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--warm-100)",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 9,
            border: "1.5px solid var(--warm-100)",
            color: "var(--warm-600)",
            textDecoration: "none",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--warm-200)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--warm-100)";
          }}
        >
          <ArrowLeft size={15} />
        </Link>

        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 400,
              color: "var(--warm-800)",
              lineHeight: 1,
            }}
          >
            New Task
          </h1>
          <p style={{ fontSize: 12, color: "var(--warm-400)", marginTop: 3 }}>
            Configure and run a text processing task
          </p>
        </div>
      </header>

      {/* ── CONTENT ───────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          padding: "36px 32px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 600 }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 22 }}
          >
            {/* Task title */}
            <div>
              <label style={LABEL_STYLE}>Task Title</label>
              <input
                type="text"
                placeholder="e.g. Process customer feedback"
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={FIELD_STYLE}
                maxLength={120}
              />
            </div>

            {/* Input text */}
            <div>
              <label style={LABEL_STYLE}>Input Text</label>
              <textarea
                placeholder="Paste or type the text you want to process..."
                value={form.inputText}
                rows={8}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm((prev) => ({ ...prev, inputText: e.target.value }))
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  ...FIELD_STYLE,
                  resize: "vertical",
                  lineHeight: 1.65,
                }}
              />
              {wordCount > 0 && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--warm-400)",
                    marginTop: 5,
                  }}
                >
                  {wordCount} words · {form.inputText.length} characters
                </p>
              )}
            </div>

            {/* Operation selector */}
            <div>
              <label style={LABEL_STYLE}>Operation</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                }}
              >
                {OPERATIONS.map((op) => {
                  const isSelected = form.operation === op.value;
                  return (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, operation: op.value }))
                      }
                      style={{
                        padding: "11px 10px",
                        borderRadius: 10,
                        border: isSelected
                          ? "1.5px solid var(--warm-800)"
                          : "1.5px solid var(--warm-100)",
                        background: isSelected ? "var(--warm-800)" : "#fff",
                        color: isSelected ? "#fff" : "var(--warm-600)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.15s",
                        fontFamily: "inherit",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {op.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--warm-100)" }} />

            {/* Submit row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <Link
                href="/dashboard"
                style={{
                  padding: "12px 22px",
                  borderRadius: 99,
                  border: "1.5px solid var(--warm-100)",
                  color: "var(--warm-600)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "var(--surface)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                style={{
                  padding: "12px 28px",
                  borderRadius: 99,
                  background:
                    isFormValid && !isSubmitting
                      ? "var(--warm-800)"
                      : "var(--warm-200)",
                  color:
                    isFormValid && !isSubmitting ? "#fff" : "var(--warm-400)",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor:
                    isFormValid && !isSubmitting ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  transition: "opacity 0.2s, background 0.2s",
                  letterSpacing: "0.01em",
                  boxShadow:
                    isFormValid && !isSubmitting
                      ? "0 2px 8px rgba(58,47,45,0.2)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (isFormValid && !isSubmitting)
                    e.currentTarget.style.opacity = "0.88";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {isSubmitting ? "Queuing..." : "Run Task"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </DashboardShell>
  );
}
