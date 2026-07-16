import type { AdminPort } from "../../_shared/ports/admin.port.ts";
import type { RepoPort } from "../ports/repos.port.ts";

export interface ListUsersPorts {
  admin: AdminPort;
  repos: RepoPort;
}

export interface ServiceResponse {
  status: number;
  body: Record<string, unknown>;
}

export async function listUsers(ports: ListUsersPorts): Promise<ServiceResponse> {
  const caller = await ports.admin.me();
  if (!caller || !caller.isAdmin) {
    return { status: 403, body: { error: "Apenas administradores podem listar usuários." } };
  }

  const users = await ports.repos.listUsers();
  const ids = users.map((u) => u.id);

  const [employees, companies] = await Promise.all([
    ports.repos.findEmployeesByUserIds(ids),
    ports.repos.findCompaniesByUserIds(ids),
  ]);
  const employeeByUserId = new Map(employees.map((e) => [e.userId, e]));
  const companyByUserId = new Map(companies.map((c) => [c.userId, c]));

  const body = users.map((user) => {
    const employee = employeeByUserId.get(user.id);
    const company = companyByUserId.get(user.id);
    const role = employee
      ? { type: "employee" as const, position: employee.position, is_admin: employee.isAdmin }
      : company
      ? { type: "company" as const, cnpj: company.cnpj, phonenumber: company.phonenumber }
      : null;
    return {
      id: user.id,
      display_name: user.displayName,
      is_deleted: user.isDeleted,
      created_at: user.createdAt,
      role,
    };
  });

  return { status: 200, body: { users: body } };
}
