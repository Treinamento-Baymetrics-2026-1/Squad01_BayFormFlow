
export interface CreatedAuthUser {
  id: string;
}

export type CreateUserError =
  | { kind: "email_exists" }
  | { kind: "unknown"; message: string };

export type CreateUserResult =
  | { ok: true; user: CreatedAuthUser }
  | { ok: false; error: CreateUserError };

export interface DeleteResult {
  ok: boolean;
  error?: string;
}

export interface AuthPort {
  createUser(
    input: { email: string; password: string },
  ): Promise<CreateUserResult>;
  deleteUser(userId: string): Promise<DeleteResult>;
}
