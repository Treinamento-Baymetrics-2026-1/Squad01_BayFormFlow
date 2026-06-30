import { NoticationOverview } from "@/components/Overview/NotificationOverview";
import { SurveyOverview } from "@/components/Overview/SurveyOverview";

export const OverviewPage = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        <SurveyOverview />
        <NoticationOverview />
      </div>
    </div>
  );
};
