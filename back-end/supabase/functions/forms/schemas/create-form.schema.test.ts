import { assertEquals, assertFalse } from "@std/assert";
import { createFormSchema } from "./create-form.schema.ts";

function validPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    research_id: 1,
    display_name: "Formulário de Clima 2026",
    forms_description: "Avaliação trimestral de clima organizacional.",
    time_period: { start: "2026-01-01T00:00:00Z", end: "2026-03-01T00:00:00Z" },
    participant_target: 50,
    form: { fields: [{ type: "text", label: "Nome" }] },
    ...overrides,
  };
}

Deno.test("payload mínimo válido → sucesso", () => {
  const res = createFormSchema.safeParse(validPayload());
  assertEquals(res.success, true);
});

Deno.test("version_name ausente → sucesso (é opcional)", () => {
  const res = createFormSchema.safeParse(validPayload());
  assertEquals(res.success, true);
});

Deno.test("version_name presente e válido → sucesso", () => {
  const res = createFormSchema.safeParse(validPayload({ version_name: "v1" }));
  assertEquals(res.success, true);
});

Deno.test("version_name maior que 10 → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ version_name: "a".repeat(11) }));
  assertFalse(res.success);
});

Deno.test("research_id ausente → falha", () => {
  const payload = validPayload();
  delete payload.research_id;
  const res = createFormSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("research_id não-positivo → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ research_id: 0 }));
  assertFalse(res.success);
});

Deno.test("display_name vazio → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ display_name: "" }));
  assertFalse(res.success);
});

Deno.test("display_name maior que 120 → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ display_name: "a".repeat(121) }));
  assertFalse(res.success);
});

Deno.test("forms_description ausente → falha", () => {
  const payload = validPayload();
  delete payload.forms_description;
  const res = createFormSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("forms_description vazia → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ forms_description: "" }));
  assertFalse(res.success);
});

Deno.test("forms_description maior que 2000 → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ forms_description: "a".repeat(2001) }));
  assertFalse(res.success);
});

Deno.test("time_period.end antes de time_period.start → falha", () => {
  const res = createFormSchema.safeParse(
    validPayload({
      time_period: { start: "2026-03-01T00:00:00Z", end: "2026-01-01T00:00:00Z" },
    }),
  );
  assertFalse(res.success);
});

Deno.test("time_period.end igual a time_period.start → falha", () => {
  const res = createFormSchema.safeParse(
    validPayload({
      time_period: { start: "2026-01-01T00:00:00Z", end: "2026-01-01T00:00:00Z" },
    }),
  );
  assertFalse(res.success);
});

Deno.test("participant_target ausente → falha", () => {
  const payload = validPayload();
  delete payload.participant_target;
  const res = createFormSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("participant_target não-positivo → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ participant_target: 0 }));
  assertFalse(res.success);
});

Deno.test("form ausente → falha", () => {
  const payload = validPayload();
  delete payload.form;
  const res = createFormSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("form não-objeto (array) → falha", () => {
  const res = createFormSchema.safeParse(validPayload({ form: ["a", "b"] }));
  assertFalse(res.success);
});
