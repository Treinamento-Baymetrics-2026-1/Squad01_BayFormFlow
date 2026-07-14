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
  manager_id: z.number().int().positive(),
  validator_ids: z
    .array(z.number().int().positive())
    .min(1, "validator_ids deve ter ao menos 1 validador.")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "validator_ids não pode conter ids duplicados.",
    }),
}).refine((v) => !v.validator_ids.includes(v.manager_id), {
  message: "manager_id não pode também constar em validator_ids.",
  path: ["validator_ids"],
});

export type CreateResearchInput = z.infer<typeof createResearchSchema>;
