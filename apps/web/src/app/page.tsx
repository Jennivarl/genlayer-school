"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, Award, Globe } from "lucide-react";

type Region = { name: string; code: string; color: string; labelColor?: string };

const regions: Region[] = [
  { name: "China",     code: "cn",    color: "#ef4444" },
  { name: "India",     code: "in",    color: "#f97316" },
  { name: "Indonesia", code: "id",    color: "#f59e0b" },
  { name: "LATAM",     code: "latam", color: "#84cc16" },
  { name: "Nigeria",   code: "ng",    color: "#22c55e" },
  { name: "Russia",    code: "ru",    color: "#06b6d4" },
  { name: "Korea",     code: "kr",    color: "#3b82f6", labelColor: "#7dd3fc" },
  { name: "Turkey",    code: "tr",    color: "#8b5cf6", labelColor: "#ffffff" },
  { name: "Ukraine",   code: "ua",    color: "#a855f7", labelColor: "#fde047" },
  { name: "Vietnam",   code: "vn",    color: "#ec4899", labelColor: "#b91c1c" },
  { name: "Germany",   code: "de",    color: "#4f46e5" },
  { name: "Japan",     code: "jp",    color: "#f43f5e" },
  { name: "Arabic",    code: "sa",    color: "#0d9488" },
  { name: "Persian",   code: "ir",    color: "#0369a1" },
  { name: "Bengal",    code: "bd",    color: "#10b981" },
];

export default function HomePage() {
  return (
    <div style={{ background: "linear-gradient(to bottom, #9333ea 0%, #a855f7 20%, #c084fc 42%, #d8b4fe 60%, #ede9fe 78%, #f5f3ff 90%, #ffffff 100%)" }}>
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden flex items-center">

        {/* Content grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — text on purple */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  Learn GenLayer
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  in Your Language
                </h1>
              </div>
              <p className="text-base md:text-lg text-white/75 font-medium max-w-sm leading-relaxed">
                Explore GenLayer with regional lessons, quizzes &amp; certificates.
              </p>
              <Link
                href="/profile"
                className="inline-block px-10 py-4 rounded-full text-black font-semibold text-lg transition-all hover:scale-105 bg-white"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
              >
                Start Now
              </Link>
            </motion.div>

            {/* RIGHT — floating flags on white area */}
            <div className="relative h-[480px]">
              <FloatingFlags regions={regions} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 10 REGIONAL TRACKS ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            15 Regional Tracks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {regions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                {region.code === "latam" ? (
                  <div className="w-10 h-7 grid grid-cols-3 grid-rows-2 overflow-hidden rounded shadow group-hover:scale-110 transition-transform">
                    {["br", "mx", "ar", "co", "pe", "cl"].map((c) => (
                      <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                    ))}
                  </div>
                ) : (
                  <img src={`https://flagcdn.com/w80/${region.code}.png`} alt={region.name} className="w-10 h-7 object-cover rounded shadow group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-medium text-center">{region.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<BookOpen className="w-8 h-8" />} title="Regional Lessons" description="Learn GenLayer in your native language with culturally relevant examples" />
            <FeatureCard icon={<Globe className="w-8 h-8" />} title="Interactive Quizzes" description="Test your knowledge and track your progress across all modules" />
            <FeatureCard icon={<Award className="w-8 h-8" />} title="Certificates" description="Download personalized certificates in your regional language" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Join the Global GenLayer Community
          </h2>
          <p className="text-xl text-muted-foreground">Start learning today and earn your certificate</p>
          <Link
            href="/regions"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #7e22ce, #9333ea)" }}
          >
            Start Now
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── Floating Flags ── */
const flagLayout = [
  // Row 1 — 4 flags across
  { top: "3%",  left: "2%",  rotate: -7, amp:  9, dur: 3.8, delay: 0.0 },
  { top: "5%",  left: "26%", rotate:  5, amp:  8, dur: 4.2, delay: 0.5 },
  { top: "2%",  left: "51%", rotate: -3, amp: 10, dur: 3.5, delay: 1.0 },
  { top: "4%",  left: "74%", rotate:  8, amp:  9, dur: 4.6, delay: 0.3 },
  // Row 2 — 3 flags staggered
  { top: "27%", left: "14%", rotate: -5, amp: 10, dur: 4.0, delay: 0.8 },
  { top: "25%", left: "40%", rotate:  4, amp:  8, dur: 3.7, delay: 1.3 },
  { top: "28%", left: "66%", rotate: -6, amp: 10, dur: 4.3, delay: 0.2 },
  // Row 3 — 4 flags across
  { top: "50%", left: "2%",  rotate:  7, amp:  9, dur: 3.9, delay: 0.9 },
  { top: "52%", left: "26%", rotate: -4, amp: 10, dur: 4.1, delay: 1.1 },
  { top: "50%", left: "51%", rotate:  6, amp:  8, dur: 3.6, delay: 0.6 },
  { top: "53%", left: "74%", rotate:  4, amp:  9, dur: 4.4, delay: 1.2 },
  // Row 4 — 3 flags staggered
  { top: "75%", left: "14%", rotate: -5, amp: 10, dur: 4.0, delay: 0.4 },
  { top: "76%", left: "42%", rotate:  5, amp:  8, dur: 4.5, delay: 1.4 },
  { top: "75%", left: "68%", rotate: -3, amp:  9, dur: 4.1, delay: 0.7 },
];

function FloatingFlags({ regions }: { regions: Region[] }) {
  return (
    <div className="relative w-full h-full">
      {regions.map((region, i) => {
        const pos = flagLayout[i];
        return (
          <div
            key={region.name}
            className="absolute"
            style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotate}deg)` }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -pos.amp, 0] }}
              transition={{
                opacity: { delay: i * 0.08, duration: 0.5 },
                scale:   { delay: i * 0.08, duration: 0.5 },
                y: { delay: pos.delay, duration: pos.dur, repeat: Infinity, ease: "easeInOut" },
              }}
              className="group cursor-pointer"
            >
              <div
                className="rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300"
                style={{ border: `2px solid ${region.color}60` }}
              >
                {region.code === "latam" ? (
                  <div className="w-24 h-16 grid grid-cols-3 grid-rows-2 overflow-hidden">
                    {["br", "mx", "ar", "co", "pe", "cl"].map((c) => (
                      <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                    ))}
                  </div>
                ) : (
                  <img
                    src={`https://flagcdn.com/w160/${region.code}.png`}
                    alt={region.name}
                    className="w-24 h-16 object-cover block"
                  />
                )}
              </div>
              <p className="mt-1.5 text-center text-xs font-bold" style={{ color: region.labelColor ?? region.color }}>
                {region.name}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-8 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all"
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6"
        style={{ background: "linear-gradient(135deg, #7e22ce, #9333ea)" }}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
