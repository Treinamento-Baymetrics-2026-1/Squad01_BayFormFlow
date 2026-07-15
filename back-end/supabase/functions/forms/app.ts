import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { requireAuth } from "../_shared/require-auth.middleware.ts";
import { createFormSchema } from "./schemas/create-form.schema.ts";
import { listFormsQuerySchema } from "./schemas/list-forms.schema.ts";
import { createFormController, listFormsController } from "./controllers/forms.controller.ts";

export const app = new Hono().basePath("/forms");

app.use(
  "*",
  cors({
    origin: "http://127.0.0.1:3000",
    allowHeaders: ["authorization", "x-client-info", "apikey", "content-type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.post("/", requireAuth, zValidator("json", createFormSchema), (c) => {
  return createFormController(c, c.req.valid("json"));
});

app.get("/", requireAuth, zValidator("query", listFormsQuerySchema), (c) => {
  return listFormsController(c, c.req.valid("query"));
});
