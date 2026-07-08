import React, { useState } from "react";
import { Check } from "lucide-react";

interface Pesquisa {
  titulo: string;
  tipo: string;
  descricao: string;
  prazoInicio: string;
  prazoEncerramento: string;
}

interface NewSurveyFormProps {
  pesquisa?: Pesquisa | null;
  onClose: () => void;
}

export const NewSurveyForm = ({
  pesquisa = null,
  onClose,
}: NewSurveyFormProps) => {
  // Steps 1 = Identificação, 2 = Configurações, 3 = Participantes
  const [step, setStep] = useState<number>(1);

  // Estados dos campos da primeira etapa (Identificação)
  const [titulo, setTitulo] = useState(pesquisa?.titulo ?? "");
  const [tipo, setTipo] = useState(pesquisa?.tipo ?? "");
  const [descricao, setDescricao] = useState(pesquisa?.descricao ?? "");
  const [prazoInicio, setPrazoInicio] = useState(pesquisa?.prazoInicio ?? "");
  const [prazoEncerramento, setPrazoEncerramento] = useState(pesquisa?.prazoEncerramento ?? "");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="w-full px-16 py-17.5 font-sans">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-bold text-2xl text-blue-primary">Pesquisas</h3>
      </div>
      <div className="mb-8">
        <p className="font-normal text-base leading-6 tracking-normal text-gray-placeholder">
          Pesquisas às quais você tem acesso
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full w-max-182 mx-auto">
        
        <div className="flex items-center justify-center w-full max-w-182 mb-8">
          
          {/* Passo 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
              step > 1 
                ? "border-blue-primary bg-blue-primary text-white" 
                : step === 1 
                ? "border-blue-primary bg-white text-blue-primary ring ring-blue-100" 
                : "border-gray-placeholder bg-white text-gray-placeholder"
            }`}>
              {step > 1 ? <Check size={20} strokeWidth={3} /> : "1"}
            </div>
            <span className={`mt-2 ${step === 1 ? "text-black font-medium text-base" : "text-black font-normal text-sm"}`}>
              Identificação
            </span>
          </div>

          <div className={`h-0.5 flex-1 max-w-32 mx-4 transition-colors duration-300 ${
            step > 1 ? "bg-blue-primary" : "bg-gray-200"
          }`} />

          {/* Passo 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
              step > 2 
                ? "border-blue-primary bg-blue-primary text-white" 
                : step === 2 
                ? "border-blue-primary bg-white text-blue-primary ring ring-blue-100" 
                : "border-gray-placeholder bg-white text-gray-placeholder"
            }`}>
              {step > 2 ? <Check size={20} strokeWidth={3} /> : "2"}
            </div>
            <span className={`text-sm mt-2 font-normal ${step === 2 ? "text-black font-medium text-base" : "text-gray-placeholder"}`}>
              Configurações
            </span>
          </div>

          <div className={`h-0.5 flex-1 max-w-32 mx-4 transition-colors duration-300 ${
            step > 2 ? "bg-blue-primary" : "bg-gray-200"
          }`} />

          {/* Passo 3 */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all ${
              step === 3 
                ? "border-blue-primary bg-white text-blue-primary ring ring-blue-100" 
                : "border-gray-placeholder bg-white text-gray-placeholder"
            }`}>
              3
            </div>
            <span className={`text-sm mt-2 font-normal ${step === 3 ? "text-black font-medium text-base" : "text-gray-placeholder"}`}>
              Participantes
            </span>
          </div>
        </div>

        <div className="bg-white w-full max-w-182 h-fit rounded-2xl p-8 shadow-sm border border-gray-100">
          
          {/* Se for a etapa 1: identificação */}
          {step === 1 && (
            <>
              <div className="w-full mb-6">
                <h2 className="text-xl font-bold text-[#003356]">
                  Identificação
                </h2>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleNextStep}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-black">Título</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-[#003356] placeholder:text-gray-400"
                    placeholder="Digite o título da pesquisa"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-black">Tipo</label>
                  <div className="relative w-full">
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black bg-white focus:outline-none focus:border-[#003356] appearance-none placeholder:text-gray-400"
                      required
                    >
                      <option value="" disabled hidden>Selecione o tipo da pesquisa</option>
                      <option value="satisfacao">Satisfação</option>
                      <option value="clima">Clima Organizacional</option>
                      <option value="desempenho">Desempenho</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-black">Descrição</label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-[#003356] placeholder:text-gray-400 resize-none"
                    placeholder="Digite a descrição da pesquisa"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Prazo de início</label>
                    <input
                      type="date"
                      value={prazoInicio}
                      onChange={(e) => setPrazoInicio(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-[#003356] scheme-light"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-black">Prazo de encerramento</label>
                    <input
                      type="date"
                      value={prazoEncerramento}
                      onChange={(e) => setPrazoEncerramento(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:border-[#003356] scheme-light"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="px-6 h-10 w-38.25 rounded-lg border border-[#003356] text-sm font-bold text-[#003356] cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 h-10 w-38.25 rounded-lg bg-[#003356] text-sm font-bold text-white cursor-pointer hover:bg-[#00223a] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Se for a etapa 2: configurações */}
          {step === 2 && (
            <>
              <div className="w-full mb-6">
                <h2 className="text-xl font-bold text-[#003356]">
                  Configurações
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Espaço reservado para a implementação futura dos parâmetros e regras da pesquisa.
                </p>
              </div>

              <div className="flex flex-col gap-5 min-h-64 justify-center items-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-6">
                <span className="text-sm text-gray-400 font-medium">
                  [Campos de Configuração aqui]
                </span>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="px-6 h-10 w-38.25 rounded-lg border border-[#003356] text-sm font-bold text-[#003356] cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => alert("Dados prontos para envio ou próximo passo!")}
                  className="px-6 h-10 w-38.25 rounded-lg bg-[#003356] text-sm font-bold text-white cursor-pointer hover:bg-[#00223a] transition-colors"
                >
                  Salvar
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};