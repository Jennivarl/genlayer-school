import { LearnerProgressDashboard } from "@/components/learner-progress-dashboard";
import { RegionalProgressCards } from "@/components/regional-progress-cards";
import { UsernameForm } from "@/components/username-form";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

export default async function DashboardPage() {
  const regionalTracks = await getPublishedRegionalTracks();

  return (
    <div className="page">
      <p className="eyebrow">Learner dashboard</p>
      <h1>Your GenLayer path</h1>
      <p className="lede">Your lessons, quizzes, and certificate readiness are loaded through the authenticated progress API.</p>

      <section className="section">
        <UsernameForm />
      </section>

      <LearnerProgressDashboard />

      <section className="section">
        <p className="eyebrow">Regional certificates</p>
        <h2>Native-language pathways</h2>
        <p className="lede">Track regional lesson progress, quiz passes, and certificate readiness from one place.</p>
      </section>
      <RegionalProgressCards tracks={regionalTracks} />
    </div>
  );
}


