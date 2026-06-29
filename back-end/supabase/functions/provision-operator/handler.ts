import { z } from "npm:zod";

interface SupabaseResult<T = unknown> {
  data: T;
  error: { message: string } | null;
}

export interface CallerClient {
  rpc(
    fn: string,
    params?: Record<string, unknown>,
  ): PromiseLike<SupabaseResult>;
}

export interface AdminClient {
  auth: {
    admin: {
      createUser(attrs: {
        email: string;
        password: string;
        email_confirm: boolean;
      }): PromiseLike<SupabaseResult<{ user: { id: string } | null } | null>>;
      deleteUser(id: string): PromiseLike<SupabaseResult>;
    };
  };
  rpc(
    fn: string,
    params?: Record<string, unknown>,
  ): PromiseLike<SupabaseResult>;
}

export interface ProvisionDeps {
  caller: CallerClient;
  admin: AdminClient;
}

export const provisionInputSchema = z
  .object({
    name: z.string().min(1).max(120),
    email: z.string().email(),
    password: z.string().min(8),
    position: z.enum(["validador", "gestor"]),
    is_admin: z.boolean().optional(),
  })
  .refine((d) => !d.is_admin || d.position === "gestor", {
    message: "is_admin só é permitido quando position = 'gestor'.",
    path: ["is_admin"],
  });

export type ProvisionInput = z.infer<typeof provisionInputSchema>;

interface MeResult {
  user_id?: string;
  is_admin?: boolean;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleProvisionOperator(req: Request, deps: ProvisionDeps): Promise<Response> {
  const { data: meData, error: meError } = await deps.caller.rpc("me");
  if (meError || !meData) {
    return json({ error: "Não autorizado." }, 403);
  }
  const me = meData as MeResult;
  if (me.is_admin !== true || !me.user_id) {
    return json(
      { error: "Apenas administradores podem provisionar operadores." },
      403,
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return json(
      { error: "Corpo da requisição inválido (JSON esperado)." },
      400,
    );
  }
  const parsed = provisionInputSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json({ error: "Entrada inválida.", issues: parsed.error.issues }, 400);
  }
  const input = parsed.data;

  const { data: created, error: createError } =
    await deps.admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
    });
  if (createError || !created?.user) {
    return json(
      { error: "Falha ao criar usuário no Auth.", detail: createError?.message },
      400,
    );
  }
  const newUserId = created.user.id;

  const { data: rpcData, error: rpcError } = await deps.admin.rpc(
    "provision_operator",
    {
      p_user_id: newUserId,
      p_display_name: input.display_name,
      p_position: input.position,
      p_is_admin: input.is_admin ?? false,
      p_created_by: me.user_id,
    },
  );

  if (rpcError) {
    await deps.admin.auth.admin.deleteUser(newUserId);
    return json(
      { error: "Falha ao provisionar operador.", detail: rpcError.message },
      500,
    );
  }

  return json({ data: rpcData, user_id: newUserId }, 201);
}
