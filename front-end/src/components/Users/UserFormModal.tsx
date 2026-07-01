import React, { useState } from "react";
import { X, CircleCheckBig, ChevronDown } from "lucide-react";

interface Usuario {
  nome: string;
  email: string;
  perfil: string;
  status: string;
  termo: string;
}

interface UserFormModalProps {
  usuario?: Usuario | null; // Se enviado, vira modo edição. Se omitido, vira cadastro.
  onClose: () => void;
}

export const UserFormModal = ({
  usuario = null,
  onClose,
}: UserFormModalProps) => {
  // Identifica dinamicamente se é o modo de edição
  const isEditMode = !!usuario;

  // Estados iniciais baseados no modo (Edição ou Cadastro)
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [perfil, setPerfil] = useState(usuario?.perfil ?? "");
  const [status, setStatus] = useState(usuario?.status ?? "Ativo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      console.log("Salvando modificações:", { nome, email, perfil, status });
    } else {
      console.log("Cadastrando novo usuário:", { nome, email, perfil });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-182 h-fit rounded-2xl p-8 shadow-xl relative animate-in fade-in zoom-in duration-200">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold text-blue-primary mb-6">
            {isEditMode ? "Editar usuário" : "Novo usuário"}
          </h2>
          <button
            onClick={onClose}
            className="border border-gray-light-placeholder-secondary rounded-lg shadow-box-field cursor-pointer mb-6 p-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário Compartilhado */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Nome completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Nome completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full h-9 px-3 border border-neutral-blue rounded-md text-sm text-black shadow-box-field "
              placeholder="Digite o nome completo do usuário"
            />
          </div>

          {/* E-mail e Perfil lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 border border-neutral-blue rounded-md text-sm text-black shadow-box-field"
                placeholder="Digite o e-mail do usuário"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Perfil
              </label>

              {/* container Relativo */}
              <div className="relative w-full">
                <select
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value)}
                  className={`w-full h-9 pl-3 pr-10 border border-neutral-blue  rounded-md text-sm bg-white shadow-box-field appearance-none ${
                    perfil === "" ? "text-gray-placeholder" : "text-black"
                  }`}
                >
                  <option value="" disabled hidden>
                    Selecione o perfil do usuário
                  </option>
                  <option value="Administrador" className="text-black">
                    Administrador
                  </option>
                  <option value="Gestor Interno" className="text-black">
                    Gestor interno
                  </option>
                  <option value="Validador Operacional" className="text-black">
                    Validador operacional
                  </option>
                  <option value="Solicitante" className="text-black">
                    Solicitante
                  </option>
                </select>

                {/* Ícone */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* renderiza se for Modo Edição */}
          {isEditMode && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <div className="grid grid-cols-2 p-1 bg-white h-9">
                <button
                  type="button"
                  onClick={() => setStatus("Ativo")}
                  className={`flex items-center justify-center gap-1 text-xs font-medium rounded-l-md border border-r-0 border-neutral-blue transition-all cursor-pointer ${
                    status === "Ativo"
                      ? "bg-status-active-light text-status-active shadow-box-field"
                      : "text-black"
                  }`}
                >
                  {status === "Ativo" && <CircleCheckBig size={14} />}
                  Ativo
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("Inativo")}
                  className={`flex items-center justify-center gap-1 text-xs font-medium rounded-r-md border border-neutral-blue  transition-all cursor-pointer ${
                    status === "Inativo"
                      ? "bg-neutral-blue text-status-disabled shadow-box-field"
                      : "text-black"
                  }`}
                >
                  {status === "Inativo" && <CircleCheckBig size={14} />}
                  Inativo
                </button>
              </div>
            </div>
          )}

          {/* Botões do Rodapé */}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-9 w-38.25 rounded-md border border-blue-primary text-base font-bold text-blue-primary cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 h-9 w-38.25 rounded-md bg-blue-primary text-base font-bold text-white shadow-md cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
