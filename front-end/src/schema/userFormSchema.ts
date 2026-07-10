import { z } from "zod";

export const userFormSchema = z.object({
  nome: z.string().min(3, "Nome muito curto").nonempty("O nome é obrigatório"),
  email: z.string().email("E-mail inválido").nonempty("O e-mail é obrigatório"),
  perfil: z.string().nonempty("Selecione um perfil"),
  // não aceita undefined
  status: z.enum(["Ativo", "Inativo"]), 
});

export type UserFormData = z.infer<typeof userFormSchema>;