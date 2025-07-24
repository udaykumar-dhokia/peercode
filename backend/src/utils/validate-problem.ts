import { z } from "zod";

const ProblemSchema = z.object({
  title: z.string(),
  category: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  description: z.string(),
  constraints: z.array(z.string()).min(1),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
      })
    )
    .min(5),
});

export function validateProblem(problem) {
  const result = ProblemSchema.safeParse(problem);
  return result;
}
