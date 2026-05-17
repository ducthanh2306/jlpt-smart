import Link from "next/link";
import { requireUserPage } from "@/lib/access";
import { getPublishedExams } from "@/lib/query";
import { SECTION_TYPE_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/db";

function scoreClass(score: number) {
  return score >= 90 ? "score-pass" : "score-fail";
}

export default async function DashboardPage() {
  const user = await requireUserPage();

  const [exams, recentAttempts] = await Promise.all([
    getPublishedExams(),
    prisma.attempt.findMany({
      where: { userId: user.userId },
      orderBy: { submittedAt: "desc" },
      take: 5,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            level: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="panel rise p-6 sm:p-8">
        <p className="chip">Xin chao, {user.name}</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-[color:var(--text-strong)] sm:text-3xl">
          Chon de thi thu JLPT va bat dau luyen ngay
        </h1>
        <p className="mt-2 text-sm text-[color:var(--text-muted)] sm:text-base">
          Ban co the vao de thi moi, nop bai de duoc cham diem tu dong va xem lich su ket qua gan day.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => {
          const questionCount = exam.sections.reduce((sum, section) => sum + section._count.questions, 0);

          return (
            <article key={exam.id} className="panel p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="chip">{exam.level}</span>
                <span className="text-xs text-[color:var(--text-muted)]">{exam.durationMinutes} phut</span>
              </div>

              <h2 className="mt-3 font-display text-lg font-extrabold text-[color:var(--text-strong)]">
                {exam.title}
              </h2>

              <p className="mt-2 min-h-11 text-sm leading-6 text-[color:var(--text-muted)]">
                {exam.description ?? "De thi thu tong hop day du cac phan JLPT."}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip">{questionCount} cau</span>
                <span className="chip">Qua mon: {exam.passingScore}</span>
                <span className="chip">So lan thi: {exam._count.attempts}</span>
              </div>

              <ul className="mt-3 space-y-1 text-xs text-[color:var(--text-muted)]">
                {exam.sections.map((section) => (
                  <li key={section.id}>
                    {section.order}. {SECTION_TYPE_LABEL[section.type]} ({section._count.questions} cau)
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <Link href={`/exam/${exam.id}`} className="btn btn-primary w-full">
                  Bat dau lam bai
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="panel p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-[color:var(--text-strong)]">Ket qua gan day</h2>
          <span className="chip">{recentAttempts.length} lan thi</span>
        </div>

        {recentAttempts.length === 0 ? (
          <p className="mt-4 text-sm text-[color:var(--text-muted)]">Ban chua co lan thi nao. Hay bat dau de dau tien!</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead>
                <tr className="border-b border-[color:var(--line)] text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                  <th className="pb-2 font-medium">De thi</th>
                  <th className="pb-2 font-medium">Diem</th>
                  <th className="pb-2 font-medium">Ngay nop</th>
                  <th className="pb-2 font-medium">Chi tiet</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b border-[color:var(--line)]/70">
                    <td className="py-3">
                      <p className="font-medium text-[color:var(--text-strong)]">{attempt.exam.title}</p>
                      <p className="text-xs text-[color:var(--text-muted)]">{attempt.exam.level}</p>
                    </td>
                    <td className={`py-3 font-semibold ${scoreClass(attempt.estimatedScore)}`}>
                      {attempt.estimatedScore}/180
                    </td>
                    <td className="py-3 text-[color:var(--text-muted)]">
                      {new Date(attempt.submittedAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-3">
                      <Link href={`/result/${attempt.id}`} className="btn btn-ghost">
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
