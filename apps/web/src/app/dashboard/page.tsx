import { LearnerProgressDashboard } from "@/components/learner-progress-dashboard";
import { UsernameForm } from "@/components/username-form";

export default function DashboardPage() {
  return (
    <div className="page">
      <p className="eyebrow">Learner dashboard</p>
      <h1>Your GenLayer path</h1>
      <p className="lede">Your lessons, quizzes, and certificate readiness are loaded through the authenticated progress API.</p>

      <section className="section">
        <UsernameForm />
      </section>

      <LearnerProgressDashboard />
    </div>
  );
}


