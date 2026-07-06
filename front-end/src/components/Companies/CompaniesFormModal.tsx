import React, { useState } from "react";
import { X, CircleCheckBig } from "lucide-react";

interface Empresa {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  email: string;
  status: string;
}

interface CompaniesFormModalProps {
  empresa?: Empresa | null; // Se enviado, vira modo edição, se omitido, vira cadastro
  onClose: () => void;
}

export const CompaniesFormModal = ({
  empresa = null,
  onClose,
}: CompaniesFormModalProps) => {
  const isEditMode = !!empresa;

  const [razaoSocial, setRazaoSocial] = useState(empresa?.razaoSocial ?? "");
  const [nomeFantasia, setNomeFantasia] = useState(empresa?.nomeFantasia ?? "");
  const [email, setEmail] = useState(empresa?.email ?? "");
  const [cnpj, setCnpj] = useState(empresa?.cnpj ?? "");
  const [status, setStatus] = useState(empresa?.status ?? "Ativo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      console.log("Salvando modificações:", {
        razaoSocial,
        nomeFantasia,
        email,
        cnpj,
        status,
      });
    } else {
      console.log("Cadastrando nova empresa:", {
        razaoSocial,
        nomeFantasia,
        email,
        cnpj,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-182 h-fit rounded-2xl p-8 shadow-xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold text-blue-primary">
            {isEditMode ? "Editar empresa" : "Nova empresa"}
          </h2>
          <button
            onClick={onClose}
            className="border border-gray-100 rounded-lg shadow-box-field cursor-pointer p-2 text-gray-500 hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">Razão social</label>
            <input
              type="text"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-blue rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder"
              placeholder="Digite a razão social da empresa"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">
              Nome fantasia
            </label>
            <input
              type="text"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-blue rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder"
              placeholder="Digite o nome fantasia da empresa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">E-mail</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border border-neutral-blue rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder"
                placeholder="Digite o e-mail da empresa"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full h-10 px-3 border border-neutral-blue rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder"
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>

          {isEditMode && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black">Status</label>
              <div className="grid grid-cols-2 p-1 bg-white h-10">
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
                  className={`flex items-center justify-center gap-1 text-xs font-medium rounded-r-md border border-neutral-blue transition-all cursor-pointer ${
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

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-10 w-38.25 rounded-lg border border-blue-primary text-base font-bold text-blue-primary cursor-pointer hover:bg-blue-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 h-10 w-38.25 rounded-lg bg-blue-primary text-base font-bold text-white shadow-md cursor-pointer hover:bg-blue-900 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
