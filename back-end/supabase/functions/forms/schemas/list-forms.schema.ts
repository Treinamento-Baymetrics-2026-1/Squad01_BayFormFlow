import { z } from "zod";

export const FORM_STATUS_VALUES = [
  "Criado",
  "Mudança Solicitada",
  "Mudança Realizada",
  "Em Andamento",
  "Concluido",
  "Cancelado",
] as const;

export const listFormsQuerySchema = z.object({
  research_id: z.coerce.number().int().positive().optional(),
  form_status: z.enum(FORM_STATUS_VALUES).optional(),
});

export type ListFormsQuery = z.infer<typeof listFormsQuerySchema>;
