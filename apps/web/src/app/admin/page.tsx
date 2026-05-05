import { AdminContentConsole } from "@/components/admin-content-console";

export default function AdminPage() {
  return (
    <div className="page">
      <p className="eyebrow">Operations</p>
      <h1>Admin content</h1>
      <p className="lede">Draft and publish monthly community spotlights plus weekly Gen-Fren summaries and prep quizzes.</p>
      <AdminContentConsole />
    </div>
  );
}
