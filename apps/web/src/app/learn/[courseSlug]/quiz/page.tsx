import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@genlayer-school/content";
import { QuizCard } from "@/components/quiz-card";

export function generateStaticParams() {
  return courses.map((course) => ({ courseSlug: course.slug }));
}

export default async function CourseQuizPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <div className="page readable">
      <p className="eyebrow">Course checkpoint</p>
      <h1>{course.quiz.title}</h1>
      <p className="lede">Pass this checkpoint to move closer to the {course.title} certificate.</p>
      <section className="section">
        <QuizCard quiz={course.quiz} quizKind="course" />
      </section>
      <div className="cta-row">
        <Link className="button secondary" href={`/learn/${course.slug}`}>Back to course</Link>
      </div>
    </div>
  );
}
