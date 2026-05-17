import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSessionUser } from "@/lib/auth";
import { submitExamSchema } from "@/lib/validations";
import { computeScoreResult } from "@/lib/scoring";

type SectionForSubmit = {
  type: string;
  questions: Array<{
    id: string;
    choices: Array<{
      id: string;
      isCorrect: boolean;
    }>;
  }>;
};

export async function POST(request: Request) {
  const user = await readSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Vui long dang nhap" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitExamSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Du lieu gui len khong hop le",
      },
      { status: 400 },
    );
  }

  const { examId, answers, startedAtIso } = parsed.data;

  const exam = await prisma.exam.findFirst({
    where: { id: examId, published: true },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              choices: {
                orderBy: { label: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!exam) {
    return NextResponse.json({ error: "De thi khong ton tai" }, { status: 404 });
  }

  const answerMap: Record<string, string> = {};
  for (const answer of answers) {
    answerMap[answer.questionId] = answer.choiceId;
  }

  const sectionsForScoring: SectionForSubmit[] = exam.sections.map((section) => ({
    type: section.type,
    questions: section.questions.map((question) => ({
      id: question.id,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        isCorrect: choice.isCorrect,
      })),
    })),
  }));

  const score = computeScoreResult({
    sections: sectionsForScoring,
    answers: answerMap,
    passingScore: exam.passingScore,
    minSectionScore: exam.minSectionScore,
  });

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.userId,
      examId: exam.id,
      totalQuestions: score.totalQuestions,
      totalCorrect: score.totalCorrect,
      estimatedScore: score.estimatedScore,
      languageScore: score.languageScore,
      readingScore: score.readingScore,
      listeningScore: score.listeningScore,
      passed: score.passed,
      breakdown: JSON.stringify({
        byCategory: score.byCategory,
        bySectionType: score.bySectionType,
      }),
      startedAt: startedAtIso ? new Date(startedAtIso) : new Date(),
      answers: {
        create: score.answerRows.map((row) => ({
          questionId: row.questionId,
          selectedChoiceId: row.selectedChoiceId,
          isCorrect: row.isCorrect,
        })),
      },
    },
  });

  return NextResponse.json({ ok: true, attemptId: attempt.id });
}
