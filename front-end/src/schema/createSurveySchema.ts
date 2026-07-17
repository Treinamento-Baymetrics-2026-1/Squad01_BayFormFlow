// schemas/surveySchema.ts
import { z } from "zod";

export const participanteSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  rm: z.string().optional().or(z.literal("")),
}).refine((data) => data.email || data.rm, {
  message: "É necessário preencher pelo menos o E-mail ou o RM",
  path: ["email"],
});

export const surveyFormSchema1 = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  tipo: z.string().min(1, "O tipo é obrigatório"),
  descricao: z.string().min(1, "A descrição é obrigatória"),
  prazoInicio: z.string().min(1, "A data de início é obrigatória"),
  prazoEncerramento: z.string().min(1, "A data de encerramento é obrigatória"),
}).refine(
  (data) => {
    if (!data.prazoInicio || !data.prazoEncerramento) return true;
    
    const inicio = new Date(data.prazoInicio);
    const fim = new Date(data.prazoEncerramento);
    
    return fim >= inicio;
  },
  {
    message: "O prazo de encerramento não pode ser menor que o prazo de início",
    path: ["prazoEncerramento"],
  });

export const surveyFormSchema2 = z.object({
  empresa: z.string().min(1, "A empresa é obrigatória"),
  gestor: z.string().min(1, "O gestor é obrigatório"),
  validador: z.string().min(1, "O validador é obrigatório"),
});


export const surveyFormSchema3 = z.object({
  faixaEstimada: z.enum(["Pequeno", "Médio", "Alto", "Amplo"]),
});