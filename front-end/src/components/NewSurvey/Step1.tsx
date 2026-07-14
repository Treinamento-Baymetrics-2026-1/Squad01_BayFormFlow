import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Plus,
  Calendar as CalendarIcon,
  SearchX,
} from "lucide-react";
import { SearchDropdown } from "@/components/ui/SearchDropdownSurvey";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { surveyFormSchema1 } from "@/schema/createSurveySchema";

interface Step1Props {
  formData: {
    titulo: string;
    tipo: string;
    descricao: string;
    prazoInicio: string;
    prazoEncerramento: string;
  };
  updateField: (field: any, value: string) => void;
  onNext: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const TIPOS_PESQUISA_INICIAIS = [
  "Satisfação",
  "Clima Organizacional",
  "Desempenho",
];

export const Step1 = ({ formData, updateField, onNext }: Step1Props) => {
  const navigate = useNavigate();
  const [tiposPesquisa, setTiposPesquisa] = useState<string[]>(
    TIPOS_PESQUISA_INICIAIS,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCancelNavigation = () => {
    navigate("/pesquisas");
  };

  // adicionar um novo termo às opções existentes
  const handleAddNewType = (termo: string) => {
    const termoFormatado = termo.trim();
    if (
      termoFormatado &&
      !tiposPesquisa.some(
        (t) => t.toLowerCase() === termoFormatado.toLowerCase(),
      )
    ) {
      setTiposPesquisa((prev) => [...prev, termoFormatado]);
      updateField("tipo", termoFormatado);
      setSearchTerm("");
    }
  };

  // filtragem local para renderização do dropdown
  const filteredOptions = tiposPesquisa.filter((opcao) =>
    opcao.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const result = surveyFormSchema1.safeParse(formData);

    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    onNext(e);
  };

  const formatarParaPTBR = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const converterParaObjetoData = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleDateSelect = (
    field: "prazoInicio" | "prazoEncerramento",
    date: Date | undefined,
  ) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      updateField(field, `${year}-${month}-${day}`);
    } else {
      updateField(field, "");
    }
  };

  return (
    <>
      <div className="w-full mb-6">
        <h2 className="text-xl font-medium text-blue-primary">Identificação</h2>
      </div>

      <form
        className="flex flex-col gap-5 flex-1 justify-between"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5">
          {/* título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black">Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => updateField("titulo", e.target.value)}
              className="w-full h-10 px-3 border border-neutral-blue rounded-lg text-sm text-black focus:border-[#003356] focus:outline-none"
              placeholder="Digite o título da pesquisa"
            />
          </div>

          {/* Tipo de Pesquisa */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Tipo</label>
            <SearchDropdown
              options={filteredOptions}
              placeholder="Selecione o tipo da pesquisa"
              searchPlaceholder="Buscar tipo"
              value={formData.tipo}
              onChange={(val) => updateField("tipo", val)}
              showSearch={true}
              searchValue={searchTerm}
              onSearchChange={(e: any) => setSearchTerm(e.target.value)}
              customNoResults={
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleAddNewType(searchTerm)}
                    className="flex items-center gap-2 w-full p-2.5 text-sm font-normal text-blue-primary rounded-lg hover:bg-blue-light-secondary transition-colors text-left"
                  >
                    <Plus size={16} />
                    <span>Criar tipo de pesquisa "{searchTerm}"</span>
                  </button>
                  <div className="mt-4 text-gray-400 text-xs flex flex-col items-center gap-2">
                    <div className="bg-blue-light-secondary p-3 rounded-lg flex items-center justify-center">
                      <SearchX size={22} className="text-blue-primary" />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm mt-1">
                      Busca não encontrada
                    </p>
                    <p className="max-w-55 text-gray-400">
                      Tente um outro nome ou adicione o tipo de pesquisa
                      manualmente para continuar
                    </p>
                  </div>
                </div>
              }
            />
          </div>

          {/* descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => updateField("descricao", e.target.value)}
              rows={4}
              className="w-full p-3 border border-neutral-blue rounded-lg text-sm text-black focus:border-[#003356] focus:outline-none"
              placeholder="Digite a descrição da pesquisa"
            />
          </div>

          {/* prazos */}
          <div className="grid grid-cols-2 gap-4">
            {/* início */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Prazo de início
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 px-3 border-neutral-blue rounded-lg justify-between text-left font-normal text-sm hover:bg-transparent",
                      !formData.prazoInicio && "text-muted-foreground",
                    )}
                  >
                    {formData.prazoInicio ? (
                      <span>{formatarParaPTBR(formData.prazoInicio)}</span>
                    ) : (
                      <span>Selecione a data</span>
                    )}
                    <CalendarIcon
                      size={18}
                      className="text-gray-placeholder shrink-0 ml-2"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={converterParaObjetoData(formData.prazoInicio)}
                    onSelect={(date) => handleDateSelect("prazoInicio", date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* encerramento */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Prazo de encerramento
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 px-3 border-neutral-blue rounded-lg justify-between text-left font-normal text-sm hover:bg-transparent",
                      !formData.prazoEncerramento && "text-muted-foreground",
                    )}
                  >
                    {formData.prazoEncerramento ? (
                      <span>
                        {formatarParaPTBR(formData.prazoEncerramento)}
                      </span>
                    ) : (
                      <span>Selecione a data</span>
                    )}
                    <CalendarIcon
                      size={18}
                      className="text-gray-placeholder shrink-0 ml-2"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={converterParaObjetoData(
                      formData.prazoEncerramento,
                    )}
                    onSelect={(date) =>
                      handleDateSelect("prazoEncerramento", date)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* erro e botões */}
        <div className="flex flex-col gap-4 mt-2">
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-feedback-error bg-feedback-error-light text-feedback-error text-sm font-medium animate-fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleCancelNavigation}
              className="px-6 h-10 w-38.25 rounded-lg border border-blue-primary text-base font-bold text-blue-primary hover:cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 h-10 w-38.25 rounded-lg bg-blue-primary text-base font-bold text-white hover:cursor-pointer transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
