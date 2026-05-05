import type { Metadata } from "next";
import Link from "next/link";
import { AppProviders } from "@/components/app-providers";
import { AuthStatus } from "@/components/auth-status";
import "./globals.css";

const navItems = [
  { href: "/learn", label: "Learn" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/certificates", label: "Certificates" },
  { href: "/community-spotlight", label: "Community Spotlight" },
  { href: "/gen-fren-weekly", label: "Gen-Fren Weekly" },
  { href: "/resources", label: "Resources" },
  { href: "/backend", label: "Backend" },
];

export const metadata: Metadata = {
  title: "GenLayer School",
  description: "Community education platform for GenLayer learners and builders.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="GenLayer School home">
            <span className="brand-mark">GL</span>
            <span>GenLayer School</span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
          <AuthStatus />
        </header>
        <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}

