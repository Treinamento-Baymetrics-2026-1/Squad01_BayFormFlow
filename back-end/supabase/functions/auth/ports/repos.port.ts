
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

export interface RepoPort {
  insertUser(row: NewUserRow): Promise<WriteResult>;
  deleteUserHard(userId: string): Promise<WriteResult>;
  insertEmployee(row: NewEmployeeRow): Promise<InsertWithIdResult>;
  insertCompany(row: NewCompanyRow): Promise<InsertWithIdResult>;
}
