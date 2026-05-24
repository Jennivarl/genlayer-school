"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, CheckCircle, Award, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/app-providers";

type Lesson = { slug: string; title: string; durationMinutes: number; summary: string; objectives: string[] };
type RegionalTrack = {
  slug: string;
  regionName: string;
  nativeRegionName: string;
  languageName: string;
  nativeLanguageName: string;
  title: string;
  description: string;
  unityMessage: string;
  certificateTitle: string;
  lessons: Lesson[];
  quiz: { slug: string; title: string; passPercent: number };
};

type LearnerProgress = {
  completedLessons: string[];
  quizAttempts: Array<{ quizSlug: string; passed: boolean }>;
};

type CertificateEligibility = { certificateSlug: string; eligible: boolean };

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

type TrackUI = {
  preview: string; complete: string; earned: string; download: string; viewReq: string;
  objectives: string; requirements: string; lessons: string; lessonPrefix: string;
  completed: string; readyToStart: string; back: string; courseProgress: string;
};

const defaultUI: TrackUI = {
  preview: "Certificate Preview", complete: "Complete the course to earn your certificate",
  earned: "Certificate Earned!", download: "View Certificate", viewReq: "See Requirements",
  objectives: "Learning Objectives", requirements: "Requirements", lessons: "Lessons",
  lessonPrefix: "Lesson", completed: "Completed", readyToStart: "min · Ready to start",
  back: "← Back to Regions", courseProgress: "Course Progress",
};

