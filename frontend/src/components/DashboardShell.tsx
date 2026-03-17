"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  HelpCircle,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DashboardShellProps = {
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Task", href: "/tasks/new", icon: PlusCircle },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", href: "#", icon: Settings },
  { label: "Help", href: "#", icon: HelpCircle },
];

const SIDEBAR_EXPANDED = 232;
const SIDEBAR_COLLAPSED = 60;

export const DashboardShell = ({
  children,
}: DashboardShellProps): React.JSX.Element => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const isActive = (href: string): boolean =>
    href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

  const navLink = (
    { label, href, icon: Icon }: NavItem,
    size: number = 16
  ): React.JSX.Element => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        title={collapsed ? label : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? 0 : 12,
          padding: collapsed ? "10px" : "11px 14px",
          borderRadius: 11,
          background: active ? "var(--primary)" : "transparent",
          color: active ? "#fff" : "var(--text-secondary)",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          border: active ? "1px solid var(--primary)" : "1px solid transparent",
          boxShadow: active ? "0 4px 12px rgba(10, 74, 142, 0.2)" : "none",
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "rgba(10, 74, 142, 0.08)";
            (e.currentTarget as HTMLElement).style.color = "var(--primary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        <Icon size={size} style={{ flexShrink: 0 }} />
        {!collapsed && label}
      </Link>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
     
      <aside
        style={{
          width: sidebarW,
          flexShrink: 0,
          background: "#FFFFFF",
          borderRight: "1px solid var(--surface-border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          overflow: "hidden",
          transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
      
        <div
          style={{
            height: 70,
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? "0 16px" : "0 12px 0 18px",
            flexShrink: 0,
            gap: 8,
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              overflow: "hidden",
              flexShrink: collapsed ? 0 : 1,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #0A4A8E 0%, #00D9FF 100%)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  color: "var(--primary)",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Taskflow
              </span>
            )}
          </Link>

         
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1.5px solid var(--surface-border)",
              background: "#fff",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0,
              padding: 0,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "var(--primary)";
              e.currentTarget.style.borderColor = "#00D9FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--surface-border)";
            }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

       
        <nav
          style={{
            flex: 1,
            padding: collapsed ? "16px 8px" : "18px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            transition: "padding 0.22s",
          }}
        >
          {!collapsed && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0 12px",
                marginBottom: 8,
                whiteSpace: "nowrap",
              }}
            >
              Workspace
            </span>
          )}
          {MAIN_NAV.map((item) => navLink(item))}
        </nav>

       
        <div
          style={{
            padding: collapsed ? "12px 8px" : "12px",
            borderTop: "1px solid var(--surface-border)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "padding 0.22s",
          }}
        >
          {BOTTOM_NAV.map((item) => navLink(item, 15))}

          {/* Logout */}
          <button
            title={collapsed ? "Logout" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 10,
              padding: collapsed ? "9px" : "9px 12px",
              borderRadius: 10,
              color: "var(--danger)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              width: "100%",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#FFF0F0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      
      <div
        style={{
          flex: 1,
          marginLeft: sidebarW,
          background: "#FFFFFF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
