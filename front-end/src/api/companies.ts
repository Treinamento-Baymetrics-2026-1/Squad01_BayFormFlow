import { supabase } from "./supabase";

// estrutura que vem da api
interface SupabaseCompany {
  id: number;
  user_id: string;
  cnpj: string;
  phonenumber: string;
  display_name: string;
  is_deleted: boolean;
  created_at: string;
}

// o que a função vai retornar
interface GetCompaniesResponse {
  companies: SupabaseCompany[];
}

export const getCompaniesEdgeFunction = async (): Promise<GetCompaniesResponse> => {
  // função nativa do supabase para rota
  const { data, error } = await supabase.functions.invoke<GetCompaniesResponse>('auth/companies', {
    method: 'GET',
    //cabeçalho de autorização automatico
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    companies: data?.companies || [],
  };
};