const ui18n: Record<string, TrackUI> = {
  china:      { preview: "证书预览", complete: "完成课程以获得证书", earned: "已获得证书！", download: "下载证书", viewReq: "查看证书要求", objectives: "学习目标", requirements: "要求", lessons: "课程", lessonPrefix: "课程", completed: "已完成", readyToStart: "分钟 · 准备开始", back: "← 返回地区", courseProgress: "课程进度" },
  india:      { preview: "Pramanpatra Preview", complete: "Course poora karein pramanpatra paane ke liye", earned: "Pramanpatra mil gaya!", download: "Pramanpatra dekhein", viewReq: "Zarooriyaat dekhein", objectives: "Seekhne ke Lakshya", requirements: "Zarooriyaat", lessons: "Sabaq", lessonPrefix: "Sabaq", completed: "Poora hua", readyToStart: "min · Shuru karne ke liye taiyaar", back: "← Regions par wapas", courseProgress: "Course ki pragati" },
  indonesia:  { preview: "Pratinjau Sertifikat", complete: "Selesaikan kursus untuk mendapatkan sertifikat", earned: "Sertifikat Diraih!", download: "Lihat Sertifikat", viewReq: "Lihat Persyaratan", objectives: "Tujuan Belajar", requirements: "Persyaratan", lessons: "Pelajaran", lessonPrefix: "Pelajaran", completed: "Selesai", readyToStart: "mnt · Siap dimulai", back: "← Kembali ke Wilayah", courseProgress: "Kemajuan Kursus" },
  latam:      { preview: "Vista previa del certificado", complete: "Completa el curso para obtener tu certificado", earned: "¡Certificado obtenido!", download: "Ver Certificado", viewReq: "Ver requisitos", objectives: "Objetivos", requirements: "Requisitos", lessons: "Lecciones", lessonPrefix: "Lección", completed: "Completado", readyToStart: "min · Listo para comenzar", back: "← Volver a Regiones", courseProgress: "Progreso del curso" },
  "latam-es": { preview: "Vista previa del certificado", complete: "Completa el curso para obtener tu certificado", earned: "¡Certificado obtenido!", download: "Ver Certificado", viewReq: "Ver requisitos", objectives: "Objetivos", requirements: "Requisitos", lessons: "Lecciones", lessonPrefix: "Lección", completed: "Completado", readyToStart: "min · Listo para comenzar", back: "← Volver a Regiones", courseProgress: "Progreso del curso" },
  "latam-pt": { preview: "Pré-visualização do Certificado", complete: "Complete o curso para obter seu certificado", earned: "Certificado Conquistado!", download: "Ver Certificado", viewReq: "Ver requisitos", objectives: "Objetivos", requirements: "Requisitos", lessons: "Lições", lessonPrefix: "Lição", completed: "Concluído", readyToStart: "min · Pronto para começar", back: "← Voltar às Regiões", courseProgress: "Progresso do curso" },
  nigeria:    { preview: "Certificate Preview", complete: "Finish di course to get your certificate", earned: "Certificate Don Land!", download: "See Certificate", viewReq: "See Requirements", objectives: "Wetin You Go Learn", requirements: "Wetin You Need", lessons: "Lessons", lessonPrefix: "Lesson", completed: "Done", readyToStart: "min · Ready to go", back: "← Back to Regions", courseProgress: "How far for course" },
  russia:     { preview: "Просмотр сертификата", complete: "Завершите курс, чтобы получить сертификат", earned: "Сертификат получен!", download: "Посмотреть сертификат", viewReq: "Требования", objectives: "Цели обучения", requirements: "Требования", lessons: "Уроки", lessonPrefix: "Урок", completed: "Завершено", readyToStart: "мин · Готово к началу", back: "← Назад к регионам", courseProgress: "Прогресс курса" },
  korea:      { preview: "수료증 미리보기", complete: "수료증을 받으려면 코스를 완료하세요", earned: "수료증 획득!", download: "수료증 보기", viewReq: "요건 확인", objectives: "학습 목표", requirements: "수료 조건", lessons: "수업", lessonPrefix: "수업", completed: "완료", readyToStart: "분 · 시작 준비 완료", back: "← 지역으로 돌아가기", courseProgress: "강좌 진행도" },
  turkey:     { preview: "Sertifika Önizlemesi", complete: "Sertifikanı kazanmak için kursu tamamla", earned: "Sertifika Kazanıldı!", download: "Sertifikayı Gör", viewReq: "Gereksinimleri Gör", objectives: "Öğrenme Hedefleri", requirements: "Gereksinimler", lessons: "Dersler", lessonPrefix: "Ders", completed: "Tamamlandı", readyToStart: "dk · Başlamaya hazır", back: "← Bölgelere Dön", courseProgress: "Kurs İlerlemesi" },
  ukraine:    { preview: "Перегляд сертифіката", complete: "Завершіть курс, щоб отримати сертифікат", earned: "Сертифікат отримано!", download: "Переглянути сертифікат", viewReq: "Перегляд вимог", objectives: "Цілі навчання", requirements: "Вимоги", lessons: "Уроки", lessonPrefix: "Урок", completed: "Завершено", readyToStart: "хв · Готово до початку", back: "← Назад до регіонів", courseProgress: "Прогрес курсу" },
  vietnam:    { preview: "Xem trước chứng chỉ", complete: "Hoàn thành khóa học để nhận chứng chỉ", earned: "Đã nhận chứng chỉ!", download: "Xem chứng chỉ", viewReq: "Xem yêu cầu", objectives: "Mục tiêu học tập", requirements: "Yêu cầu", lessons: "Bài học", lessonPrefix: "Bài học", completed: "Đã hoàn thành", readyToStart: "phút · Sẵn sàng bắt đầu", back: "← Trở về Khu vực", courseProgress: "Tiến độ khóa học" },
  germany:    { preview: "Zertifikat-Vorschau", complete: "Schließe den Kurs ab, um dein Zertifikat zu erhalten", earned: "Zertifikat erhalten!", download: "Zertifikat ansehen", viewReq: "Anforderungen ansehen", objectives: "Lernziele", requirements: "Anforderungen", lessons: "Lektionen", lessonPrefix: "Lektion", completed: "Abgeschlossen", readyToStart: "Min · Bereit zum Start", back: "← Zurück zu den Regionen", courseProgress: "Kursfortschritt" },
  japan:      { preview: "証明書プレビュー", complete: "コースを修了して証明書を取得しましょう", earned: "証明書取得！", download: "証明書を見る", viewReq: "要件を確認", objectives: "学習目標", requirements: "要件", lessons: "レッスン", lessonPrefix: "レッスン", completed: "完了", readyToStart: "分 · 開始準備完了", back: "← 地域に戻る", courseProgress: "コース進捗" },
  arabic:     { preview: "معاينة الشهادة", complete: "أكمل الدورة للحصول على شهادتك", earned: "تم الحصول على الشهادة!", download: "عرض الشهادة", viewReq: "عرض المتطلبات", objectives: "أهداف التعلم", requirements: "المتطلبات", lessons: "الدروس", lessonPrefix: "الدرس", completed: "مكتمل", readyToStart: "دقيقة · جاهز للبدء", back: "→ العودة إلى المناطق", courseProgress: "تقدم الدورة" },
  persian:    { preview: "پیش‌نمایش گواهینامه", complete: "دوره را تکمیل کنید تا گواهینامه دریافت کنید", earned: "گواهینامه دریافت شد!", download: "مشاهده گواهینامه", viewReq: "مشاهده الزامات", objectives: "اهداف یادگیری", requirements: "الزامات", lessons: "درس‌ها", lessonPrefix: "درس", completed: "تکمیل شد", readyToStart: "دقیقه · آماده شروع", back: "→ بازگشت به مناطق", courseProgress: "پیشرفت دوره" },
};

