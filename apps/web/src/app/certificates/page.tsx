"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle, Lock, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";

type CertificateEligibility = { certificateSlug: string; eligible: boolean };

const regions = [
  { slug: "nigeria",   name: "Nigeria",   language: "Pidgin",              flag: "ng",    color: "#22c55e" },
  { slug: "china",     name: "China",     language: "Chinese",             flag: "cn",    color: "#ef4444" },
  { slug: "india",     name: "India",     language: "Hindi",               flag: "in",    color: "#f97316" },
  { slug: "indonesia", name: "Indonesia", language: "Indonesian",          flag: "id",    color: "#f59e0b" },
  { slug: "latam",     name: "LATAM",     language: "Español + Português", flag: "latam", color: "#84cc16" },
  { slug: "russia",    name: "Russia",    language: "Russian",             flag: "ru",    color: "#06b6d4" },
  { slug: "korea",     name: "Korea",     language: "Korean",              flag: "kr",    color: "#3b82f6" },
  { slug: "turkey",    name: "Turkey",    language: "Turkish",             flag: "tr",    color: "#8b5cf6" },
  { slug: "ukraine",   name: "Ukraine",   language: "Ukrainian",           flag: "ua",    color: "#a855f7" },
  { slug: "vietnam",   name: "Vietnam",   language: "Vietnamese",          flag: "vn",    color: "#ec4899" },
  { slug: "germany",   name: "Germany",   language: "German",              flag: "de",    color: "#4f46e5" },
  { slug: "japan",     name: "Japan",     language: "Japanese",            flag: "jp",    color: "#f43f5e" },
  { slug: "arabic",    name: "Arabic",    language: "Arabic (MSA)",        flag: "sa",    color: "#0d9488" },
  { slug: "persian",   name: "Persian",   language: "Persian (Farsi)",     flag: "ir",    color: "#0369a1" },
];

export default function CertificatesPage() {
  const auth = useAuth();
  const [eligibility, setEligibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = new URLSearchParams({ learnerId: auth.learnerId });
    auth.authFetch(`/api/progress?${p}`)
      .then((r) => r.json())
      .then((d) => {
        const certs: CertificateEligibility[] = d.certificates ?? [];
        const map: Record<string, boolean> = {};
        for (const cert of certs) {
          const slug = cert.certificateSlug.replace("-regional-certificate", "");
          map[slug] = cert.eligible;
        }
        setEligibility(map);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.learnerId]);

  const earnedCount = Object.values(eligibility).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-3">
            Certificates
          </h1>
          <p className="text-muted-foreground mb-4">Complete regional courses to earn your certificates</p>
          {!loading && earnedCount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              <Award className="w-5 h-5" />
              {earnedCount} certificate{earnedCount > 1 ? "s" : ""} earned
            </div>
          )}
        </motion.div>

        {/* Collage preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/certificates/collage-certificates.png.jpg"
            alt="GenLayer Regional Certificates"
            className="w-full rounded-2xl shadow-xl border border-purple-100"
          />
        </motion.div>

        {/* Per-region grid */}
        <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region, i) => {
            const eligible = eligibility[region.slug] ?? false;
            return (
              <motion.div
                key={region.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Link href={`/regions/${region.slug}/certificate`}>
                  <div
                    className={`p-5 rounded-xl bg-white border-2 hover:shadow-lg transition-all ${
                      eligible
                        ? "border-green-200 hover:border-green-400"
                        : "border-purple-100 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-9 rounded overflow-hidden flex-shrink-0"
                        style={{ border: `2px solid ${region.color}` }}
                      >
                        {region.flag === "latam" ? (
                          <div className="w-full h-full grid grid-cols-3 grid-rows-2">
                            {["br", "mx", "ar", "co", "ve", "cl"].map((c) => (
                              <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                            ))}
                          </div>
                        ) : (
                          <img src={`https://flagcdn.com/w80/${region.flag}.png`} alt={region.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{region.name}</div>
                        <div className="text-xs text-muted-foreground">{region.language}</div>
                      </div>
                      {loading ? (
                        <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
                      ) : eligible ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                    </div>
                    {eligible && (
                      <div className="mt-3 text-xs font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-1.5 text-center">
                        Certificate Earned — Click to Download
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
