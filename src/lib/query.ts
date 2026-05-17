import { prisma } from "@/lib/db";


export async function getPublishedExams() {
  return prisma.exam.findMany({
    where: { published: true },
    orderBy: [{ level: "asc" }, { createdAt: "asc" }],
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });
}

export async function getExamForTaking(examId: string) {
  return prisma.exam.findFirst({
    where: { id: examId, published: true },
    select: {
      id: true,
      level: true,
      title: true,
      description: true,
      durationMinutes: true,
      passingScore: true,
      minSectionScore: true,
      sections: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
          type: true,
          title: true,
          instruction: true,
          audioUrl: true,
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              order: true,
              content: true,
              explanation: true,
              audioUrl: true,
              choices: {
                orderBy: { label: "asc" },
                select: {
                  id: true,
                  label: true,
                  text: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getAttemptForViewer(
  attemptId: string,
  viewer: { userId: string; role: string },
) {
  return prisma.attempt.findFirst({
    where:
      viewer.role === "ADMIN"
        ? { id: attemptId }
        : { id: attemptId, userId: viewer.userId },
    select: {
      id: true,
      startedAt: true,
      submittedAt: true,
      totalQuestions: true,
      totalCorrect: true,
      estimatedScore: true,
      passed: true,
      languageScore: true,
      readingScore: true,
      listeningScore: true,
      breakdown: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      exam: {
        select: {
          id: true,
          level: true,
          title: true,
          durationMinutes: true,
          passingScore: true,
          minSectionScore: true,
          sections: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              order: true,
              type: true,
              title: true,
              instruction: true,
              questions: {
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  order: true,
                  content: true,
                  explanation: true,
                  choices: {
                    orderBy: { label: "asc" },
                    select: {
                      id: true,
                      label: true,
                      text: true,
                      isCorrect: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      answers: {
        select: {
          questionId: true,
          selectedChoiceId: true,
          isCorrect: true,
        },
      },
    },
  });
}

export async function getAdminExamTree() {
  return prisma.exam.findMany({
    orderBy: [{ level: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      level: true,
      title: true,
      description: true,
      durationMinutes: true,
      passingScore: true,
      minSectionScore: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          attempts: true,
        },
      },
      sections: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          order: true,
          type: true,
          title: true,
          instruction: true,
          audioUrl: true,
          weight: true,
          questions: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              order: true,
              content: true,
              explanation: true,
              audioUrl: true,
              choices: {
                orderBy: { label: "asc" },
                select: {
                  id: true,
                  label: true,
                  text: true,
                  isCorrect: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
