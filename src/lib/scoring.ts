export type SectionType = string;

type Category = "LANGUAGE" | "READING" | "LISTENING";

type QuestionForScoring = {
  id: string;
  choices: Array<{
    id: string;
    isCorrect: boolean;
  }>;
};

type SectionForScoring = {
  type: SectionType;
  questions: QuestionForScoring[];
};

type ScoreStat = {
  total: number;
  correct: number;
  score: number;
};

export type ScoreResult = {
  totalQuestions: number;
  totalCorrect: number;
  estimatedScore: number;
  languageScore: number;
  readingScore: number;
  listeningScore: number;
  passed: boolean;
  byCategory: Record<Category, ScoreStat>;
  bySectionType: Record<SectionType, ScoreStat>;
  answerRows: Array<{
    questionId: string;
    selectedChoiceId: string | null;
    isCorrect: boolean;
  }>;
};

function scoreFromRatio(correct: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((correct / total) * 60);
}

function getCategoryFromSection(type: SectionType): Category {
  if (type === "READING") {
    return "READING";
  }

  if (type === "LISTENING") {
    return "LISTENING";
  }

  return "LANGUAGE";
}

export function computeScoreResult(params: {
  sections: SectionForScoring[];
  answers: Record<string, string>;
  passingScore: number;
  minSectionScore: number;
}): ScoreResult {
  const byCategory: Record<Category, ScoreStat> = {
    LANGUAGE: { total: 0, correct: 0, score: 0 },
    READING: { total: 0, correct: 0, score: 0 },
    LISTENING: { total: 0, correct: 0, score: 0 },
  };

  const bySectionType: Record<SectionType, ScoreStat> = {
    VOCAB: { total: 0, correct: 0, score: 0 },
    GRAMMAR: { total: 0, correct: 0, score: 0 },
    READING: { total: 0, correct: 0, score: 0 },
    LISTENING: { total: 0, correct: 0, score: 0 },
  };

  const answerRows: ScoreResult["answerRows"] = [];

  let totalQuestions = 0;
  let totalCorrect = 0;

  for (const section of params.sections) {
    for (const question of section.questions) {
      totalQuestions += 1;
      bySectionType[section.type].total += 1;

      const category = getCategoryFromSection(section.type);
      byCategory[category].total += 1;

      const selectedRaw = params.answers[question.id];
      const selectedChoiceId =
        typeof selectedRaw === "string" && selectedRaw.length > 0 ? selectedRaw : null;

      const validSelectedChoiceId = question.choices.some((choice) => choice.id === selectedChoiceId)
        ? selectedChoiceId
        : null;

      const correctChoiceId = question.choices.find((choice) => choice.isCorrect)?.id;
      const isCorrect = Boolean(validSelectedChoiceId && correctChoiceId === validSelectedChoiceId);

      if (isCorrect) {
        totalCorrect += 1;
        bySectionType[section.type].correct += 1;
        byCategory[category].correct += 1;
      }

      answerRows.push({
        questionId: question.id,
        selectedChoiceId: validSelectedChoiceId,
        isCorrect,
      });
    }
  }

  byCategory.LANGUAGE.score = scoreFromRatio(byCategory.LANGUAGE.correct, byCategory.LANGUAGE.total);
  byCategory.READING.score = scoreFromRatio(byCategory.READING.correct, byCategory.READING.total);
  byCategory.LISTENING.score = scoreFromRatio(byCategory.LISTENING.correct, byCategory.LISTENING.total);

  for (const key of Object.keys(bySectionType) as SectionType[]) {
    bySectionType[key].score = scoreFromRatio(bySectionType[key].correct, bySectionType[key].total);
  }

  const estimatedScore =
    byCategory.LANGUAGE.score + byCategory.READING.score + byCategory.LISTENING.score;

  const passed =
    estimatedScore >= params.passingScore &&
    byCategory.LANGUAGE.score >= params.minSectionScore &&
    byCategory.READING.score >= params.minSectionScore &&
    byCategory.LISTENING.score >= params.minSectionScore;

  return {
    totalQuestions,
    totalCorrect,
    estimatedScore,
    languageScore: byCategory.LANGUAGE.score,
    readingScore: byCategory.READING.score,
    listeningScore: byCategory.LISTENING.score,
    passed,
    byCategory,
    bySectionType,
    answerRows,
  };
}
