import { z } from "zod";

export const operatorSchema = z
  .object({
    display_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    position: z.enum(["Gestor", "Validador"]),
    is_admin: z.boolean().default(false),
  })
  .refine((d) => !d.is_admin || d.position === "Gestor", {
    message: "is_admin só é permitido quando position = 'Gestor'.",
    path: ["is_admin"],
  });

export type OperatorInput = z.infer<typeof operatorSchema>;
