import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUserPage } from "@/lib/access";
import { getAttemptForViewer } from "@/lib/query";
import { SECTION_TYPE_LABEL } from "@/lib/constants";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: PageProps) {
  const user = await requireUserPage();
  const { id } = await params;

  const attempt = await getAttemptForViewer(id, user);

  if (!attempt) {
    notFound();
  }

  const { exam, answers } = attempt;
  const answerMap = new Map<string, string | null>(
    answers.map((a) => [a.questionId, a.selectedChoiceId]),
  );
  
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <section className="panel p-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-[color:var(--text-strong)] sm:text-4xl">
          Ket qua thi: {exam.title}
        </h1>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          Hoan thanh luc: {new Date(attempt.submittedAt).toLocaleString("vi-VN")}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Tong diem</span>
            <span className={`mt-1 font-display text-4xl font-black ${attempt.passed ? "text-[color:var(--success)]" : "text-[color:var(--danger)]"}`}>
              {attempt.estimatedScore}/180
            </span>
          </div>
          <div className="h-12 w-px bg-[color:var(--line)]"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Tu vung & Ngu phap</span>
            <span className="mt-1 font-display text-2xl font-bold text-[color:var(--text-strong)]">{attempt.languageScore}/60</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Doc hieu</span>
            <span className="mt-1 font-display text-2xl font-bold text-[color:var(--text-strong)]">{attempt.readingScore}/60</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">Nghe hieu</span>
            <span className="mt-1 font-display text-2xl font-bold text-[color:var(--text-strong)]">{attempt.listeningScore}/60</span>
          </div>
        </div>

        <div className="mt-6">
          <span className={`inline-block rounded-full px-4 py-2 text-sm font-bold tracking-wide uppercase ${attempt.passed ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-[color:var(--danger)]/15 text-[color:var(--danger)]"}`}>
            {attempt.passed ? "🎉 Chuc mung! Ban da DO" : "💔 Ban da TRUOT. Hay co gang lan sau!"}
          </span>
        </div>
      </section>

      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[color:var(--text-strong)]">Chi tiet bai lam</h2>
        
        {exam.sections.map((section) => (
          <section key={section.id} className="panel overflow-hidden">
            <div className="bg-[color:var(--surface-soft)] px-5 py-4 border-b border-[color:var(--line)]">
              <h3 className="font-display text-lg font-bold text-[color:var(--text-strong)]">
                Section {section.order}: {SECTION_TYPE_LABEL[section.type]} - {section.title}
              </h3>
            </div>
            
            <div className="divide-y divide-[color:var(--line)]/50">
              {section.questions.map((question, qIdx) => {
                const userChoiceId = answerMap.get(question.id);
                
                return (
                  <div key={question.id} className="p-5 sm:p-6">
                    <p className="font-medium text-[color:var(--text-strong)]">
                      <span className="mr-2 text-[color:var(--text-muted)]">Cau {qIdx + 1}.</span> 
                      {question.content}
                    </p>
                    
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {question.choices.map((choice) => {
                        const isUserChoice = userChoiceId === choice.id;
                        const isCorrectChoice = choice.isCorrect;
                        
                        let choiceClass = "border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)]";
                        if (isCorrectChoice) {
                          choiceClass = "border-[color:var(--success)] bg-[color:var(--success)]/10 text-[color:var(--success)] font-bold";
                        } else if (isUserChoice && !isCorrectChoice) {
                          choiceClass = "border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]";
                        }

                        return (
                          <div key={choice.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${choiceClass}`}>
                            <span className="w-5 font-semibold">{choice.label}.</span>
                            <span>{choice.text}</span>
                            {isUserChoice && isCorrectChoice && <span className="ml-auto text-[color:var(--success)]">✓</span>}
                            {isUserChoice && !isCorrectChoice && <span className="ml-auto text-[color:var(--danger)]">✗</span>}
                          </div>
                        );
                      })}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-4 rounded-lg bg-[#f8f9fa] p-3 text-sm text-[color:var(--text-muted)] dark:bg-[#1a1a1a]">
                        <span className="font-bold text-[color:var(--text-strong)]">Giai thich:</span> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Link href="/dashboard" className="btn btn-primary">
          Quay lai Dashboard
        </Link>
      </div>
    </div>
  );
}
