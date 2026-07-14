
export interface NewFormRow {
  displayName: string;
  formsDescription: string;
  periodStart: string;
  periodEnd: string;
  participantTarget: number;
  researchId: number;
  createdBy: string;
}

export interface NewFormVersionRow {
  formId: string;
  form: Record<string, unknown>;
  versionName: string;
  createdBy: string;
}

export type InsertResult =
  | { ok: true; id?: string }
  | { ok: false; kind: "constraint" | "unknown"; error: string };

export interface WriteResult {
  ok: boolean;
  error?: string;
}

export interface FormsRepoPort {
  researchExists(researchId: number): Promise<boolean>;
  isResearchManager(callerUserId: string, researchId: number): Promise<boolean>;
  insertForm(row: NewFormRow): Promise<InsertResult>;
  insertFormVersion(row: NewFormVersionRow): Promise<InsertResult>;
  deleteFormHard(formId: string): Promise<WriteResult>;
}
