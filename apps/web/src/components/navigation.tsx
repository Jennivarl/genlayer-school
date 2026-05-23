"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { GenLayerLogo } from "@/components/genlayer-logo";
import { useAuth } from "@/components/app-providers";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/regions", label: "Regions" },
  { href: "/community-spotlight", label: "Spotlight" },
];

function Avatar({ size = "sm", pfpUrl }: { size?: "sm" | "md"; pfpUrl: string | null }) {
  const dim = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  if (pfpUrl) {
    return (
      <img
        src={pfpUrl}
        alt="Profile"
        className={`${dim} rounded-full object-cover flex-shrink-0 ring-1 ring-white/40`}
      />
    );
  }
  return <User className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} shrink-0`} />;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();

  const [pfpUrl, setPfpUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPfpUrl(null);
      return;
    }
    try {
      const stored = localStorage.getItem(`genlayer_pfp_${auth.learnerId}`);
      if (stored) setPfpUrl(stored);
    } catch {}
  }, [auth.authenticated, auth.learnerId]);

  const label = auth.displayName ?? auth.label;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <GenLayerLogo size={32} />
            <span className="font-semibold text-lg hidden sm:inline">GenLayer Regional School</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors text-sm ${
                  isActive(link.href)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {auth.authenticated ? (
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all text-sm max-w-[180px]"
              >
                <Avatar size="sm" pfpUrl={pfpUrl} />
                <span className="truncate">{label}</span>
              </Link>
            ) : (
              <button
                onClick={auth.login}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all text-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-purple-50 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {auth.authenticated ? (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white justify-center"
              >
                <Avatar size="md" pfpUrl={pfpUrl} />
                <span className="truncate">{label}</span>
              </Link>
            ) : (
              <button
                onClick={() => { setIsOpen(false); auth.login(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white justify-center w-full"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
