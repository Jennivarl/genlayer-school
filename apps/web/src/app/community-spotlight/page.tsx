"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Globe, BookOpen, ArrowRight, User } from "lucide-react";
import { useEffect, useState } from "react";

type CommunityMember = {
  displayName: string | null;
  regions: string[];
  lessonCount: number;
  quizzesPassed: number;
};

const regionMeta: Record<string, { code: string; label: string }> = {
  china:      { code: "cn",    label: "China" },
  india:      { code: "in",    label: "India" },
  indonesia:  { code: "id",    label: "Indonesia" },
  latam:      { code: "latam", label: "LATAM" },
  "latam-es": { code: "mx",    label: "LATAM (ES)" },
  "latam-pt": { code: "br",    label: "LATAM (PT)" },
  nigeria:    { code: "ng",    label: "Nigeria" },
  russia:     { code: "ru",    label: "Russia" },
  korea:      { code: "kr",    label: "Korea" },
  turkey:     { code: "tr",    label: "Turkey" },
  ukraine:    { code: "ua",    label: "Ukraine" },
  vietnam:    { code: "vn",    label: "Vietnam" },
};

function RegionFlag({ code, size = "sm" }: { code: string; size?: "sm" | "xs" }) {
  const dim = size === "sm" ? "w-12 h-8" : "w-8 h-5";
  if (code === "latam") {
    return (
      <div className={`${dim} rounded-md overflow-hidden grid grid-cols-3 grid-rows-2 flex-shrink-0`}>
        {["br","mx","ar","co","ve","cl"].map((c) => (
          <img key={c} src={`https://flagcdn.com/w40/${c}.png`} alt={c} className="w-full h-full object-cover" />
        ))}
      </div>
    );
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      className={`${dim} rounded-md object-cover flex-shrink-0`}
    />
  );
}

function medalColor(index: number) {
  if (index === 0) return "from-yellow-400 to-yellow-500";
  if (index === 1) return "from-gray-300 to-gray-400";
  if (index === 2) return "from-amber-600 to-amber-700";
  return "from-purple-500 to-purple-600";
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  );
}

export default function CommunitySpotlightPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/community/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const multiRegion = members.filter((m) => m.regions.length > 1);
  const singleRegion = members.filter((m) => m.regions.length === 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            Community Spotlight
          </h1>
          <p className="text-xl text-muted-foreground">
            Members learning GenLayer across regions of the world
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-10"
        >
          {[
            { icon: <User className="w-5 h-5" />, value: members.length, label: "Learners" },
            { icon: <BookOpen className="w-5 h-5" />, value: members.reduce((s, m) => s + m.lessonCount, 0), label: "Lessons Done" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 text-center">
              <div className="flex justify-center text-purple-600 mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Multi-region learners */}
        {multiRegion.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold">Multi-Region Learners</h2>
            </div>
            <div className="space-y-3">
              {multiRegion.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.06 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${medalColor(index)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1 truncate">
                      {member.displayName ?? "Anonymous Learner"}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.regions.map((slug) => {
                        const meta = regionMeta[slug];
                        return meta ? (
                          <span key={slug} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-xs text-purple-700">
                            <RegionFlag code={meta.code} size="xs" />
                            {meta.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-end">
                      <BookOpen className="w-3.5 h-3.5" />
                      {member.lessonCount} lesson{member.lessonCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Single-region learners */}
        {singleRegion.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold">Active Learners</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {singleRegion.map((member, index) => {
                const meta = regionMeta[member.regions[0]];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.04 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-purple-100"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {meta ? <RegionFlag code={meta.code} size="sm" /> : <div className="w-8 h-8 rounded-md bg-purple-100 flex-shrink-0" />}
                      <div className="font-semibold text-sm truncate">
                        {member.displayName ?? "Anonymous Learner"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {meta?.label} · {member.lessonCount} lesson{member.lessonCount !== 1 ? "s" : ""}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {members.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 text-purple-200" />
            <p className="text-lg">No learners yet — be the first to complete a lesson!</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Complete lessons across regions and climb the leaderboard. Every region you learn in is a flag on your profile.
          </p>
          <Link
            href="/regions"
            className="px-8 py-4 rounded-lg bg-white text-purple-600 font-semibold hover:bg-purple-50 transition-all inline-flex items-center justify-center gap-2"
          >
            Explore Regions
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
