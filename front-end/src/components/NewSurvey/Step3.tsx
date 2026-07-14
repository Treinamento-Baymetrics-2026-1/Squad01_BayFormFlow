import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { SearchDropdown } from "@/components/ui/SearchDropdownSurvey";
import {
  participanteSchema,
  surveyFormSchema3,
} from "@/schema/createSurveySchema";
import { useNavigate } from "react-router-dom";

interface ParticipanteItem {
  nome: string;
  email: string;
  rm: string;
}

interface Step3Props {
  formData: {
    nomeParticipante: string;
    emailParticipante: string;
    rmParticipante: string;
    percentualMinimo: string;
    faixaEstimada: string;
  };
  updateField: (field: any, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  editingIndex: number | null;
  onCancelEdit: () => void;
  setListaParticipantes: React.Dispatch<
    React.SetStateAction<ParticipanteItem[]>
  >;
}

const PERCENTUAIS = ["10%", "50%", "100%"];

export const Step3 = ({
  formData,
  updateField,
  onBack,
  onSubmit,
  editingIndex,
  onCancelEdit,
  setListaParticipantes,
}: Step3Props) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSaveParticipante = () => {
    const validation = participanteSchema.safeParse({
      nome: formData.nomeParticipante,
      email: formData.emailParticipante,
      rm: formData.rmParticipante,
    });

    if (!validation.success) {
      setValidationError(validation.error.issues[0].message);
      return;
    }

    const novoParticipante = {
      nome: formData.nomeParticipante,
      email: formData.emailParticipante,
      rm: formData.rmParticipante,
    };

    setListaParticipantes((prev) => {
      if (editingIndex !== null) {
        return prev.map((item, idx) =>
          idx === editingIndex ? novoParticipante : item,
        );
      }
      return [...prev, novoParticipante];
    });

    onCancelEdit();
  };

  const handleFinalSubmit = () => {
    setValidationError(null);

    const result = surveyFormSchema3.safeParse(formData);

    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    onSubmit();
    navigate("/pesquisas/detalhes");
  };

  const isEditing = editingIndex !== null;

  return (
    <div className="w-full flex flex-col flex-1 justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-blue-primary">
            Participantes
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-sm text-blue-500 hover:underline bg-transparent border-none cursor-pointer"
            >
              Cancelar edição
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-xl bg-white shadow-box-field">
          <div className="flex flex-col p-5 gap-4">
            <span className="text-sm font-bold text-black -mb-1">
              {isEditing ? (
                <>
                  Editar participante:{" "}
                  <strong className="text-[#005B94]">
                    {formData.nomeParticipante}
                  </strong>
                </>
              ) : (
                "Adicionar participantes (opcional)"
              )}
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Nome
              </label>
              <input
                type="text"
                value={formData.nomeParticipante}
                onChange={(e) =>
                  updateField("nomeParticipante", e.target.value)
                }
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none"
                placeholder="Digite o nome do participante"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.emailParticipante}
                  onChange={(e) =>
                    updateField("emailParticipante", e.target.value)
                  }
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none"
                  placeholder="Digite o e-mail do participante"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  RM
                </label>
                <input
                  type="text"
                  value={formData.rmParticipante}
                  onChange={(e) =>
                    updateField("rmParticipante", e.target.value)
                  }
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none"
                  placeholder="Digite o RM do participante"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveParticipante}
            className="w-full h-10 rounded-b-lg bg-[#0066b2] text-base font-bold text-white flex items-center justify-center gap-1 hover:bg-[#005596] transition-colors mt-2"
          >
            {isEditing ? (
              "Salvar alterações"
            ) : (
              <>
                <Plus size={16} /> Adicionar
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Percentual mínimo de participação (opcional)
          </label>
          <SearchDropdown
            options={PERCENTUAIS}
            placeholder="Selecione o percentual mínimo de participação"
            searchPlaceholder="Buscar percentual"
            value={formData.percentualMinimo}
            onChange={(val) => updateField("percentualMinimo", val)}
            showSearch={false}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-semibold text-black">
            Faixa estimada de participantes
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Pequeno", desc: "Até 20" },
              { label: "Médio", desc: "21-100" },
              { label: "Alto", desc: "101-199" },
              { label: "Amplo", desc: "200+" },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => updateField("faixaEstimada", item.label)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all ${
                  formData.faixaEstimada === item.label
                    ? "border-neutral-blue"
                    : "border-gray-light-secondary bg-white hover:bg-gray-light-placeholder"
                }`}
              >
                <span className="text-sm font-semibold text-black">
                  {item.label}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-feedback-error bg-feedback-error-light text-feedback-error text-sm font-medium animate-fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="px-6 h-10 w-38.25 rounded-lg border border-blue-primary text-sm font-bold text-blue-primary hover:bg-gray-50"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="px-6 h-10 w-38.25 rounded-lg bg-blue-primary text-base font-bold text-white hover:cursor-pointer"
          >
            Criar pesquisa
          </button>
        </div>
      </div>
    </div>
  );
};
