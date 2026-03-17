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
          gap: collapsed ? 0 : 10,
          padding: collapsed ? "10px" : "10px 12px",
          borderRadius: 10,
          background: active ? "#fff" : "transparent",
          color: active ? "var(--warm-800)" : "var(--warm-400)",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: active ? 600 : 500,
          transition: "background 0.15s, color 0.15s",
          border: active ? "1px solid var(--warm-100)" : "1px solid transparent",
          boxShadow: active ? "0 1px 4px rgba(58,47,45,0.06)" : "none",
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "rgba(58,47,45,0.05)";
            (e.currentTarget as HTMLElement).style.color = "var(--warm-600)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--warm-400)";
          }
        }}
      >
        {active && !collapsed && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 18,
              borderRadius: "0 3px 3px 0",
              background: "var(--warm-800)",
            }}
          />
        )}
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
          background: "#F6F6F6",
          borderRight: "1px solid var(--warm-100)",
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
            height: 64,
            borderBottom: "1px solid var(--warm-100)",
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
              gap: 9,
              textDecoration: "none",
              overflow: "hidden",
              flexShrink: collapsed ? 0 : 1,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "var(--warm-800)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={13} color="#fff" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  color: "var(--warm-800)",
                  whiteSpace: "nowrap",
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
              width: 26,
              height: 26,
              borderRadius: 7,
              border: "1.5px solid var(--warm-100)",
              background: "#fff",
              color: "var(--warm-400)",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              flexShrink: 0,
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "var(--warm-800)";
              e.currentTarget.style.borderColor = "var(--warm-200)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "var(--warm-400)";
              e.currentTarget.style.borderColor = "var(--warm-100)";
            }}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

       
        <nav
          style={{
            flex: 1,
            padding: collapsed ? "14px 8px" : "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "padding 0.22s",
          }}
        >
          {!collapsed && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--warm-200)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "0 10px",
                marginBottom: 6,
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
            borderTop: "1px solid var(--warm-100)",
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
          background: "#fff",
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
