import { useEffect } from "react";
import { X, CircleCheckBig, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companiesFormSchema } from "@/schema/companiesFormSchema";
import type { CompaniesFormData } from "@/schema/companiesFormSchema";

interface Empresa {
  razaoSocial: string;
  nomeFantasia: string;
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CompaniesFormData>({
    resolver: zodResolver(companiesFormSchema),
    defaultValues: {
      razaoSocial: empresa?.razaoSocial ?? "",
      nomeFantasia: empresa?.nomeFantasia ?? "",
      email: empresa?.email ?? "",
      cnpj: empresa?.cnpj ?? "",
      status: (empresa?.status as "Ativo" | "Inativo") ?? "Ativo",
    },
  });

  // alterações de status para estilizar o botão customizado
  const currentStatus = watch("status");

  // altera campos do form quando abrir em modo edição ou resetar para add (reset)
  useEffect(() => {
    if (empresa) {
      reset({
        razaoSocial: empresa.razaoSocial,
        nomeFantasia: empresa.nomeFantasia,
        email: empresa.email,
        cnpj: empresa.cnpj,
        status: empresa.status as "Ativo" | "Inativo",
      });
    } else {
      reset({
        razaoSocial: "",
        nomeFantasia: "", 
        email: "",
        cnpj: "",
        status: "Ativo",
      });
    }
  }, [empresa, reset]);

  const onSubmit = (data: CompaniesFormData) => {
    if (isEditMode) {
      // eslint-disable-next-line no-console
      console.log("Salvando modificações:", data);
    } else {
      // eslint-disable-next-line no-console
      console.log("Cadastrando nova empresa:", data);
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
            type="button"
            onClick={onClose}
            className="border border-gray-100 rounded-lg shadow-box-field cursor-pointer p-2 text-gray-500 hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="grid gap-4">
            {/* Razão social */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black">Razão social</label>
              <input
                type="text"
                className={`w-full h-10 px-3 border rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder ${
                  errors.razaoSocial ? "border-feedback-error" : "border-neutral-blue"
                }`}
                placeholder="Digite a razão social"
                {...register("razaoSocial")}
              />
              {errors.razaoSocial && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                  <TriangleAlert size={14} />
                  {errors.razaoSocial.message}
                </span>
              )}
            </div>

            {/* Nome fantasia */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black">Nome fantasia</label>
              <input
                type="text"
                className={`w-full h-10 px-3 border rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder ${
                  errors.nomeFantasia ? "border-feedback-error" : "border-neutral-blue"
                }`}
                placeholder="Digite o nome fantasia"
                {...register("nomeFantasia")}
              />
              {errors.nomeFantasia && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                  <TriangleAlert size={14} />
                  {errors.nomeFantasia.message}
                </span>
              )}
            </div>
          </div>

          {/* E-mail e CNPJ lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black">E-mail</label>
              <input
                type="email"
                className={`w-full h-10 px-3 border rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder ${
                  errors.email ? "border-feedback-error" : "border-neutral-blue"
                }`}
                placeholder="Digite o e-mail da empresa"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                  <TriangleAlert size={14} />
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* CNPJ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black">CNPJ</label>
              <input
                type="text"
                className={`w-full h-10 px-3 border rounded-lg text-sm text-black shadow-box-field focus:outline-none placeholder:text-gray-placeholder ${
                  errors.cnpj ? "border-feedback-error" : "border-neutral-blue"
                }`}
                placeholder="00.000.000/0000-00"
                {...register("cnpj")}
              />
              {errors.cnpj && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                  <TriangleAlert size={14} />
                  {errors.cnpj.message}
                </span>
              )}
            </div>
          </div>

          {/* Modo Edição: Status */}
          {isEditMode && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-black">Status</label>
              <div className="grid grid-cols-2 p-1 bg-white h-10">
                <button
                  type="button"
                  onClick={() => setValue("status", "Ativo")}
                  className={`flex items-center justify-center gap-1 text-xs font-medium rounded-l-md border border-r-0 border-neutral-blue transition-all cursor-pointer ${
                    currentStatus === "Ativo"
                      ? "bg-status-active-light text-status-active shadow-box-field"
                      : "text-black"
                  }`}
                >
                  {currentStatus === "Ativo" && <CircleCheckBig size={14} />}
                  Ativo
                </button>

                <button
                  type="button"
                  onClick={() => setValue("status", "Inativo")}
                  className={`flex items-center justify-center gap-1 text-xs font-medium rounded-r-md border border-neutral-blue transition-all cursor-pointer ${
                    currentStatus === "Inativo"
                      ? "bg-neutral-blue text-status-disabled shadow-box-field"
                      : "text-black"
                  }`}
                >
                  {currentStatus === "Inativo" && <CircleCheckBig size={14} />}
                  Inativo
                </button>
              </div>
            </div>
          )}

          {/* Botões do Rodapé */}
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