import { z } from "zod";

const inputValidation = z.object({
  originalURL: z.string().url().describe("Please provide a valid long url"),
  custom: z.string().optional(),
});

export type userInput = z.infer<typeof inputValidation>;

export default inputValidation;
