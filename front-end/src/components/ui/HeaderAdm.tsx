import { Bell, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const HeaderAdm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const hasBreadcrumb = pathnames.length > 1;

  const user = {
    nome: "Ana Silva",
    funcao: "Administrador",
    iniciais: "AS",
  };

  const formatText = (text: string) => {
    const decamelized = text.replace(/([A-Z])/g, " $1").trim();
    const formatted = decamelized.replace(/[-_]/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  };

  const handleNavigate = (index: number) => {
    const targetPath = "/" + pathnames.slice(0, index + 1).join("/");
    navigate(targetPath);
  };

  return (
    <header className="w-full h-19 border-b border-neutral-blue px-6 flex items-center justify-between">
      <div className="flex items-center">
        {hasBreadcrumb ? (
          <nav className="flex items-center ml-6 gap-2 text-sm">
            <span
              onClick={() => handleNavigate(0)}
              className="text-gray-placeholder font-normal text-base cursor-pointer hover:text-black transition-colors"
            >
              {formatText(pathnames[0])}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-placeholder" />
            <span
              onClick={() => handleNavigate(1)}
              className="text-black font-normal text-base cursor-pointer hover:opacity-80 transition-opacity"
            >
              {formatText(pathnames[1])}
            </span>
          </nav>
        ) : (
          <div />
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          type="button"
          className="text-blue-primary hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-primary flex items-center justify-center text-white font-bold text-sm">
            {user.iniciais}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-black leading-tight">
              {user.nome}
            </span>
            <span className="text-xs text-gray-placeholder leading-none">
              {user.funcao}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
