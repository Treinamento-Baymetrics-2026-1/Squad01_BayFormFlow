import { Form, Plus } from "lucide-react";

export const SurveyAddedForms = () => {
  return (
    <div className="bg-gray-light-primary rounded-2xl border border-gray-light-secondary p-12 text-center text-blue-primary shadow-box-field">
      <div className="p-12 flex flex-col items-center justify-cente">
        <div className="w-12 h-12 bg-blue-light-secondary rounded-sm flex items-center justify-center mb-4 text-blue-primary">
          <Form className="h-5.5 w-5.5" />
        </div>
        <p className="text-blue-primary font-medium text-base mb-4">
          Nenhum formulário criado
        </p>
        <button
          type="button"
          className="bg-blue-primary text-white font-bold text-sm px-5 py-2.5 mt-12 rounded-lg flex items-center gap-2 cursor-pointer shadow-box-field"
        >
          <Plus className="w-4 h-4" /> Criar formulário
        </button>
      </div>
    </div>
  );
};
