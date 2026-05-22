import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GenLayer Regional School",
  description: "Learn GenLayer in your language. Earn certificates. Join the global ecosystem.",
  metadataBase: new URL("https://gen-school.fun"),
  openGraph: {
    title: "GenLayer Regional School",
    description: "Learn GenLayer in your language. Earn certificates. Join the global ecosystem.",
    url: "https://gen-school.fun",
    siteName: "GenLayer Regional School",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenLayer Regional School",
    description: "Learn GenLayer in your language. Earn certificates. Join the global ecosystem.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={syne.variable}>
      <body className={syne.className}>
        <AppProviders>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
