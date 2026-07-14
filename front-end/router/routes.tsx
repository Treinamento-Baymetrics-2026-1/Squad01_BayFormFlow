import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { AuthPage } from "@/pages/Auth";
import { CompaniesPage } from "@/pages/Companies";
import { OverviewPage } from "@/pages/Overview";
import { SurveyPage } from "@/pages/Survey";
import { UsersPage } from "@/pages/Users";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { NewSurveyPage } from "@/pages/NewSurvey";
import { SurveyDetailsPage } from "@/pages/SurveyDetails";

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
            path: "visao-geral",
            element: <OverviewPage />,
          },
          {
            path: "pesquisas",
            element: <SurveyPage />,
          },
          {
            path: "pesquisas/novapesquisa",
            element: <NewSurveyPage />,
          },
          {
            path: "pesquisas/detalhes",
            element: <SurveyDetailsPage />,
          },
          {
            path: "usuarios",
            element: <UsersPage />,
          },
          {
            path: "empresas",
            element: <CompaniesPage />,
          },
          // Outras páginas que usam a sidebar entram aqui...
        ],
      },
    ],
  },
]);
