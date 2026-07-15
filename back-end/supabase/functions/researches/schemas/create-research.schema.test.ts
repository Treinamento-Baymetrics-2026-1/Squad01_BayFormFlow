import { assertEquals, assertFalse } from "@std/assert";
import { createResearchSchema } from "./create-research.schema.ts";

function validPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    company_id: 1,
    display_name: "Pesquisa de Clima 2026",
    research_period: { start: "2026-01-01T00:00:00Z", end: "2026-03-01T00:00:00Z" },
    manager_id: 10,
    validator_ids: [20, 21],
    ...overrides,
  };
}

Deno.test("payload mínimo válido → sucesso", () => {
  const res = createResearchSchema.safeParse(validPayload());
  assertEquals(res.success, true);
});

Deno.test("company_id ausente → falha", () => {
  const payload = validPayload();
  delete payload.company_id;
  const res = createResearchSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("company_id não-positivo → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ company_id: 0 }));
  assertFalse(res.success);
});

Deno.test("display_name vazio → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ display_name: "" }));
  assertFalse(res.success);
});

Deno.test("display_name maior que 120 → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ display_name: "a".repeat(121) }));
  assertFalse(res.success);
});

Deno.test("research_description maior que 2000 → falha", () => {
  const res = createResearchSchema.safeParse(
    validPayload({ research_description: "a".repeat(2001) }),
  );
  assertFalse(res.success);
});

Deno.test("research_period.end antes de research_period.start → falha", () => {
  const res = createResearchSchema.safeParse(
    validPayload({
      research_period: { start: "2026-03-01T00:00:00Z", end: "2026-01-01T00:00:00Z" },
    }),
  );
  assertFalse(res.success);
});

Deno.test("research_period.end igual a research_period.start → falha", () => {
  const res = createResearchSchema.safeParse(
    validPayload({
      research_period: { start: "2026-01-01T00:00:00Z", end: "2026-01-01T00:00:00Z" },
    }),
  );
  assertFalse(res.success);
});

Deno.test("manager_id ausente → falha", () => {
  const payload = validPayload();
  delete payload.manager_id;
  const res = createResearchSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("manager_id não-positivo → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ manager_id: 0 }));
  assertFalse(res.success);
});

Deno.test("validator_ids ausente → falha", () => {
  const payload = validPayload();
  delete payload.validator_ids;
  const res = createResearchSchema.safeParse(payload);
  assertFalse(res.success);
});

Deno.test("validator_ids vazio → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ validator_ids: [] }));
  assertFalse(res.success);
});

Deno.test("validator_ids com id duplicado → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ validator_ids: [20, 20] }));
  assertFalse(res.success);
});

Deno.test("validator_ids com id não-positivo → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ validator_ids: [20, 0] }));
  assertFalse(res.success);
});

Deno.test("manager_id também presente em validator_ids → falha", () => {
  const res = createResearchSchema.safeParse(validPayload({ manager_id: 20, validator_ids: [20, 21] }));
  assertFalse(res.success);
});

Deno.test("validator_ids com um único validador → sucesso", () => {
  const res = createResearchSchema.safeParse(validPayload({ validator_ids: [20] }));
  assertEquals(res.success, true);
});
