import { LucideBlocks, LucideHouse } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WorkInProgressWarning = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-100 py-[15%] text-center bg-white rounded-lg">
      {/* icone */}
      <div className="flex items-center justify-center w-24.5 h-24.5 mb-6 rounded-lg bg-blue-light-secondary text-blue-primary">
        <LucideBlocks className="w-18.5 h-18.5" strokeWidth={0.75} />
      </div>

      {/* título */}
      <h2 className="mb-3 text-4xl font-bold text-blue-primary">
        Em desenvolvimento
      </h2>

      {/* justificativa */}
      <p className="max-w-80 mb-8 text-xl font-normal text-black">
        Esta funcionalidade ainda está em desenvolvimento!
      </p>

      {/* botão */}
      <button
        type="button"
        onClick={() => navigate("/visao-geral")}
        className="flex items-center gap-2 px-6 py-2.5 text-base font-bold text-white rounded-lg bg-blue-primary shadow-box-field cursor-pointer"
      >
        <LucideHouse className="w-4 h-4" strokeWidth={3} />
        Voltar ao início
      </button>
    </div>
  );
};
