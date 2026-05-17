import { NextResponse } from "next/server";
import { getPublishedExams } from "@/lib/query";

export async function GET() {
  const exams = await getPublishedExams();

  return NextResponse.json({
    exams: exams.map((exam) => ({
      id: exam.id,
      level: exam.level,
      title: exam.title,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      passingScore: exam.passingScore,
      minSectionScore: exam.minSectionScore,
      sectionCount: exam.sections.length,
      questionCount: exam.sections.reduce((acc, section) => acc + section._count.questions, 0),
      attemptCount: exam._count.attempts,
      sections: exam.sections.map((section) => ({
        id: section.id,
        order: section.order,
        type: section.type,
        title: section.title,
        questionCount: section._count.questions,
      })),
    })),
  });
}
