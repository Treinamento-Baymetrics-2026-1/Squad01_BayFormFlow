import React from "react";

export const SurveyAnswers = () => {
  const answers = [
    {
      id: 1,
      nome: "Ana Silva",
      info: "ana.silva@construtorabv.com.br",
    },
    {
      id: 2,
      nome: "Maurício de Souza",
      info: "BV-09090900",
    },
    {
      id: 3,
      nome: "Fernanda de Albuquerque Bueno",
      info: "BV-09090912",
    },
  ];

  return (
    <div className="w-full flex flex-col items-start">
      <h4 className="text-black font-medium text-2xl mb-8 self-start">
        Formulário - Como é a sustentabilidade na empresa?
      </h4>

      <div className="w-full bg-white rounded-xl border border-neutral-blue p-6 shadow-box-field flex flex-col gap-4">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="w-full bg-white rounded-xl border border-blue-primary shadow-box-field p-4 flex flex-col justify-center text-left cursor-pointer"
          >
            <p className="text-black text-sm font-semibold mb-1">
              {answer.nome}
            </p>
            <p className="text-gray-placeholder text-xs font-normal">
              {answer.info}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};