'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SECTION_TYPE_LABEL } from '@/lib/constants';

type ExamRunnerProps = {
  exam: {
    id: string;
    level: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    passingScore: number;
    minSectionScore: number;
    sections: Array<{
      id: string;
      order: number;
      type: 'VOCAB' | 'GRAMMAR' | 'READING' | 'LISTENING';
      title: string;
      instruction: string | null;
      audioUrl: string | null;
      questions: Array<{
        id: string;
        order: number;
        content: string;
        explanation: string | null;
        audioUrl: string | null;
        choices: Array<{
          id: string;
          label: string;
          text: string;
        }>;
      }>;
    }>;
  };
};

type FlatQuestion = {
  id: string;
  globalIndex: number;
  sectionOrder: number;
  sectionType: 'VOCAB' | 'GRAMMAR' | 'READING' | 'LISTENING';
  sectionTitle: string;
  sectionInstruction: string | null;
  sectionAudioUrl: string | null;
  order: number;
  content: string;
  explanation: string | null;
  audioUrl: string | null;
  choices: Array<{
    id: string;
    label: string;
    text: string;
  }>;
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function ExamRunner({ exam }: ExamRunnerProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAtIso] = useState(() => new Date().toISOString());

  const questions = useMemo<FlatQuestion[]>(() => {
    const rows: FlatQuestion[] = [];
    for (const section of exam.sections) {
      for (const question of section.questions) {
        rows.push({
          id: question.id,
          globalIndex: rows.length,
          sectionOrder: section.order,
          sectionType: section.type,
          sectionTitle: section.title,
          sectionInstruction: section.instruction,
          sectionAudioUrl: section.audioUrl,
          order: question.order,
          content: question.content,
          explanation: question.explanation,
          audioUrl: question.audioUrl,
          choices: question.choices,
        });
      }
    }
    return rows;
  }, [exam.sections]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];

  async function submit(force = false) {
    if (!force && !window.confirm('Ban chac chan nop bai ngay bay gio?')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          startedAtIso,
          answers: Object.entries(answers).map(([questionId, choiceId]) => ({
            questionId,
            choiceId,
          })),
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { attemptId?: string; error?: string }
        | null;

      if (!response.ok || !payload?.attemptId) {
        throw new Error(payload?.error ?? 'Khong the nop bai, vui long thu lai');
      }

      router.push(`/result/${payload.attemptId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Nop bai that bai');
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      return;
    }

    if (secondsLeft <= 0) {
      void submit(true);
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft, isSubmitting]);

  if (!currentQuestion) {
    return (
      <section className="panel p-6">
        <p className="text-sm text-[color:var(--text-muted)]">De thi nay chua co cau hoi de hien thi.</p>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="panel p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{exam.level}</span>
              <span className="chip">{totalQuestions} cau</span>
              <span className="chip">Qua mon: {exam.passingScore}/180</span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-extrabold text-[color:var(--text-strong)]">{exam.title}</h1>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">{exam.description ?? 'Lam bai theo dung trinh tu section de dat hieu qua cao nhat.'}</p>
          </div>

          <div className={`rounded-xl border px-3 py-2 text-right ${secondsLeft <= 300 ? 'border-[color:var(--danger)] bg-[color:var(--danger)]/10 text-[color:var(--danger)]' : 'border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--text-strong)]'}`}>
            <p className="text-xs uppercase tracking-wide">Thoi gian con lai</p>
            <p className="mt-1 font-display text-2xl font-extrabold">{formatSeconds(secondsLeft)}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
          <p className="text-xs text-[color:var(--text-muted)]">
            Section {currentQuestion.sectionOrder} - {SECTION_TYPE_LABEL[currentQuestion.sectionType]}
          </p>
          <p className="mt-1 font-semibold text-[color:var(--text-strong)]">{currentQuestion.sectionTitle}</p>
          {currentQuestion.sectionInstruction ? (
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">{currentQuestion.sectionInstruction}</p>
          ) : null}

          {currentQuestion.sectionAudioUrl ? (
            <audio className="mt-3 w-full" controls src={currentQuestion.sectionAudioUrl} preload="none">
              Trinh duyet khong ho tro phat audio.
            </audio>
          ) : null}
        </div>

        <article className="mt-5 rounded-xl border border-[color:var(--line)] bg-white p-4 sm:p-5">
          <p className="text-sm text-[color:var(--text-muted)]">Cau {currentQuestion.globalIndex + 1}</p>
          <h2 className="mt-2 text-base leading-7 font-semibold text-[color:var(--text-strong)]">{currentQuestion.content}</h2>

          {currentQuestion.audioUrl ? (
            <audio className="mt-3 w-full" controls src={currentQuestion.audioUrl} preload="none">
              Trinh duyet khong ho tro phat audio.
            </audio>
          ) : null}

          <div className="mt-4 space-y-2">
            {currentQuestion.choices.map((choice) => {
              const selected = answers[currentQuestion.id] === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${selected ? 'border-[#ddb259] bg-[#fff5dd] text-[color:var(--text-strong)]' : 'border-[color:var(--line)] bg-white text-[color:var(--text)] hover:bg-[color:var(--surface-soft)]'}`}
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentQuestion.id]: choice.id,
                    }))
                  }
                  disabled={isSubmitting}
                >
                  <span className="font-semibold">{choice.label}.</span> {choice.text}
                </button>
              );
            })}
          </div>
        </article>

        {error ? (
          <p className="mt-4 rounded-lg border border-[color:var(--danger)]/35 bg-[color:var(--danger)]/10 px-3 py-2 text-sm text-[color:var(--danger)]">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              disabled={currentIndex === 0 || isSubmitting}
            >
              Cau truoc
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCurrentIndex((value) => Math.min(totalQuestions - 1, value + 1))}
              disabled={currentIndex >= totalQuestions - 1 || isSubmitting}
            >
              Cau tiep
            </button>
          </div>

          <button type="button" className="btn btn-primary" onClick={() => void submit()} disabled={isSubmitting}>
            {isSubmitting ? 'Dang nop bai...' : 'Nop bai va tinh diem'}
          </button>
        </div>
      </section>

      <aside className="panel h-fit p-4 sm:p-5 lg:sticky lg:top-20">
        <h3 className="font-display text-lg font-bold text-[color:var(--text-strong)]">Tien do bai thi</h3>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          Da tra loi {answeredCount}/{totalQuestions} cau
        </p>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const answered = Boolean(answers[question.id]);
            const active = index === currentIndex;

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-9 rounded-lg border text-xs font-semibold transition ${active ? 'border-[#ac7d1e] bg-[#f0c34e] text-[#5a3a00]' : answered ? 'border-[#ddb259] bg-[#fff5dd] text-[color:var(--text-strong)]' : 'border-[color:var(--line)] bg-white text-[color:var(--text-muted)] hover:bg-[color:var(--surface-soft)]'}`}
                disabled={isSubmitting}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-xs text-[color:var(--text-muted)]">
          Khi het gio, he thong se tu dong nop bai va cham diem ngay.
        </div>
      </aside>
    </div>
  );
}
