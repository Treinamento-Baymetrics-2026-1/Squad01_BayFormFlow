import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { AuthPage } from '@/pages/Auth';
import { CompaniesPage } from '@/pages/Companies';
import { OverviewPage } from '@/pages/Overview';
import { SurveyPage } from '@/pages/Survey';
import { UsersPage } from '@/pages/Users';
import { createBrowserRouter } from 'react-router-dom';


export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <AdminLayout />, // Todas as rotas filhas aqui dentro terão a sidebar automaticamente
    children: [
      {
        path: 'visao-geral',
        element: <OverviewPage />,
      },
      {
        path: 'pesquisas',
        element: <SurveyPage />,
      },
      {
        path: 'usuarios',
        element: <UsersPage />,
      },
      {
        path: 'empresas',
        element: <CompaniesPage />,
      },
      // Outras páginas que usam a sidebar entram aqui...
    ],
  },
]);