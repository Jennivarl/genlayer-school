"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Award, BookOpen, TrendingUp, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";

type RegionalTrack = {
  slug: string;
  regionName: string;
  lessons: Array<{ slug: string }>;
  quiz: { slug: string };
};

type LearnerProgress = {
  completedLessons: string[];
  quizAttempts: Array<{ quizSlug: string; passed: boolean }>;
  issuedCertificates: string[];
};

type ProgressSummary = {
  completedLessonCount: number;
  lessonTotal: number;
  passedQuizCount: number;
  quizAttemptCount: number;
};

type CertificateEligibility = {
  certificateSlug: string;
  eligible: boolean;
};

type ProgressData = {
  progress: LearnerProgress;
  summary: ProgressSummary;
  certificates: CertificateEligibility[];
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

async function fetchCatalog() {
  const CACHE_KEY = "genlayer_catalog_v1";
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}
  const data = await fetch("/api/catalog").then((r) => r.json());
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
  return data;
}

function getTrackProgress(track: RegionalTrack, progress: LearnerProgress): number {
  const totalItems = track.lessons.length + 1;
  const doneLessons = track.lessons.filter((l) =>
    progress.completedLessons.includes(`${track.slug}/${l.slug}`)
  ).length;
  const quizPassed = progress.quizAttempts.some((a) => a.quizSlug === track.quiz.slug && a.passed) ? 1 : 0;
  return Math.round(((doneLessons + quizPassed) / totalItems) * 100);
}

export default function DashboardPage() {
  const auth = useAuth();
  const [tracks, setTracks] = useState<RegionalTrack[]>([]);
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.ready) return;
    const params = new URLSearchParams({ learnerId: auth.learnerId });
    Promise.all([
      fetchCatalog(),
      auth.authFetch(`/api/progress?${params}`).then((r) => r.json()),
      auth.authFetch("/api/profile").then((r) => r.json()),
    ])
      .then(([catalog, progressData, profileData]) => {
        setTracks(catalog.regionalTracks ?? []);
        setData(progressData);
        const p = profileData.profile;
        if (p?.displayName) setDisplayName(p.displayName);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.ready, auth.learnerId]);

  const progress = data?.progress;
  const certificates = data?.certificates ?? [];
  const eligibleCerts = certificates.filter((c) => c.eligible && c.certificateSlug.includes("-regional-"));
  const exploredCount = progress
    ? new Set(progress.completedLessons.map((l) => l.split("/")[0]).filter(Boolean)).size
    : 0;

  const activeTracks = tracks
    .map((track) => ({
      track,
      pct: progress ? getTrackProgress(track, progress) : 0,
    }))
    .filter(({ pct }) => pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const topTrack = activeTracks[0];
  const topTrackLessonsDone = topTrack && progress
    ? topTrack.track.lessons.filter((l) =>
        progress.completedLessons.includes(`${topTrack.track.slug}/${l.slug}`)
      ).length
    : 0;
  const lessonsValue = loading
    ? "—"
    : topTrack
    ? `${topTrackLessonsDone} / ${topTrack.track.lessons.length}`
    : "—";

  const stats = [
    {
      label: "Lessons Done",
      value: lessonsValue,
      icon: BookOpen,
      color: "#7c3aed",
    },
    {
      label: "Certificates",
      value: loading ? "—" : String(eligibleCerts.length),
      icon: Award,
      color: "#f59e0b",
    },
    {
      label: "Regions Explored",
      value: loading ? "—" : String(exploredCount),
      icon: TrendingUp,
      color: "#ef4444",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Welcome back{auth.authenticated ? `, ${displayName ?? auth.label}` : ""}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s your learning progress</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <h2 className="text-2xl font-bold mb-6">Current Region Tracks</h2>
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-purple-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : activeTracks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven&apos;t started any regions yet.</p>
                <Link
                  href="/regions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
                >
                  Explore Regions
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {activeTracks.map(({ track, pct }, index) => {
                  const meta = regionMeta[track.slug] ?? { code: "", color: "#7c3aed" };
                  return (
                    <div key={track.slug} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-7 rounded overflow-hidden shadow-sm flex-shrink-0" style={{ border: `1.5px solid ${meta.color}` }}>
                            {meta.code === "latam" ? (
                              <div className="w-full h-full grid grid-cols-3 grid-rows-2">
                                {["br","mx","ar","co","ve","cl"].map((c) => (
                                  <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                                ))}
                              </div>
                            ) : meta.code ? (
                              <img src={`https://flagcdn.com/w80/${meta.code}.png`} alt={track.regionName} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <h3 className="font-semibold">{track.regionName}</h3>
                            <p className="text-sm text-muted-foreground">GenLayer Basics</p>
                          </div>
                        </div>
                        <span className="font-semibold" style={{ color: meta.color }}>{pct}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}dd)` }}
                        />
                      </div>
                      <Link
                        href={pct >= 100 ? `/regions/${track.slug}/certificate` : `/regions/${track.slug}`}
                        className="inline-flex items-center text-sm font-medium hover:underline"
                        style={{ color: meta.color }}
                      >
                        {pct >= 100 ? "View Certificate" : "Continue Learning"} →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-amber-500" />
                <h3 className="text-xl font-semibold">Community Spotlight</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                See who is learning GenLayer across multiple regions
              </p>
              <Link
                href="/community-spotlight"
                className="inline-block w-full py-3 px-4 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 transition-all text-center"
              >
                View Leaderboard
              </Link>
            </motion.div>
          </div>
        </div>

        {eligibleCerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <h2 className="text-2xl font-bold mb-6">Certificates Earned</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {eligibleCerts.map((cert) => {
                const slug = cert.certificateSlug.replace("-regional-certificate", "");
                const meta = regionMeta[slug] ?? { code: "", color: "#7c3aed" };
                const track = tracks.find((t) => t.slug === slug);
                return (
                  <Link
                    key={cert.certificateSlug}
                    href={`/regions/${slug}/certificate`}
                    className="group p-6 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-24 h-14 rounded-xl overflow-hidden group-hover:scale-110 transition-transform flex-shrink-0" style={{ border: `2px solid ${meta.color}` }}>
                        {meta.code === "latam" ? (
                          <div className="w-full h-full grid grid-cols-3 grid-rows-2">
                            {["br","mx","ar","co","ve","cl"].map((c) => (
                              <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                            ))}
                          </div>
                        ) : meta.code ? (
                          <img src={`https://flagcdn.com/w160/${meta.code}.png`} alt={slug} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <Award className="w-8 h-8" style={{ color: meta.color }} />
                    </div>
                    <h3 className="font-semibold mb-1">GenLayer Basics</h3>
                    <p className="text-sm text-muted-foreground mb-3">{track?.regionName ?? slug}</p>
                    <span className="text-sm font-medium" style={{ color: meta.color }}>
                      View Certificate →
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
