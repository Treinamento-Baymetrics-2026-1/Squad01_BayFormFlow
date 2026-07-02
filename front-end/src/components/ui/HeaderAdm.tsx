import { Bell } from "lucide-react";

export const HeaderAdm = () => {
  // receber do endpoint
  const user = {
    nome: "Ana Silva",
    funcao: "Administrador",
    iniciais: "AS",
  };

  return (
    <header className="w-full h-19 border-b border-neutral-blue px-6 flex items-center justify-end gap-6">
      <button
        type="button"
        className="text-blue-primary hover:opacity-80 transition-opacity"
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
    </header>
  );
};
