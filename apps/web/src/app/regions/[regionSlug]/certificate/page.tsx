"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Download, Share2, Award, CheckCircle, AlertCircle } from "lucide-react";
import { GenLayerLogo } from "@/components/genlayer-logo";
import { useAuth } from "@/components/app-providers";
import { useEffect, useState } from "react";

const regionMeta: Record<string, { name: string; code: string; language: string; color: string }> = {
  nigeria:    { name: "Nigeria",   code: "ng",    language: "Pidgin",    color: "#22c55e" },
  china:      { name: "China",     code: "cn",    language: "Chinese",   color: "#ef4444" },
  latam:      { name: "LATAM",     code: "latam", language: "Español + Português", color: "#84cc16" },
  "latam-es": { name: "LATAM",     code: "mx",    language: "Español",   color: "#84cc16" },
  "latam-pt": { name: "LATAM",     code: "br",    language: "Português", color: "#22d3ee" },
  india:      { name: "India",     code: "in",    language: "Hindi",     color: "#f97316" },
  indonesia:  { name: "Indonesia", code: "id",    language: "Indonesian",color: "#f59e0b" },
  russia:     { name: "Russia",    code: "ru",    language: "Russian",   color: "#06b6d4" },
  korea:      { name: "Korea",     code: "kr",    language: "Korean",    color: "#3b82f6" },
  turkey:     { name: "Turkey",    code: "tr",    language: "Turkish",   color: "#8b5cf6" },
  ukraine:    { name: "Ukraine",   code: "ua",    language: "Ukrainian", color: "#a855f7" },
  vietnam:    { name: "Vietnam",   code: "vn",    language: "Vietnamese",color: "#ec4899" },
};

type QuizAttempt = { quizSlug: string; passed: boolean; percent: number; submittedAt: string };
type CertificateEligibility = { certificateSlug: string; eligible: boolean };

export default function CertificatePage() {
  const params = useParams<{ regionSlug: string }>();
  const regionSlug = params.regionSlug ?? "nigeria";
  const auth = useAuth();
  const data = regionMeta[regionSlug] ?? regionMeta.nigeria;

  const [eligible, setEligible] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ learnerId: auth.learnerId });
    auth.authFetch(`/api/progress?${params}`)
      .then((r) => r.json())
      .then((d) => {
        const certs: CertificateEligibility[] = d.certificates ?? [];
        const certSlug = `${regionSlug}-regional-certificate`;
        const cert = certs.find((c) => c.certificateSlug === certSlug);
        setEligible(cert?.eligible ?? false);

        const quizSlug = `${regionSlug}-genlayer-basics-quiz`;
        const attempts: QuizAttempt[] = d.progress?.quizAttempts ?? [];
        const passing = attempts.filter((a) => a.quizSlug === quizSlug && a.passed);
        if (passing.length > 0) {
          setBestScore(Math.max(...passing.map((a) => a.percent)));
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.learnerId, regionSlug]);

  const username = auth.authenticated ? auth.label : "Student";
  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          {loading ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold mb-4">
              Checking eligibility…
            </div>
          ) : eligible ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-4">
              <CheckCircle className="w-5 h-5" />
              Certificate Earned
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold mb-4">
              <AlertCircle className="w-5 h-5" />
              Not Yet Eligible
            </div>
          )}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
            {eligible ? "Congratulations!" : "Your Certificate Preview"}
          </h1>
          <p className="text-muted-foreground">
            {eligible
              ? "You've completed the GenLayer Basics course"
              : "Complete all lessons and pass the quiz to earn this certificate"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`bg-white rounded-2xl p-12 shadow-2xl border-2 mb-8 ${eligible ? "border-purple-100" : "border-dashed border-gray-200"}`}
        >
          <div className={`relative aspect-[1.414/1] bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-xl border-4 p-8 md:p-12 overflow-hidden ${eligible ? "border-purple-600" : "border-gray-300"}`}>
            {!eligible && (
              <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-xl">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-amber-200">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <p className="font-semibold text-amber-700 mb-1">Not yet eligible</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete all lessons and pass the quiz
                  </p>
                  <Link
                    href={`/regions/${regionSlug}`}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            )}

            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center p-2">
                  <GenLayerLogo size={48} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-xl">GenLayer Regional School</div>
                  <div className="text-sm text-muted-foreground">Certificate of Completion</div>
                </div>
              </div>

              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

              <div>
                <div className="text-sm text-muted-foreground mb-2">This certifies that</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
                  {username}
                </div>
              </div>

              <div className="max-w-md">
                <div className="text-sm text-muted-foreground mb-2">has successfully completed</div>
                <div className="text-xl md:text-2xl font-semibold mb-4">GenLayer Basics: {data.name}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${data.color}` }}>
                  {data.code === "latam" ? (
                    <div className="w-full h-full grid grid-cols-3 grid-rows-2">
                      {["br","mx","ar","co","ve","cl"].map((c) => (
                        <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                      ))}
                    </div>
                  ) : (
                    <img src={`https://flagcdn.com/w80/${data.code}.png`} alt={data.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Region</div>
                  <div className="font-semibold">{data.name}</div>
                  <div className="text-xs text-muted-foreground">{data.language}</div>
                </div>
              </div>

              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

              <div className="flex items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Completion Date</div>
                  <div className="font-semibold">{completionDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Score</div>
                  <div className="font-semibold text-green-600">
                    {bestScore !== null ? `${bestScore}%` : "—"}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4">
                <Award className="w-8 h-8 text-purple-200" />
              </div>
              <div className="absolute top-4 right-4">
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
            disabled={!eligible}
            className={`px-8 py-4 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
              eligible
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 hover:shadow-xl"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>
          <button
            disabled={!eligible}
            className={`px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              eligible
                ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Share2 className="w-5 h-5" />
            Share Achievement
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 border border-purple-100"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">What&apos;s Next?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/regions" className="p-6 rounded-xl bg-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-semibold mb-2">Explore More Regions</h3>
              <p className="text-sm text-muted-foreground">Learn GenLayer in other languages</p>
            </Link>
            <Link href="/community-spotlight" className="p-6 rounded-xl bg-purple-50 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-center">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold mb-2">Community Spotlight</h3>
              <p className="text-sm text-muted-foreground">See featured community members</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