export default function CoursePage() {
  const params = useParams<{ regionSlug: string }>();
  const regionSlug = params.regionSlug ?? "";
  const auth = useAuth();

  const [track, setTrack] = useState<RegionalTrack | null>(null);
  const [progress, setProgress] = useState<LearnerProgress>({ completedLessons: [], quizAttempts: [] });
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!regionSlug) return;
    const qParams = new URLSearchParams({ learnerId: auth.learnerId });
    Promise.all([
      fetch("/api/catalog").then((r) => r.json()),
      auth.authFetch(`/api/progress?${qParams}`).then((r) => r.json()),
    ])
      .then(([catalog, progressData]) => {
        const tracks: RegionalTrack[] = catalog.regionalTracks ?? [];
        setTrack(tracks.find((t) => t.slug === regionSlug) ?? null);
        setProgress(progressData.progress ?? { completedLessons: [], quizAttempts: [] });
        const certs: CertificateEligibility[] = progressData.certificates ?? [];
        setEligible(certs.find((c) => c.certificateSlug === `${regionSlug}-regional-certificate`)?.eligible ?? false);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.learnerId, regionSlug]);

  const meta = regionMeta[regionSlug] ?? { code: "", color: "#7c3aed" };
  const t = ui18n[regionSlug] ?? defaultUI;

  const isLessonCompleted = (lessonSlug: string) =>
    progress.completedLessons.includes(`${regionSlug}/${lessonSlug}`);

  const totalItems = track?.lessons.length ?? 0;
  const doneItems = track?.lessons.filter((l) => isLessonCompleted(l.slug)).length ?? 0;
  const progressPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-purple-100 rounded animate-pulse mb-6" />
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="h-20 w-20 bg-purple-100 rounded-2xl animate-pulse mb-4" />
            <div className="h-8 w-64 bg-purple-100 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Region not found.</p>
          <Link href="/regions" className="text-purple-600 hover:underline">← Back to Regions</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            href="/regions"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
          >
            {t.back}
          </Link>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-start gap-6 mb-6">
              <div
                className="w-28 h-16 rounded-2xl overflow-hidden shadow-md flex-shrink-0"
                style={{ border: `2px solid ${meta.color}` }}
              >
                {meta.code === "latam" ? (
                  <div className="w-full h-full grid grid-cols-3 grid-rows-2">
                    {["br","mx","ar","co","ve","cl"].map((c) => (
                      <img key={c} src={`https://flagcdn.com/w80/${c}.png`} alt={c} className="w-full h-full object-cover" />
                    ))}
                  </div>
                ) : regionSlug === "latam-es" ? (
                  <img src="https://flagcdn.com/w160/ar.png" alt="Argentina" className="w-full h-full object-cover" />
                ) : regionSlug === "latam-pt" ? (
                  <img src="https://flagcdn.com/w160/br.png" alt="Brazil" className="w-full h-full object-cover" />
                ) : meta.code ? (
                  <img src={`https://flagcdn.com/w160/${meta.code}.png`} alt={track.regionName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: `${meta.color}20` }}>🌍</div>
                )}
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-2">
                  {track.nativeLanguageName} · {track.languageName}
                </div>
                <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
                <p className="text-muted-foreground leading-relaxed">{track.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.courseProgress}</span>
                <span className="font-semibold" style={{ color: meta.color }}>{progressPct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}dd)` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {track.lessons[0]?.objectives && track.lessons[0].objectives.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <h3 className="font-semibold mb-3">{t.objectives}</h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {track.lessons[0].objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <h3 className="font-semibold mb-3">{t.requirements}</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {track.lessons.map((l) => (
                    <li key={l.slug} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                      {l.title}
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    {track.certificateTitle}
                  </li>
                </ul>
              </div>
            </div>

            {track.unityMessage && (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-l-4 border-purple-500 rounded-r-xl p-4">
                <p className="text-sm text-purple-800 leading-relaxed italic">{track.unityMessage}</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">{t.lessons}</h2>
          {track.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.slug);
            return (
              <motion.div
                key={lesson.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/regions/${regionSlug}/${lesson.slug}`} className="block">
                  <div className="p-6 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        completed ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                      }`}>
                        {completed
                          ? <CheckCircle className="w-6 h-6" />
                          : <BookOpen className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {t.lessonPrefix} {index + 1}: {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {completed ? t.completed : `${lesson.durationMinutes} ${t.readyToStart}`}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 text-white"
        >
          <div className="flex items-center gap-4 mb-4">
            <Award className="w-12 h-12" />
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {eligible ? t.earned : t.preview}
              </h3>
              <p className="text-purple-100">
                {eligible ? t.download : t.complete}
              </p>
            </div>
          </div>
          <Link
            href={`/regions/${regionSlug}/certificate`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
          >
            {eligible ? t.download : t.viewReq}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
