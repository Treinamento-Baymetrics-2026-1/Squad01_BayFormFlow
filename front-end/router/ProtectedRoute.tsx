import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/api/supabase';
import { useEffect, useState } from 'react';

export const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      //sessão atual guardada pelo supabase
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center">Carregando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};