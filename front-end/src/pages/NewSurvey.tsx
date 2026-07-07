import { SurveyTableAdm } from "@/components/Survey/SurveyTableAdm";

export const NewSurveyPage = () => {
  return (
    <div className="flex w-full min-h-screen items-stretch">
      <div className="flex-1 min-w-0 flex flex-col">
        <SurveyTableAdm />
      </div>
    </div>
  );
};
