"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  orgName: string;
  pendingCount: number;
}

const NAV = [
  { href: "/app",              label: "Overview",     icon: <HomeIcon /> },
  { href: "/app/transactions", label: "Transactions", icon: <InboxIcon /> },
  { href: "/app/statements",   label: "Statements",   icon: <ChartIcon /> },
  { href: "/app/connect",      label: "Connect",      icon: <PlugIcon /> },
];

export function SidebarNav({ orgName, pendingCount }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  }

  const initial = orgName.slice(0, 1).toUpperCase();

  return (
    <aside
      className="flex h-screen w-[232px] shrink-0 flex-col"
      style={{ background: "#14141a", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Workspace header */}
      <div
        className="flex h-11 items-center gap-2 px-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded text-[11px] font-bold text-white"
          style={{ background: "#5e6ad2" }}
        >
          {initial}
        </div>
        <span className="flex-1 truncate text-[13px] font-semibold text-lx-text">
          {orgName}
        </span>
        <ChevronDownIcon />
      </div>

      {/* Section label */}
      <div className="px-3 pb-1 pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-lx-faint">
          Workspace
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex h-7 items-center gap-1.5 rounded px-2 text-[13px] transition-colors ${
                active
                  ? "bg-[rgba(94,106,210,0.1)] text-lx-text"
                  : "text-lx-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-lx-text"
              }`}
            >
              <span className={active ? "text-lx-purple" : "text-lx-faint"}>
                {icon}
              </span>
              <span className="flex-1">{label}</span>
              {label === "Transactions" && pendingCount > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: "rgba(94,106,210,0.15)", color: "#5e6ad2" }}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-2 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/login"
          className="flex h-7 items-center gap-2 rounded px-2 text-[12px] text-lx-faint transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-lx-muted"
        >
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ background: "#252532", color: "#8a8a99" }}
          >
            {initial}
          </div>
          <span>Sign out</span>
        </Link>
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 6L7 1.5 12.5 6V13a.5.5 0 0 1-.5.5H9.5V9.5h-5V13.5H2a.5.5 0 0 1-.5-.5V6z" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" />
      <path d="M1.5 9h2.75l1.25 2h3l1.25-2H12.5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1.5" />
      <line x1="1.5" y1="6" x2="12.5" y2="6" />
      <line x1="6" y1="6" x2="6" y2="12.5" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 1v3M9 1v3" />
      <rect x="3" y="4" width="8" height="4" rx="1" />
      <path d="M7 8v3" />
      <path d="M5.5 11h3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="text-lx-faint">
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}
