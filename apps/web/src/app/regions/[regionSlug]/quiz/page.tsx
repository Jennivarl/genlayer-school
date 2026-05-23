import { redirect } from "next/navigation";

export default function QuizRedirect({ params }: { params: { regionSlug: string } }) {
  redirect(`/regions/${params.regionSlug}`);
}
