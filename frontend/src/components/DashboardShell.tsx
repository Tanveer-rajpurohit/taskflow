"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard,
  PlusCircle,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

type DashboardShellProps = { children: React.ReactNode };

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "New Task", href: "/tasks/new", icon: PlusCircle },
];

const SIDEBAR_EXPANDED = 228;
const SIDEBAR_COLLAPSED = 62;

export const DashboardShell = ({ children }: DashboardShellProps): React.JSX.Element => {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const isActive = (href: string): boolean =>
    href !== "#" && (pathname === href || pathname.startsWith(href + "/"));

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

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
          background: active ? "rgba(30,97,87,0.1)" : "transparent",
          color: active ? "var(--heading)" : "var(--text-muted)",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: active ? 600 : 500,
          transition: "background 0.15s, color 0.15s",
          border: active ? "1px solid rgba(30,97,87,0.15)" : "1px solid transparent",
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "rgba(30,97,87,0.06)";
            (e.currentTarget as HTMLElement).style.color = "var(--heading)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
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
              background: "var(--heading)",
            }}
          />
        )}
        <Icon size={size} style={{ flexShrink: 0 }} />
        {!collapsed && label}
      </Link>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)", background: "var(--bg)" }}>

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarW,
          flexShrink: 0,
          background: "var(--bg-subtle)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
          overflow: "hidden",
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            height: 80,
            borderBottom: "1px solid var(--border)",
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
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--heading)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(30,97,87,0.3)",
              }}
            >
              <Zap size={14} color="#fff" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  color: "var(--heading)",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
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
              border: "1.5px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-light)";
              e.currentTarget.style.color = "var(--heading)";
              e.currentTarget.style.borderColor = "var(--heading)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg)";
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: collapsed ? "14px 8px" : "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            transition: "padding 0.22s",
          }}
        >
          {!collapsed && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--text-light)",
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                padding: "0 10px",
                marginBottom: 8,
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
              }}
            >
              Workspace
            </span>
          )}
          {MAIN_NAV.map((item) => navLink(item))}
        </nav>

        {/* User + Logout */}
        <div
          style={{
            padding: collapsed ? "12px 8px" : "12px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            transition: "padding 0.22s",
          }}
        >
          {/* User info */}
          {!collapsed ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 10,
                background: "var(--accent-light)",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--heading)",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--heading)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name ?? "User"}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.email ?? ""}
                </div>
              </div>
            </div>
          ) : (
            <div
              title={user?.name ?? "User"}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--heading)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 700,
                margin: "0 auto 4px",
                cursor: "default",
              }}
            >
              {initials}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
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
              border: "1px solid transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              width: "100%",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--danger-light)";
              e.currentTarget.style.borderColor = "rgba(192,69,58,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <LogOut size={14} style={{ flexShrink: 0 }} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarW,
          background: "var(--bg)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
