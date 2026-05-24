"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Rss } from "lucide-react";
import { useState } from "react";

type LinkKind = "Blog" | "GitHub" | "Discord" | "X" | "Docs";

type NewsItem = {
  kind: LinkKind;
  title: string;
  description: string;
  date: string;
  url: string;
};

// ── Edit this array to update the page ──────────────────────────────────────
const newsItems: NewsItem[] = [
  {
    kind: "Blog",
    title: "Introducing GenLayer: The First AI-Native Blockchain",
    description: "An overview of what GenLayer is, how Intelligent Contracts work, and why AI belongs on-chain.",
    date: "May 2026",
    url: "https://genlayer.com/blog",
  },
  {
    kind: "GitHub",
    title: "GenLayer Studio v0.x Released",
    description: "New release of the GenLayer Studio IDE with improved contract debugging and one-click deploy.",
    date: "May 2026",
    url: "https://github.com/genlayer",
  },
  {
    kind: "Discord",
    title: "Community AMA — Ask the Core Team Anything",
    description: "Monthly open Q&A session with the GenLayer core team. Drop your questions in #ama.",
    date: "May 2026",
    url: "https://discord.gg/genlayer",
  },
  {
    kind: "X",
    title: "GenLayer Testnet Milestone: 10k Transactions",
    description: "The testnet just crossed 10,000 transactions. Here's what that means for mainnet readiness.",
    date: "May 2026",
    url: "https://x.com/GenLayerHQ",
  },
  {
    kind: "Docs",
    title: "New Guide: Writing Your First Intelligent Contract",
    description: "Step-by-step tutorial covering storage types, LLM calls, and deploying to the studio.",
    date: "Apr 2026",
    url: "https://docs.genlayer.com",
  },
  {
    kind: "Blog",
    title: "Optimistic Democracy Explained",
    description: "A deep dive into how GenLayer's validator consensus mechanism works and why it matters.",
    date: "Apr 2026",
    url: "https://genlayer.com/blog",
  },
];

// ── Community channels ───────────────────────────────────────────────────────
const channels = [
  { label: "Discord",  url: "https://discord.gg/genlayer",         emoji: "💬" },
  { label: "X",        url: "https://x.com/GenLayerHQ",            emoji: "𝕏"  },
  { label: "GitHub",   url: "https://github.com/genlayer",         emoji: "🐙" },
  { label: "Docs",     url: "https://docs.genlayer.com",           emoji: "📚" },
];
// ────────────────────────────────────────────────────────────────────────────

const kindColor: Record<LinkKind, string> = {
  Blog:    "bg-purple-100 text-purple-700",
  GitHub:  "bg-gray-100   text-gray-700",
  Discord: "bg-indigo-100 text-indigo-700",
  X:       "bg-sky-100    text-sky-700",
  Docs:    "bg-emerald-100 text-emerald-700",
};

const ALL = "All" as const;
type Filter = LinkKind | typeof ALL;
const filters: Filter[] = [ALL, "Blog", "GitHub", "Discord", "X", "Docs"];

export default function CommunitySpotlightPage() {
  const [active, setActive] = useState<Filter>(ALL);

  const visible = active === ALL ? newsItems : newsItems.filter((n) => n.kind === active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
            <Rss className="w-4 h-4" />
            GenLayer Ecosystem
          </div>
          <h1 className="text-5xl font-bold text-black mb-4">Community Spotlight</h1>
          <p className="text-xl text-muted-foreground">
            Latest news, releases, and updates from the GenLayer ecosystem
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                active === f
                  ? "bg-purple-600 text-white shadow"
                  : "bg-white border border-purple-100 text-muted-foreground hover:border-purple-300 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* News cards */}
        <div className="space-y-4 mb-12">
          {visible.map((item, i) => (
            <motion.a
              key={`${item.kind}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="group flex items-start gap-5 p-5 bg-white rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all block"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${kindColor[item.kind]}`}>
                    {item.kind}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="font-semibold text-base mb-1 group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 flex-shrink-0 mt-1 transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Community channels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-2">Join the Conversation</h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">
            Connect with the GenLayer community, ask questions, and stay up to date.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {channels.map((ch) => (
              <a
                key={ch.label}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-purple-700 font-semibold hover:bg-purple-50 transition-all text-sm"
              >
                <span>{ch.emoji}</span>
                {ch.label}
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
