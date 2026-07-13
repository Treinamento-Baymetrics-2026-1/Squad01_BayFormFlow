
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

export interface ResearchesRepoPort {
  companyExists(companyId: number): Promise<boolean>;
  insertResearch(row: NewResearchRow): Promise<InsertResearchResult>;
}
