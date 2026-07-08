import { useEffect } from "react";
import { X, CircleCheckBig, ChevronDown, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/schema/userFormSchema";
import type { UserFormData } from "@/schema/userFormSchema";

interface Usuario {
  nome: string;
  email: string;
  perfil: string;
  status: string;
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: usuario?.nome ?? "",
      email: usuario?.email ?? "",
      perfil: usuario?.perfil ?? "",
      status: (usuario?.status as "Ativo" | "Inativo") ?? "Ativo",
    },
  });

  // alterações de status para estilizar o botão customizado
  const currentStatus = watch("status");

  // altera campos do form quando abrir em modo edição ou resetar para add (reset)
  useEffect(() => {
    if (usuario) {
      reset({
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        status: usuario.status as "Ativo" | "Inativo",
      });
    } else {
      //se for null, deixa o form vazio
      reset({
        nome: "",
        email: "",
        perfil: "",
        status: "Ativo",
      });
    }
  }, [usuario, reset]);

  const onSubmit = (data: UserFormData) => {
    if (isEditMode) {
      console.log("Salvando modificações:", data);
    } else {
      console.log("Cadastrando novo usuário:", data);
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
            type="button"
            onClick={onClose}
            className="border border-gray-light-placeholder-secondary rounded-lg shadow-box-field cursor-pointer mb-6 p-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário Compartilhado */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Nome completo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Nome completo
            </label>
            <input
              type="text"
              className={`w-full h-9 px-3 border rounded-md text-sm text-black shadow-box-field ${
                errors.nome ? "border-feedback-error" : "border-neutral-blue"
              }`}
              placeholder="Digite o nome completo do usuário"
              {...register("nome")}
            />
            {errors.nome && (
              <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                <TriangleAlert size={14} />
                {errors.nome.message}
              </span>
            )}
          </div>

          {/* E-mail e Perfil lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <input
                type="email"
                className={`w-full h-9 px-3 border rounded-md text-sm text-black shadow-box-field ${
                  errors.email ? "border-feedback-error" : "border-neutral-blue"
                }`}
                placeholder="Digite o e-mail do usuário"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                  <TriangleAlert size={14} />
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Perfil */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Perfil
              </label>
              <div className="relative w-full">
                <select
                  defaultValue=""
                  className={`w-full h-9 pl-3 pr-10 border rounded-md text-sm bg-white shadow-box-field appearance-none ${
                    errors.perfil
                      ? "border-feedback-error"
                      : "border-neutral-blue"
                  }`}
                  {...register("perfil")}
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

                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
              {errors.perfil && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1">
                  <TriangleAlert size={14} />
                  {errors.perfil.message}
                </span>
              )}
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
