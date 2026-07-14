import type { Context } from "hono";
import { createResearch } from "../services/create-research.service.ts";
import { buildPorts } from "../deps.ts";
import type { CreateResearchInput } from "../schemas/create-research.schema.ts";

export async function createResearchController(
  c: Context,
  input: CreateResearchInput,
): Promise<Response> {
  const ports = buildPorts(c.req.raw);
  const res = await createResearch(ports, input);
  return Response.json(res.body, { status: res.status });
}
