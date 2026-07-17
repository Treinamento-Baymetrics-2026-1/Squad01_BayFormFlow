import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { AuthPage } from "@/pages/Auth";
import { CompaniesPage } from "@/pages/Companies";
import { OverviewPage } from "@/pages/Overview";
import { SurveyPage } from "@/pages/Survey";
import { UsersPage } from "@/pages/Users";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { NewSurveyPage } from "@/pages/NewSurvey";
import { SurveyDetailsPage } from "@/pages/SurveyDetails";
import { WorkInProgressPage } from "@/pages/WorkInProgress";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />, // Todas as rotas filhas aqui dentro terão a sidebar automaticamente
        children: [
          {
            path: "*",
            element: <Navigate to="/visao-geral" replace />, //Se não existir rota, redireciona para tela inicial
          },
          {
            path: "visao-geral",
            element: <OverviewPage />,
          },
          {
            path: "pesquisas",
            element: <SurveyPage />,
          },
          {
            path: "pesquisas/nova-pesquisa",
            element: <NewSurveyPage />,
          },
          {
            path: "pesquisas/detalhes",
            element: <SurveyDetailsPage />,
          },
          {
            path: "dashboards",
            element: <WorkInProgressPage />,
          },
          {
            path: "usuarios",
            element: <UsersPage />,
          },
          {
            path: "empresas",
            element: <CompaniesPage />,
          },
          {
            path: "auditoria",
            element: <WorkInProgressPage />,
          },
          // Outras páginas que usam a sidebar entram aqui...
        ],
      },
    ],
  },
]);
