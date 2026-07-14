import React, { useState } from "react";
import { Calendar, Users as UsersIcon, Plus, Form } from "lucide-react";
import { SurveyAddedForms } from "./SurveyAddedForms";
import { SurveyParticipants } from "./SurveyParticipants";
import { SurveyAnswers } from "./SurveyAnswers";

interface FormItem {
  titulo: string;
  respostas: number;
  dataAbertura: string;
}

export const SurveyDetailsMain = () => {
  const [activeTab, setActiveTab] = useState("Visão Geral");

  const [forms, setForms] = useState<FormItem[]>([]);

  const tabs = ["Visão Geral", "Formulários", "Participantes", "Respostas"];

  const gestores = ["DS", "PM", "LO", "AS", "+3"];
  const validadores = ["DS", "LO", "ML", "JS", "+1"];

  const handleCreateForm = () => {
    const mockForms: FormItem[] = [
      {
        titulo: "Clima organizacional na ind...",
        respostas: 10,
        dataAbertura: "14/07/2026",
      },
      {
        titulo: "Psicologia nas empresas",
        respostas: 0,
        dataAbertura: "01/07/2026",
      },
      {
        titulo: "Preservação do ambiente X",
        respostas: 40,
        dataAbertura: "10/06/2026",
      },
    ];

    if (forms.length === 0) {
      setForms(mockForms);
    } else {
      setForms([
        ...forms,
        {
          titulo: `Novo Formulário Extra ${forms.length + 1}`,
          respostas: Math.floor(Math.random() * 50),
          dataAbertura: "01/01/2026",
        },
      ]);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 md:px-16 py-8 md:py-17.5 min-h-screen">
      <div className="flex justify-between items-center w-full mb-6">
        <div>
          <h3 className="font-bold text-2xl text-blue-primary">
            Sustentabilidade Corporativa
          </h3>
          <div className="mt-1.5">
            <span
              className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles("Em andamento")}`}
            >
              Em andamento
            </span>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-light-placeholder p-3 rounded-lg w-fit gap-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-sm rounded-lg text-foreground transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-gray-light-primary shadow-box-field font-medium"
                : "hover:text-gray-placeholder font-normal"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Visão Geral" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-light-placeholder p-6 shadow-box-field flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-lg text-black">
                    Identificação
                  </h4>
                  <span className="bg-gray-light-secondary border border-gray-light-placeholder text-black text-sm font-medium px-3 py-1 rounded-full">
                    Socioambiental
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 border border-gray-light-placeholder rounded-xl p-4">
                  <div className="border-r">
                    <span className="text-blue-primary text-center text-sm font-normal block mb-1">
                      Prazo de início
                    </span>
                    <div className="flex items-center ml-13 gap-2 text-black font-medium text-sm">
                      <Calendar className="w-4 h-4 text-blue-primary" />
                      <span>22/06/2026</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-primary text-center text-sm font-normal block mb-1">
                      Prazo de encerramento
                    </span>
                    <div className="flex items-center ml-6 gap-2 text-black font-medium text-sm">
                      <Calendar className="w-4 h-4 text-blue-primary" />
                      <span>31/08/2026</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 border border-gray-light-placeholder">
                  <span className="text-blue-primary text-sm font-normal block mb-1">
                    Descrição
                  </span>
                  <p className="text-black text-sm leading-5 font-normal text-justify">
                    Pesquisa destinada a obtenção de dados no meio
                    organizacional a fim de investigar em âmbito socioambiental
                    os colaboradores e os setores associados.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-light-placeholder p-6 shadow-box-field flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-lg text-black mb-6">
                  Responsáveis
                </h4>

                <div className="rounded-xl p-4 border border-gray-light-secondary mb-6">
                  <span className="text-blue-primary text-sm font-normal block mb-1">
                    Empresa solicitante
                  </span>
                  <p className="text-black font-normal text-sm">
                    Construtora BV
                  </p>
                </div>

                <div className="rounded-xl p-4 border border-gray-light-secondary">
                  <span className="text-blue-primary text-sm font-normal block mb-4">
                    Equipe responsável
                  </span>

                  <div className="space-x-4 flex">
                    <div>
                      <span className="text-gray-placeholder text-sm block mb-2 font-normal">
                        Gestores
                      </span>
                      <div className="flex -space-x-2 overflow-hidden">
                        {gestores.map((avatar, i) => (
                          <div
                            key={i}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold text-white border-2 border-white ring-offset-0 ${
                              avatar === "+3"
                                ? "bg-gray-placeholder"
                                : "bg-blue-primary"
                            }`}
                          >
                            {avatar}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-placeholder text-sm block mb-2 font-normal">
                        Validadores
                      </span>
                      <div className="flex -space-x-2 overflow-hidden">
                        {validadores.map((avatar, i) => (
                          <div
                            key={i}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold text-white border-2 border-white ring-offset-0 ${
                              avatar === "+1"
                                ? "bg-gray-placeholder"
                                : "bg-neutral-blue"
                            }`}
                          >
                            {avatar}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-light-placeholder p-6 shadow-box-field flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-lg text-black mb-6">
                  Participação
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl p-4 border border-gray-light-secondary flex flex-col justify-center">
                    <span className="text-blue-primary text-sm font-normal block mb-2">
                      Faixa estimada de participantes
                    </span>
                    <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-gray-light-secondary">
                      <div className="border-r">
                        <span className="bg-blue-light-secondary text-blue-secundary text-sm font-medium px-2 py-0.5 rounded-md mr-4">
                          Alto
                        </span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1 text-black text-sm font-normal ml-2">
                          <UsersIcon className="w-3.5 h-3.5 text-blue-secundary" />{" "}
                          101-199
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-light-primary rounded-xl p-4 border border-gray-light-secondary flex flex-col justify-center items-center">
                    <span className="text-blue-primary text-sm font-normal block mb-1 text-center">
                      Percentual mínimo
                    </span>
                    <p className="text-black font-medium text-2xl">80%</p>
                  </div>
                </div>

                <div className="rounded-xl p-5 border border-gray-light-secondary">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-primary text-sm font-normal">
                      Progresso atual de participação
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-2">
                    <span className="text-blue-primary font-semibold text-base">
                      70%
                    </span>
                  </div>
                  <div className="w-full bg-gray-light-placeholder-secondary rounded-full h-1.5">
                    <div
                      className="bg-blue-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h4 className="font-medium text-2xl text-black mb-4">
              {forms.length > 0 ? "Formulários criados" : "Formulários"}
            </h4>

            {forms.length === 0 ? (
              <div className="border-2 border-dashed border-gray-placeholder rounded-md p-12 flex flex-col items-center justify-center bg-white shadow-box-field">
                <div className="w-12 h-12 bg-blue-light-secondary rounded-sm flex items-center justify-center mb-4 text-blue-primary">
                  <Form className="h-5.5 w-5.5" />
                </div>
                <p className="text-blue-primary font-medium text-base mb-4">
                  Nenhum formulário criado
                </p>

                <button
                  type="button"
                  onClick={handleCreateForm}
                  className="bg-blue-primary text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-box-field"
                >
                  <Plus className="w-4 h-4" /> Criar formulário
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-6">
                {forms.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-light-placeholder p-4 shadow-box-field flex flex-col justify-between mb-4 min-h-91 w-62"
                  >
                    <div className="bg-gray-light-secondary rounded-xl flex items-center justify-center flex-1 mb-4 h-32 text-blue-primary">
                      <Form className="w-8 h-8 opacity-80" />
                    </div>

                    <div>
                      <h5
                        className="font-semibold text-sm text-black mb-2 truncate"
                        title={item.titulo}
                      >
                        {item.titulo}
                      </h5>
                      <div className="flex flex-col gap-2">
                        <span className="bg-gray-light-secondary text-blue-primary text-xs font-semibold px-2 py-1 rounded-md w-fit border border-gray-light-placeholder">
                          {item.respostas} respostas
                        </span>
                        <span className="text-gray-placeholder text-[11px] font-normal block mt-1 self-center">
                          Aberto em {item.dataAbertura}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleCreateForm}
                  className="border-2 border-dashed border-gray-placeholder rounded-2xl p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-light-secondary transition-colors cursor-pointer h-60 w-60"
                >
                  <div className="w-10 h-10 border border-gray-placeholder border-dashed rounded-lg flex items-center justify-center text-gray-placeholder mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-gray-placeholder text-xs font-medium">
                    Criar formulário
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "Formulários" && <SurveyAddedForms />}

      {activeTab === "Participantes" && <SurveyParticipants />}

      {activeTab === "Respostas" && <SurveyAnswers />}
    </div>
  );
};

function getStatusStyles(status: string) {
  switch (status) {
    case "Cancelada":
      return "bg-status-canceled-light text-status-canceled";
    case "Em andamento":
      return "bg-status-progress-light text-status-progress";
    case "Alteração solicitada":
      return "bg-status-change-requested-light text-status-change-requested";
    case "Concluída":
      return "bg-feedback-success-light text-feedback-success";
    default:
      return "bg-status-canceled-light text-gray-placeholder";
  }
}
