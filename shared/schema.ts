import { z } from "zod";

export const insertFeedbackSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500, "Comentário deve ter no máximo 500 caracteres").optional(),
});

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type Feedback = InsertFeedback & {
  id: string;
  timestamp: string;
};
