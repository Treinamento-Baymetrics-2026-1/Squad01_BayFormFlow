import { WorkInProgressWarning } from "@/components/WorkInProgress/WorkInProgressWarning";

export const WorkInProgressPage = () => {
  return (
    <div className="flex w-full min-h-screen items-stretch">
      <div className="flex-1 min-w-0 flex flex-col">
        <WorkInProgressWarning />
      </div>
    </div>
  );
};
