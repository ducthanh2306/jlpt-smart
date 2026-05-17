import { notFound } from "next/navigation";
import { requireUserPage } from "@/lib/access";
import { getExamForTaking } from "@/lib/query";
import { ExamRunner } from "@/components/exam-runner";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExamPage({ params }: PageProps) {
  // Ensure the user is logged in
  await requireUserPage();
  
  const { id } = await params;

  // Fetch the exam details
  const exam = await getExamForTaking(id);

  if (!exam) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <ExamRunner exam={exam} />
    </div>
  );
}
