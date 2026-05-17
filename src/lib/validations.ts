import { z } from "zod";

const safeText = z.string().trim().min(1);
const jlptLevelSchema = z.enum(["N5", "N4", "N3", "N2", "N1"]);
const sectionTypeSchema = z.enum(["VOCAB", "GRAMMAR", "READING", "LISTENING"]);
const choiceLabelSchema = z.enum(["A", "B", "C", "D"]);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Ten phai co it nhat 2 ky tu").max(60),
  email: z.email("Email khong hop le").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Mat khau phai tu 8 ky tu")
    .regex(/[a-zA-Z]/, "Mat khau can co chu cai")
    .regex(/[0-9]/, "Mat khau can co chu so"),
});

export const loginSchema = z.object({
  email: z.email("Email khong hop le").trim().toLowerCase(),
  password: z.string().min(1, "Nhap mat khau"),
});

export const submitExamSchema = z.object({
  examId: safeText,
  answers: z
    .array(
      z.object({
        questionId: safeText,
        choiceId: safeText,
      }),
    )
    .max(2000),
  startedAtIso: z.iso.datetime().optional(),
});

export const createExamSchema = z.object({
  level: jlptLevelSchema,
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(1000).optional(),
  durationMinutes: z.number().int().min(10).max(240),
  passingScore: z.number().int().min(1).max(180),
  minSectionScore: z.number().int().min(0).max(60),
  published: z.boolean().optional().default(false),
});

export const updateExamSchema = createExamSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Khong co du lieu can cap nhat",
  });

export const createSectionSchema = z.object({
  examId: safeText,
  type: sectionTypeSchema,
  title: z.string().trim().min(2).max(120),
  instruction: z.string().trim().max(1200).optional(),
  audioUrl: z.string().trim().max(500).optional(),
  order: z.number().int().min(1).max(99),
  weight: z.number().int().min(1).max(10).optional().default(1),
});

export const updateSectionSchema = createSectionSchema
  .omit({ examId: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Khong co du lieu can cap nhat",
  });

export const createQuestionSchema = z.object({
  sectionId: safeText,
  content: z.string().trim().min(1).max(2000),
  explanation: z.string().trim().max(2000).optional(),
  audioUrl: z.string().trim().max(500).optional(),
  order: z.number().int().min(1).max(500),
});

export const updateQuestionSchema = createQuestionSchema
  .omit({ sectionId: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Khong co du lieu can cap nhat",
  });

export const createChoiceSchema = z.object({
  questionId: safeText,
  label: choiceLabelSchema,
  text: z.string().trim().min(1).max(400),
  isCorrect: z.boolean().optional().default(false),
});

export const updateChoiceSchema = createChoiceSchema
  .omit({ questionId: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Khong co du lieu can cap nhat",
  });
