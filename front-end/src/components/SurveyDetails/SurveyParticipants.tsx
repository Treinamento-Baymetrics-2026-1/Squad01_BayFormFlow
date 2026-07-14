import React from "react";
import { Plus, Trash2 } from "lucide-react";

export const SurveyParticipants = () => {
  const participants = [
    {
      id: 1,
      nome: "Ana Silva",
      info: "ana.silva@construtorabv.com.br",
      avatar: "AS",
    },
    {
      id: 2,
      nome: "Mauricio de Souza",
      info: "BV-09090900",
      avatar: "MS",
    },
    {
      id: 3,
      nome: "Fernanda de Albuquerque Bueno",
      info: "BV-09090912",
      avatar: "FB",
    },
  ];

  return (
    <div className="w-full flex flex-col items-end">
      <button
        type="button"
        className="bg-blue-primary text-white font-bold text-sm mb-15.5 px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-box-field"
      >
        <Plus className="w-4 h-4" /> Novo participante
      </button>

      <div className="w-full bg-white rounded-2xl border border-neutral-blue shadow-box-field p-6 flex flex-col gap-4">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between py-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-secundary text-white text-sm font-semibold">
                {participant.avatar}
              </div>
              <div className="text-left">
                <p className="text-black text-sm font-semibold">
                  {participant.nome}
                </p>
                <p className="text-gray-placeholder text-xs">
                  {participant.info}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="p-2 rounded-lg bg-feedback-error-light text-feedback-error cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};