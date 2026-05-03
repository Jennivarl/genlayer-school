export const dynamic = "force-dynamic";

import { courses, weeklySummaries } from "@genlayer-school/content";
import { getCertificateEligibility, summarizeProgress } from "@/lib/backend/learning";
import { getProgress } from "@/lib/backend/progress-store";

export default async function DashboardPage() {
  const progress = await getProgress();
  const summary = summarizeProgress(progress);
  const certificates = getCertificateEligibility(progress);
  const lessons = courses.reduce((total, course) => total + course.lessons.length, 0);

  return (
    <div className="page">
      <p className="eyebrow">Learner dashboard</p>
      <h1>Your GenLayer path</h1>
      <p className="lede">This dashboard is backed by the local progress API/store. It is shaped so Supabase can replace the storage layer later without changing product behavior.</p>

      <section className="section grid">
        <article className="card"><p className="meta">Lessons</p><h2>{summary.completedLessonCount}/{lessons}</h2><p>{summary.lessonPercent}% complete.</p></article>
        <article className="card"><p className="meta">Quiz attempts</p><h2>{summary.quizAttemptCount}</h2><p>{summary.passedQuizCount} passed quiz checkpoints.</p></article>
        <article className="card"><p className="meta">Weekly prep</p><h2>{weeklySummaries.length}</h2><p>Gen-Fren prep issue ready.</p></article>
      </section>

      <section className="section grid two">
        {certificates.map((certificate) => (
          <article className="card" key={certificate.certificateSlug}>
            <p className="meta">{certificate.eligible ? "Eligible" : "In progress"}</p>
            <h2>{certificate.title}</h2>
            <div className="list">
              {certificate.requirements.map((requirement) => (
                <div className="list-item" key={requirement.label}>
                  <span>{requirement.label}</span>
                  <span className="pill">{requirement.complete ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

