import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../_shared/require-auth.middleware.ts";
import { operatorSchema } from "./schemas/operator.schema.ts";
import { companySchema } from "./schemas/company.schema.ts";
import { provision } from "./services/provisioning.service.ts";
import { listUsers } from "./services/list-users.service.ts";
import { listCompanies } from "./services/list-companies.service.ts";
import { buildPorts } from "./deps.ts";

export const app = new Hono().basePath("/auth");

app.use(
  "*",
  cors({
    origin: ["http://127.0.0.1:3000", "https://squad01-bay-form-flow-rose.vercel.app"],
    allowHeaders: ["authorization", "x-client-info", "apikey", "content-type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.post("/operators", requireAuth, zValidator("json", operatorSchema), async (c) => {
  const input = c.req.valid("json");
  const ports = buildPorts(c.req.raw);
  const res = await provision(ports, {
    principal: {
      display_name: input.display_name,
      email: input.email,
      password: input.password,
    },
    insertSubtype: (userId) =>
      ports.repos.insertEmployee({
        userId,
        position: input.position,
        isAdmin: input.is_admin,
      }),
    subtypeIdKey: "employee_id",
  });
  return Response.json(res.body, { status: res.status });
});

app.post("/companies", requireAuth, zValidator("json", companySchema), async (c) => {
  const input = c.req.valid("json");
  const ports = buildPorts(c.req.raw);
  const res = await provision(ports, {
    principal: {
      display_name: input.display_name,
      email: input.email,
      password: input.password,
    },
    insertSubtype: (userId) =>
      ports.repos.insertCompany({
        userId,
        cnpj: input.cnpj,
        phonenumber: input.phonenumber,
      }),
    subtypeIdKey: "company_id",
  });
  return Response.json(res.body, { status: res.status });
});

app.get("/users", requireAuth, async (c) => {
  const ports = buildPorts(c.req.raw);
  const res = await listUsers(ports);
  return Response.json(res.body, { status: res.status });
});

app.get("/companies", requireAuth, async (c) => {
  const ports = buildPorts(c.req.raw);
  const res = await listCompanies(ports);
  return Response.json(res.body, { status: res.status });
});
