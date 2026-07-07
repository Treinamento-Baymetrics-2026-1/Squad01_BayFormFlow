// src/api/auth.ts
import { supabase } from "./supabase";

//o que a função recebe
interface LoginParams {
  email: string;
  password:  string;
}

//o que a função vai retornar
interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const loginEdgeFunction = async ({ email, password }: LoginParams): Promise<LoginResponse> => {
  //funçao nativa já sabe exatamente qual url do endpoint
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // o data.session já tem o access_token e o refresh_token
  return {
    access_token: data.session?.access_token || '',
    refresh_token: data.session?.refresh_token || '',
  };
};