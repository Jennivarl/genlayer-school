"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";

type RegionalTrack = {
  slug: string;
  regionName: string;
  languageName: string;
  lessons: Array<{ slug: string }>;
  quiz: { slug: string };
};

type LearnerProgress = {
  completedLessons: string[];
  quizAttempts: Array<{ quizSlug: string; passed: boolean }>;
};

const regionMeta: Record<string, { code: string; color: string }> = {
  china:      { code: "cn",    color: "#ef4444" },
  india:      { code: "in",    color: "#f97316" },
  indonesia:  { code: "id",    color: "#f59e0b" },
  latam:      { code: "latam", color: "#84cc16" },
  "latam-es": { code: "mx",    color: "#84cc16" },
  "latam-pt": { code: "br",    color: "#22d3ee" },
  nigeria:    { code: "ng",    color: "#22c55e" },
  russia:     { code: "ru",    color: "#06b6d4" },
  korea:      { code: "kr",    color: "#3b82f6" },
  turkey:     { code: "tr",    color: "#8b5cf6" },
  ukraine:    { code: "ua",    color: "#a855f7" },
  vietnam:    { code: "vn",    color: "#ec4899" },
  germany:    { code: "de",    color: "#4f46e5" },
  japan:      { code: "jp",    color: "#f43f5e" },
  arabic:     { code: "sa",    color: "#0d9488" },
  persian:    { code: "ir",    color: "#0369a1" },
};

function getTrackProgress(track: RegionalTrack, progress: LearnerProgress): number {
  const totalItems = track.lessons.length + 1;
  const doneLessons = track.lessons.filter((l) =>
    progress.completedLessons.includes(`${track.slug}/${l.slug}`)
  ).length;
  const quizPassed = progress.quizAttempts.some((a) => a.quizSlug === track.quiz.slug && a.passed) ? 1 : 0;
  return Math.round(((doneLessons + quizPassed) / totalItems) * 100);
}

export default function RegionsPage() {
  const auth = useAuth();
  const [tracks, setTracks] = useState<RegionalTrack[]>([]);
  const [progress, setProgress] = useState<LearnerProgress>({ completedLessons: [], quizAttempts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ learnerId: auth.learnerId });
    Promise.all([
      fetch("/api/catalog").then((r) => r.json()),
      auth.authFetch(`/api/progress?${params}`).then((r) => r.json()),
    ])
      .then(([catalog, progressData]) => {
        setTracks(catalog.regionalTracks ?? []);
        setProgress(progressData.progress ?? { completedLessons: [], quizAttempts: [] });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.learnerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            Choose Your Region
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your region to start learning GenLayer in your native language
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-purple-50 animate-pulse border border-purple-100" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => {
              const meta = regionMeta[track.slug] ?? { code: "", color: "#7c3aed" };
              const pct = getTrackProgress(track, progress);
              return (
                <motion.div
                  key={track.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/regions/${track.slug}`}>
                    <div className="group p-6 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-24 h-14 rounded-2xl overflow-hidden shadow-md group-hover:scale-110 transition-transform"
                            style={{ border: `2px solid ${meta.color}` }}
                          >
                            {meta.code === "latam" ? (
                              <div className="w-full h-full grid grid-cols-3 grid-rows-2">
                                {["br","mx","ar","co","ve","cl"].map((c) => (
                                  <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                                ))}
                              </div>
                            ) : track.slug === "latam-es" ? (
                              <img src="https://flagcdn.com/w160/ar.png" alt="Argentina" className="w-full h-full object-cover" />
                            ) : track.slug === "latam-pt" ? (
                              <img src="https://flagcdn.com/w160/br.png" alt="Brazil" className="w-full h-full object-cover" />
                            ) : meta.code ? (
                              <img src={`https://flagcdn.com/w160/${meta.code}.png`} alt={track.regionName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: `${meta.color}20` }}>🌍</div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{track.regionName}</h3>
                            <p className="text-sm text-muted-foreground">{track.languageName}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold" style={{ color: meta.color }}>{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}dd)` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-purple-100">
                        <div
                          className="w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm"
                          style={{
                            background: pct > 0
                              ? `linear-gradient(90deg, ${meta.color}15, ${meta.color}25)`
                              : "linear-gradient(90deg, #7c3aed15, #7c3aed25)",
                            color: pct > 0 ? meta.color : "#7c3aed",
                          }}
                        >
                          {pct >= 100 ? "View Certificate" : pct > 0 ? "Continue" : "Start"} Track
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
