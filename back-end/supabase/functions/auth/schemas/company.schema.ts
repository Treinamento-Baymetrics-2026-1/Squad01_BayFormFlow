import { z } from "zod";

export const companySchema = z.object({
  display_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  cnpj: z.string().regex(/^[0-9A-Z]{12}[0-9]{2}$/),
  phonenumber: z.string().regex(/^[0-9]{7,15}$/),
});

export type CompanyInput = z.infer<typeof companySchema>;
