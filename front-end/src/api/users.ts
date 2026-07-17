import { supabase } from "./supabase";

// estrutura que vem da api
interface SupabaseUser {
  id: string;
  display_name: string;
  is_deleted: boolean;
  created_at: string;
  email?: string;
  role: {
    type: string;
    position: string;
    is_admin: boolean;
  };
}

// o que a função vai retornar
interface GetUsersResponse {
  users: SupabaseUser[];
}

export const getUsersEdgeFunction = async (): Promise<GetUsersResponse> => {
  // função nativa do supabase para rota
  const { data, error } = await supabase.functions.invoke<GetUsersResponse>('auth/users', {
    method: 'GET',
    //cabeçalho de autorização automatico
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    users: data?.users || [],
  };
};