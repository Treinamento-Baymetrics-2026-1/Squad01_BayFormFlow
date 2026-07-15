import type { AdminPort } from "../../_shared/ports/admin.port.ts";
import type { RepoPort } from "../ports/repos.port.ts";

export interface ListCompaniesPorts {
  admin: AdminPort;
  repos: RepoPort;
}

export interface ServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

export async function listCompanies(ports: ListCompaniesPorts): Promise<ServiceResponse> {
  const caller = await ports.admin.me();
  if (!caller || !caller.isAdmin) {
    return { status: 403, body: { error: "Apenas administradores podem listar empresas." } };
  }

  const companies = await ports.repos.listCompanies();
  const users = await ports.repos.findUsersByIds(companies.map((c) => c.userId));
  const userById = new Map(users.map((u) => [u.id, u]));

  const body = companies.map((company) => {
    const user = userById.get(company.userId);
    return {
      id: company.id,
      user_id: company.userId,
      cnpj: company.cnpj,
      phonenumber: company.phonenumber,
      display_name: user?.displayName ?? null,
      is_deleted: user?.isDeleted ?? null,
      created_at: user?.createdAt ?? null,
    };
  });

  return { status: 200, body: { companies: body } };
}
