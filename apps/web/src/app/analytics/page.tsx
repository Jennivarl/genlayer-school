import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="page">
      <p className="eyebrow">Operations</p>
      <h1>Analytics</h1>
      <p className="lede">A lightweight view of learner progress, quizzes, certificate lifecycle, and content publishing health.</p>
      <AnalyticsDashboard />
    </div>
  );
}
