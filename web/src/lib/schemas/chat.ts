import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
