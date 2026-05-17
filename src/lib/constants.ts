export type JLPTLevel = string;
export type SectionType = string;

export const JLPT_LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export const QUESTION_LABELS = ["A", "B", "C", "D"] as const;

export const SECTION_TYPE_LABEL: Record<SectionType, string> = {
  VOCAB: "Tu vung",
  GRAMMAR: "Ngu phap",
  READING: "Doc hieu",
  LISTENING: "Nghe hieu",
};
