import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { SearchDropdown } from "@/components/ui/SearchDropdownSurvey";
import { surveyFormSchema2 } from "@/schema/createSurveySchema";

interface Step2Props {
  subStepConfig: number;
  formData: {
    empresa: string;
    gestor: string;
    validador: string;
  };
  gestoresConfig: string[];
  setGestoresConfig: React.Dispatch<React.SetStateAction<string[]>>;
  validadoresConfig: string[];
  setValidadoresConfig: React.Dispatch<React.SetStateAction<string[]>>;
  updateField: (field: keyof Step2Props["formData"], value: string) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
  listaResponsaveis: string[];
  listaValidadores: string[];
}

const LISTA_EMPRESAS = [
  "Tech Corp",
  "Grupo Delta",
  "Industria Alfa",
  "Construtora BV",
  "Metalúrgica SR",
  "Construtora MVM",
];

export const Step2 = ({
  subStepConfig,
  formData,
  gestoresConfig,
  setGestoresConfig,
  validadoresConfig,
  setValidadoresConfig,
  updateField,
  onNext,
  onBack,
  listaResponsaveis,
  listaValidadores,
}: Step2Props) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = surveyFormSchema2.safeParse(formData);

    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    onNext(e);
  };

  return subStepConfig === 1 ? (
    <form
      className="flex flex-col gap-5 flex-1 justify-between"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-medium text-blue-primary mb-1">
          Responsáveis
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Empresa solicitante
          </label>
          <SearchDropdown
            options={LISTA_EMPRESAS}
            placeholder="Selecione a empresa solicitante"
            searchPlaceholder="Buscar empresa"
            value={formData.empresa}
            onChange={(val) => updateField("empresa", val)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Gestores responsáveis
          </label>
          <SearchDropdown
            options={listaResponsaveis}
            placeholder="Selecione o gestor responsável"
            searchPlaceholder="Buscar um gestor interno"
            value={formData.gestor}
            onChange={(val) => updateField("gestor", val)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Validadores responsáveis
          </label>
          <SearchDropdown
            options={listaValidadores}
            placeholder="Selecione o validador responsável"
            searchPlaceholder="Buscar um validador operacional"
            value={formData.validador}
            onChange={(val) => updateField("validador", val)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
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
            className="px-6 h-10 w-38.25 rounded-lg border border-blue-primary text-base font-bold text-blue-primary hover:cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="px-6 h-10 w-38.25 rounded-lg bg-blue-primary text-base font-bold text-white hover:cursor-pointer"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  ) : (
    <form
      className="flex flex-col gap-5 flex-1 justify-between"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-medium text-blue-primary mb-1">
          Configurações
        </h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Empresa solicitante
          </label>
          <SearchDropdown
            options={LISTA_EMPRESAS}
            placeholder="Selecione a empresa solicitante"
            searchPlaceholder="Buscar empresa"
            value={formData.empresa}
            onChange={(val) => updateField("empresa", val)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Gestores responsáveis
          </label>
          <SearchDropdown
            options={listaResponsaveis}
            placeholder="Selecione os gestores responsáveis"
            searchPlaceholder="Buscar um gestor interno"
            onChange={(val) =>
              !gestoresConfig.includes(val) &&
              setGestoresConfig([...gestoresConfig, val])
            }
            excludeItems={gestoresConfig}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {gestoresConfig.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5   bg-blue-light-secondary text-black text-xs font-normal px-3 py-1.5 rounded-full"
              >
                <span>{item}</span>
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() =>
                    setGestoresConfig(
                      gestoresConfig.filter((i) => i !== item),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-black">
            Validadores operacionais responsáveis
          </label>
          <SearchDropdown
            options={listaValidadores}
            placeholder="Selecione os validadores operacionais responsáveis"
            searchPlaceholder="Buscar um validador operacional"
            onChange={(val) =>
              !validadoresConfig.includes(val) &&
              setValidadoresConfig([...validadoresConfig, val])
            }
            excludeItems={validadoresConfig}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {validadoresConfig.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 bg-blue-light-secondary text-black text-xs font-normal px-3 py-1.5 rounded-full"
              >
                <span>{item}</span>
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() =>
                    setValidadoresConfig(
                      validadoresConfig.filter((i) => i !== item),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
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
            className="px-6 h-10 w-38.25 rounded-lg border border-blue-primary text-base font-bold text-blue-primary hover:cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="px-6 h-10 w-38.25 rounded-lg bg-blue-primary text-base font-bold text-white hover:cursor-pointer"
          >
            Continuar
          </button>
        </div>
      </div>
    </form>
  );
};