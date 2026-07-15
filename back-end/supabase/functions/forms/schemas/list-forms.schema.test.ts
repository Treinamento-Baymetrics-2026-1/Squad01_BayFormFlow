import { assertEquals, assertFalse } from "@std/assert";
import { listFormsQuerySchema } from "./list-forms.schema.ts";

Deno.test("sem filtros → sucesso (todos opcionais)", () => {
  const res = listFormsQuerySchema.safeParse({});
  assertEquals(res.success, true);
});

Deno.test("research_id numérico em string (query param) → coagido para number", () => {
  const res = listFormsQuerySchema.safeParse({ research_id: "3" });
  assertEquals(res.success, true);
  if (res.success) {
    assertEquals(res.data.research_id, 3);
  }
});

Deno.test("research_id não-positivo → falha", () => {
  const res = listFormsQuerySchema.safeParse({ research_id: "0" });
  assertFalse(res.success);
});

Deno.test("form_status válido → sucesso", () => {
  const res = listFormsQuerySchema.safeParse({ form_status: "Em Andamento" });
  assertEquals(res.success, true);
});

Deno.test("form_status inválido → falha", () => {
  const res = listFormsQuerySchema.safeParse({ form_status: "Inexistente" });
  assertFalse(res.success);
});
