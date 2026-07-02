import {
  Home,
  FileText,
  ChartColumnBig,
  Users,
  Building2,
  ShieldCheck,
  PanelLeftClose,
} from "lucide-react";
import LogoSidebarDashboard from "@/assets/logos/LogoSidebarDashboard.svg";
import LogoSidebarClosed from "@/assets/logos/LogoSidebarClosed.svg";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const SidebarDefaultAdm = ({
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuPrincipal = [
    { nome: "Visão geral", icone: Home, page: "/visao-geral" },
    { nome: "Pesquisas", icone: FileText, page: "/pesquisas" },
    { nome: "Dashboards", icone: ChartColumnBig, page: "/dashboards" },
  ];

  const menuAdministracao = [
    { nome: "Usuários", icone: Users, page: "/usuarios" },
    { nome: "Empresas", icone: Building2, page: "/empresas" },
    { nome: "Auditoria", icone: ShieldCheck, page: "/auditoria" },
  ];

  const handleNavigation = (page: string) => {
    navigate(page);
  };

  return (
    <div
      className={`shrink-0 bg-blue-light-secondary border-r border-neutral-blue p-4 flex flex-col justify-between transition-all duration-300 rounded-tr-2xl rounded-br-2xl shadow-sidebar-default ${
        isCollapsed ? "w-19.5" : "w-76"
      }`}
    >
      <div>
        <div
          className={`flex items-center mb-8 px-2 ${isCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-1">
              <img
                src={LogoSidebarDashboard}
                alt="Logo Bay Form Flow"
                className="h-auto max-w-full"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Expandir menu"
            >
              <img
                src={LogoSidebarClosed}
                alt="Logo Bay Form Flow"
                className="h-auto max-w-full"
              />
            </button>
          )}

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="cursor-pointer mt-1"
            >
              <PanelLeftClose className="w-9 h-9" strokeWidth={1} />
            </button>
          )}
        </div>
        <div className="mb-6">
          {!isCollapsed && (
            <p className="text-xs font-extrabold text-blue-primary uppercase tracking-wider px-3 mb-2 whitespace-nowrap">
              Principal
            </p>
          )}
          <nav className="space-y-1">
            {menuPrincipal.map((item, index) => {
              const Icone = item.icone;
              // pathname igual rota, destaque ativo
              const isActive = location.pathname === item.page;

              return (
                <button
                  key={index}
                  type="button"
                  title={item.nome}
                  onClick={() => handleNavigation(item.page)}
                  className={`w-full flex items-center gap-3 rounded-lg text-base font-normal transition-colors cursor-pointer ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2"} ${
                    isActive ? "bg-blue-primary text-white" : "text-black"
                  }`}
                >
                  <Icone className="w-4.5 h-4.5 shrink-0" />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{item.nome}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div>
          {!isCollapsed && (
            <p className="text-xs font-extrabold text-blue-primary uppercase tracking-wider px-3 mb-2 whitespace-nowrap">
              Administração
            </p>
          )}
          <nav className="space-y-1">
            {menuAdministracao.map((item, index) => {
              const Icone = item.icone;
              // mesma validação para a seção de administração
              const isActive = location.pathname === item.page;
              return (
                <button
                  key={index}
                  type="button"
                  title={item.nome}
                  onClick={() => handleNavigation(item.page)}
                  className={`w-full flex items-center gap-3 rounded-lg text-base font-normal transition-colors cursor-pointer ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2"} ${
                    isActive ? "bg-blue-primary text-white" : "text-black"
                  }`}
                >
                  <Icone className="w-4.4 h-4.5 shrink-0" />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{item.nome}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
