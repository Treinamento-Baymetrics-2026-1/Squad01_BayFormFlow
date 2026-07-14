export interface CallerIdentity {
  userId: string;
  isAdmin: boolean;
}

export interface AdminPort {
  me(): Promise<CallerIdentity | null>;
}
