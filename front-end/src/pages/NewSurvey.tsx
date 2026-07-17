import { NewSurveyForm } from "@/components/NewSurvey/NewSurveyForm";

export const NewSurveyPage = () => {
  return (
    <div className="flex w-full min-h-screen items-stretch">
      <div className="flex-1 min-w-0 flex flex-col">
        <NewSurveyForm />
      </div>
    </div>
  );
};
