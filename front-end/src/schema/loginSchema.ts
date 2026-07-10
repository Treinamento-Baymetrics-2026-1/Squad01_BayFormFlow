import { z } from "zod";


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Insira um e-mail é válido" })
    .email({ message: "Digite um e-mail válido" }),
  password: z
    .string()
    .min(1, { message: "A senha é obrigatória" })
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;