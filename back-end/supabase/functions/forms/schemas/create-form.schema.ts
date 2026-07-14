import { z } from "zod";

export const createFormSchema = z.object({
  research_id: z.number().int().positive(),
  display_name: z.string().min(1).max(120),
  forms_description: z.string().min(1).max(2000),
  time_period: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    })
    .refine((p) => new Date(p.end).getTime() > new Date(p.start).getTime(), {
      message: "time_period.end deve ser posterior a time_period.start.",
      path: ["end"],
    }),
  participant_target: z.number().int().positive(),
  form: z.record(z.string(), z.unknown()),
  version_name: z.string().min(1).max(10).optional(),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
