import Link from "next/link";
import { redirect } from "next/navigation";
import { userIdFromSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await userIdFromSession();
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
          <Link href="/app" className="text-sm font-semibold tracking-tight text-neutral-900">
            Booked
          </Link>
          <div className="flex items-center gap-1">
            <NavLink href="/app">Overview</NavLink>
            <NavLink href="/app/transactions">Transactions</NavLink>
            <NavLink href="/app/statements">Statements</NavLink>
            <NavLink href="/app/connect">Connect</NavLink>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
    >
      {children}
    </Link>
  );
}
