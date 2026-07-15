
export type EmployeePosition = "Gestor" | "Validador";

export interface NewUserRow {
  id: string;
  displayName: string;
  createdBy: string;
}

export interface NewEmployeeRow {
  userId: string;
  position: EmployeePosition;
  isAdmin: boolean;
}

export interface NewCompanyRow {
  userId: string;
  cnpj: string;
  phonenumber: string;
}

export interface WriteResult {
  ok: boolean;
  error?: string;
}

export interface InsertWithIdResult {
  ok: boolean;
  id?: number;
  error?: string;
}

export interface UserRow {
  id: string;
  displayName: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface CompanyRow {
  id: number;
  userId: string;
  cnpj: string;
  phonenumber: string;
}

export interface EmployeeRoleRow {
  userId: string;
  position: EmployeePosition;
  isAdmin: boolean;
}

export interface CompanyRoleRow {
  userId: string;
  cnpj: string;
  phonenumber: string;
}

export interface RepoPort {
  insertUser(row: NewUserRow): Promise<WriteResult>;
  deleteUserHard(userId: string): Promise<WriteResult>;
  insertEmployee(row: NewEmployeeRow): Promise<InsertWithIdResult>;
  insertCompany(row: NewCompanyRow): Promise<InsertWithIdResult>;
  listUsers(): Promise<UserRow[]>;
  listCompanies(): Promise<CompanyRow[]>;
  findUsersByIds(ids: string[]): Promise<UserRow[]>;
  findEmployeesByUserIds(ids: string[]): Promise<EmployeeRoleRow[]>;
  findCompaniesByUserIds(ids: string[]): Promise<CompanyRoleRow[]>;
}
