import { z } from "zod";

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const companiesFormSchema = z.object({
  razaoSocial: z
    .string()
    .nonempty("A razão social é obrigatória")
    .min(3, "A razão social deve ter pelo menos 3 caracteres"),

  nomeFantasia: z
    .string()
    .nonempty("O nome fantasia é obrigatório")
    .min(2, "O nome fantasia deve ter pelo menos 2 caracteres"),

  email: z
    .string()
    .nonempty("O e-mail é obrigatório")
    .email("Insira um e-mail válido"),

  cnpj: z
    .string()
    .nonempty("O CNPJ é obrigatório")
    .regex(cnpjRegex, "O CNPJ deve estar no formato 00.000.000/0000-00"),

  status: z.enum(["Ativo", "Inativo"]),
});

export type CompaniesFormData = z.infer<typeof companiesFormSchema>;
