import React, { useState, useMemo } from "react";
import { Check, Search, Trash2, SquarePen, UserPlus } from "lucide-react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

interface Pesquisa {
  titulo: string;
  tipo: string;
  descricao: string;
  prazoInicio: string;
  prazoEncerramento: string;
}

interface NewSurveyFormProps {
  pesquisa?: Pesquisa | null;
}

interface ParticipanteItem {
  nome: string;
  email: string;
  rm: string;
}

const LISTA_OPCOES_RESPONSAVEIS = [
  "Giula Moreira Mota",
  "Joana da Silva",
  "Josué da Silva Mota",
  "Marcos Antônio de Oliveira",
  "Sthephani Dias de Albuquerque Moreira",
];

const LISTA_OPCOES_VALIDADORES = [
  "Amélia Kokimoto da Silva",
  "João Peres de Almeida",
  "Mariana Moreira De La Paz",
  ...LISTA_OPCOES_RESPONSAVEIS,
];

export const NewSurveyForm = ({ pesquisa = null }: NewSurveyFormProps) => {
  const [step, setStep] = useState(1);
  const [subStepConfig, setSubStepConfig] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    titulo: pesquisa?.titulo ?? "",
    tipo: pesquisa?.tipo ?? "",
    descricao: pesquisa?.descricao ?? "",
    prazoInicio: pesquisa?.prazoInicio ?? "",
    prazoEncerramento: pesquisa?.prazoEncerramento ?? "",
    empresa: "",
    gestor: "",
    validador: "",
    nomeParticipante: "",
    emailParticipante: "",
    rmParticipante: "",
    percentualMinimo: "",
    faixaEstimada: "Pequeno",
  });

  const [gestoresConfig, setGestoresConfig] = useState<string[]>(
    LISTA_OPCOES_RESPONSAVEIS,
  );
  const [validadoresConfig, setValidadoresConfig] = useState<string[]>([
    "Amélia Kokimoto da Silva",
    "João Peres de Almeida",
    "Mariana Moreira De La Paz",
  ]);
  const [listaParticipantes, setListaParticipantes] = useState<
    ParticipanteItem[]
  >([]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartEdit = (index: number) => {
    const participante = listaParticipantes[index];
    setEditingIndex(index);
    setFormData((prev) => ({
      ...prev,
      nomeParticipante: participante.nome,
      emailParticipante: participante.email,
      rmParticipante: participante.rm,
    }));
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData((prev) => ({
      ...prev,
      nomeParticipante: "",
      emailParticipante: "",
      rmParticipante: "",
    }));
  };

  const handleRemoveParticipante = (indexToRemove: number) => {
    if (editingIndex === indexToRemove) {
      handleCancelEdit();
    }
    setListaParticipantes((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove),
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (subStepConfig === 1) {
        setSubStepConfig(2);
      } else {
        setStep(3);
      }
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      if (subStepConfig === 2) {
        setSubStepConfig(1);
      } else {
        setStep(1);
      }
    } else if (step === 3) {
      setStep(2);
      setSubStepConfig(2);
    }
  };

  const handleSubmitFinal = () => {
    // eslint-disable-next-line no-console
    console.log("Payload enviado à API:", {
      ...formData,
      participantes: listaParticipantes,
    });
  };

  const stepsVisual = useMemo(
    () => [
      { id: 1, label: "Identificação" },
      {
        id: 2,
        label:
          step === 2 && subStepConfig === 1 ? "Responsáveis" : "Configurações",
      },
      { id: 3, label: "Participantes" },
    ],
    [step, subStepConfig],
  );

  const filteredParticipantes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return listaParticipantes.filter(
      (p) =>
        p.nome.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.rm.toLowerCase().includes(term),
    );
  }, [listaParticipantes, searchTerm]);

  const getInitials = (name: string) => {
    const tokens = name.trim().split(/\s+/);
    if (tokens.length >= 2) {
      return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
    }
    return tokens[0] ? tokens[0][0].toUpperCase() : "";
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 py-8 md:py-17.5 font-sans">
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h3 className="font-bold text-2xl text-blue-primary">
            Nova pesquisa
          </h3>
          <p className="font-normal text-base text-gray-placeholder mt-1">
            Criação de nova pesquisa organizacional
          </p>
        </div>
      </div>

      <div
        className={`flex flex-col w-full mx-auto transition-all duration-200 ${step === 3 ? "max-w-6xl items-start" : "max-w-182 items-center"}`}
      >
        {/* Stepper Superior */}
        <div
          className={`flex items-center w-full mb-8 flex-wrap md:flex-nowrap gap-y-4 ${step === 3 ? "justify-start md:w-full md:max-w-6xl" : "justify-center max-w-182"}`}
        >
          {stepsVisual.map((item, idx) => (
            <React.Fragment key={item.id}>
              <div className="flex flex-col items-center justify-end w-24 sm:w-28 shrink-0">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-150 ${step === item.id ? "scale-100 border-blue-primary text-blue-primary ring ring-blue-primary bg-white" : step > item.id ? "scale-80 border-blue-primary bg-blue-primary text-white" : "scale-80 border-gray-placeholder text-gray-placeholder bg-white"}`}
                >
                  {step > item.id ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    item.id
                  )}
                </div>
                <span
                  className={`mt-2 text-center whitespace-nowrap text-xs sm:text-sm ${step === item.id ? "text-black font-semibold text-base sm:text-base" : "text-gray-placeholder font-normal"}`}
                >
                  {item.label}
                </span>
              </div>
              {idx < stepsVisual.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-4 max-w-16 sm:max-w-32 mx-2 sm:mx-4 -mt-5 sm:-mt-6 transition-colors ${step > item.id ? "bg-blue-primary" : "bg-gray-light-secondary"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Container Principal */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-start">
          <div className="bg-white w-full max-w-182 min-h-150 rounded-2xl p-6 sm:p-8 shadow-box-field border border-gray-light-secundary flex flex-col justify-between flex-1">
            {step === 1 && (
              <Step1
                formData={formData}
                updateField={updateField}
                onNext={handleNextStep}
                onCancel={handleBackStep}
              />
            )}

            {step === 2 && (
              <Step2
                subStepConfig={subStepConfig}
                formData={formData}
                gestoresConfig={gestoresConfig}
                setGestoresConfig={setGestoresConfig}
                validadoresConfig={validadoresConfig}
                setValidadoresConfig={setValidadoresConfig}
                updateField={updateField}
                onNext={handleNextStep}
                onBack={handleBackStep}
                listaResponsaveis={LISTA_OPCOES_RESPONSAVEIS}
                listaValidadores={LISTA_OPCOES_VALIDADORES}
              />
            )}

            {step === 3 && (
              <Step3
                formData={formData}
                updateField={updateField}
                onBack={handleBackStep}
                onSubmit={handleSubmitFinal}
                editingIndex={editingIndex}
                onCancelEdit={handleCancelEdit}
                setListaParticipantes={setListaParticipantes}
              />
            )}
          </div>

          {/* Modal Lateral de Participantes */}
          {step === 3 && (
            <div className="bg-white w-full md:max-w-115 md:min-w-115 min-h-160 max-h-160.75 rounded-2xl p-6 shadow-box-field border border-gray-light-primary flex flex-col shrink-0">
              <div className="pb-4 mb-4 flex justify-between items-center w-full">
                <h4 className="font-semibold text-base text-black">
                  Participantes adicionados
                </h4>
                <span className="text-xs bg-gray-light-placeholder px-2.5 py-1 rounded-full text-gray-placeholder font-medium">
                  {listaParticipantes.length} adicionados
                </span>
              </div>

              <div className="relative w-full mb-4">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-placeholder"
                />
                <input
                  type="text"
                  placeholder="Buscar um participante"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-secondary rounded-lg outline-none focus:border-blue-secundary text-black"
                />
              </div>

              <div
                className={`flex-1 overflow-y-auto max-h-115 rounded-xl pr-1 ${filteredParticipantes.length === 0 ? "border border-dashed border-gray-200" : ""}`}
              >
                {filteredParticipantes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="w-12 h-12 rounded-lg bg-blue-light-secondary flex items-center justify-center text-blue-primary mb-3">
                      <UserPlus size={20} />
                    </div>
                    <h5 className="text-sm font-semibold text-blue-primary">
                      Nenhum participante adicionado
                    </h5>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredParticipantes.map((participante, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-xl border ${editingIndex === index ? "border-blue-secundary bg-white shadow-box-field" : "border-gray-light-primary bg-white"}`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-11 h-11 rounded-full bg-[#005B94] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {getInitials(participante.nome)}
                          </div>
                          <div className="flex flex-col overflow-hidden justify-center">
                            <span className="text-sm font-semibold text-black truncate">
                              {participante.nome}
                            </span>
                            {participante.email && (
                              <span className="text-xs text-gray-placeholder truncate">
                                {participante.email}
                              </span>
                            )}
                            {participante.rm && (
                              <span className="text-[11px] font-medium text-gray-placeholder">
                                {participante.rm}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(index)}
                            className="p-1.5 rounded-md text-blue-primary hover:bg-blue-light-secondary"
                          >
                            <SquarePen size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipante(index)}
                            className="text-feedback-error p-1.5 rounded-md hover:bg-feedback-error-light"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};