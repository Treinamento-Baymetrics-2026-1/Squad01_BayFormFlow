import { SurveyDetailsMain } from "@/components/SurveyDetails/SurveyDetailsMain";

export const SurveyDetailsPage = () => {
  return (
    <div className="flex w-full min-h-screen items-stretch">
      <div className="flex-1 min-w-0 flex flex-col">
        <SurveyDetailsMain />
      </div>
    </div>
  );
};
