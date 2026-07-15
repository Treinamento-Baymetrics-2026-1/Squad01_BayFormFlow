import type { Context } from "hono";
import { createForm } from "../services/create-form.service.ts";
import { buildPorts } from "../deps.ts";
import type { CreateFormInput } from "../schemas/create-form.schema.ts";

export async function createFormController(
  c: Context,
  input: CreateFormInput,
): Promise<Response> {
  const ports = buildPorts(c.req.raw);
  const res = await createForm(ports, input);
  return Response.json(res.body, { status: res.status });
}
