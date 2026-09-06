import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Booked — autonomous bookkeeping",
  description:
    "Connect your bank and Stripe. Booked categorises every transaction, reconciles Stripe payouts, and produces monthly financial statements. Built to replace Bench.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
