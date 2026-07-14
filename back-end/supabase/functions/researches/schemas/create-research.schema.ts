import { z } from "zod";

export const createResearchSchema = z.object({
  company_id: z.number().int().positive(),
  display_name: z.string().min(1).max(120),
  research_description: z.string().max(2000).optional(),
  research_period: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    })
    .refine((p) => new Date(p.end).getTime() > new Date(p.start).getTime(), {
      message: "research_period.end deve ser posterior a research_period.start.",
      path: ["end"],
    }),
});

export type CreateResearchInput = z.infer<typeof createResearchSchema>;
