"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  orgName: string;
  pendingCount: number;
}

const NAV = [
  { href: "/app",              label: "Overview",      icon: <HomeIcon /> },
  { href: "/app/transactions", label: "Transactions",  icon: <ListIcon /> },
  { href: "/app/statements",   label: "Statements",    icon: <TableIcon /> },
  { href: "/app/connect",      label: "Connect",       icon: <PlusIcon /> },
];

export function SidebarNav({ orgName, pendingCount }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      {/* Logo */}
      <div className="flex h-[52px] items-center gap-2.5 border-b border-zinc-800 px-4">
        <BookIcon />
        <span className="text-[14px] font-semibold tracking-tight text-zinc-100">Booked</span>
      </div>

      {/* Org */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {orgName}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {NAV.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <span className={`shrink-0 ${active ? "text-indigo-400" : "text-zinc-500"}`}>
                {icon}
              </span>
              <span className="flex-1">{label}</span>
              {label === "Transactions" && pendingCount > 0 && (
                <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-4 py-3">
        <Link
          href="/login"
          className="text-[11px] text-zinc-600 hover:text-zinc-400"
        >
          Sign out
        </Link>
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5.5L7 1l6 4.5V13H9V9H5v4H1V5.5z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="4" x2="11" y2="4" />
      <line x1="3" y1="7" x2="11" y2="7" />
      <line x1="3" y1="10" x2="11" y2="10" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="12" height="12" rx="1.5" />
      <line x1="1" y1="5" x2="13" y2="5" />
      <line x1="7" y1="5" x2="7" y2="13" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="6" />
      <line x1="7" y1="4" x2="7" y2="10" />
      <line x1="4" y1="7" x2="10" y2="7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
      <path d="M3 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3V3z" />
      <path d="M12 5h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2" />
      <line x1="6" y1="7" x2="9" y2="7" />
      <line x1="6" y1="10" x2="9" y2="10" />
    </svg>
  );
}
