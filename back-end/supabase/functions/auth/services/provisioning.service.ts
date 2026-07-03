import type { AdminPort } from "../ports/admin.port.ts";
import type { AuthPort } from "../ports/auth.port.ts";
import type { InsertWithIdResult, RepoPort } from "../ports/repos.port.ts";

export interface ProvisioningPorts {
  admin: AdminPort;
  auth: AuthPort;
  repos: RepoPort;
}

export interface ServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

export interface PrincipalInput {
  display_name: string;
  email: string;
  password: string;
}

export interface ProvisionRequest {
  principal: PrincipalInput;
  insertSubtype: (userId: string) => Promise<InsertWithIdResult>;
  subtypeIdKey: "employee_id" | "company_id";
}

export async function provision(
  ports: ProvisioningPorts,
  req: ProvisionRequest,
): Promise<ServiceResponse> {
  const caller = await ports.admin.me();
  if (!caller || !caller.isAdmin) {
    return {
      status: 403,
      body: { error: "Apenas administradores podem provisionar operadores." },
    };
  }

  const created = await ports.auth.createUser({
    email: req.principal.email,
    password: req.principal.password,
  });
  if (!created.ok) {
    if (created.error.kind === "email_exists") {
      return { status: 409, body: { error: "E-mail já cadastrado." } };
    }
    return {
      status: 400,
      body: { error: "Falha ao criar usuário no Auth.", detail: created.error.message },
    };
  }
  const userId = created.user.id;

  const userInsert = await ports.repos.insertUser({
    id: userId,
    displayName: req.principal.display_name,
    createdBy: caller.userId,
  });
  if (!userInsert.ok) {
    await undoAuthUser(ports, userId);
    return {
      status: 500,
      body: { error: "Falha ao registrar usuário.", detail: userInsert.error },
    };
  }

  const subtype = await req.insertSubtype(userId);
  if (!subtype.ok) {
    await undoUserRow(ports, userId);
    await undoAuthUser(ports, userId);
    return {
      status: 500,
      body: { error: "Falha ao registrar o cadastro.", detail: subtype.error },
    };
  }

  return { status: 201, body: { user_id: userId, [req.subtypeIdKey]: subtype.id } };
}


async function undoAuthUser(ports: ProvisioningPorts, userId: string): Promise<void> {
  const del = await ports.auth.deleteUser(userId);
  if (!del.ok) {
    console.error(
      `[auth][ROLLBACK FALHOU] Identidade ÓRFÃ no Auth. userId=${userId}. ` +
        `Remova manualmente. Causa: ${del.error ?? "desconhecida"}`,
    );
  }
}

async function undoUserRow(ports: ProvisioningPorts, userId: string): Promise<void> {
  const del = await ports.repos.deleteUserHard(userId);
  if (!del.ok) {
    console.error(
      `[auth][ROLLBACK FALHOU] Linha ÓRFÃ em logins.t_users. userId=${userId}. ` +
        `Remova manualmente. Causa: ${del.error ?? "desconhecida"}`,
    );
  }
}
