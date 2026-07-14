
export type EmployeePosition = "Gestor" | "Validador";

export interface NewResearchRow {
  displayName: string;
  researchDescription?: string;
  periodStart: string;
  periodEnd: string;
  companyId: number;
  createdBy: string;
}

export type InsertResearchResult =
  | { ok: true; id?: number }
  | { ok: false; kind: "constraint" | "unknown"; error: string };

export interface EmployeeRow {
  id: number;
  position: EmployeePosition;
}

export interface WriteResult {
  ok: boolean;
  error?: string;
}

export interface ResearchesRepoPort {
  companyExists(companyId: number): Promise<boolean>;
  insertResearch(row: NewResearchRow): Promise<InsertResearchResult>;
  findEmployeesByIds(ids: number[]): Promise<EmployeeRow[]>;
  assignEmployeesToResearch(
    researchId: number,
    employeeIds: number[],
    createdBy: string,
  ): Promise<WriteResult>;
  deleteResearchHard(researchId: number): Promise<WriteResult>;
}
