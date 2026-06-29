import { HeaderAdm } from "@/components/AdmProfile/HeaderAdm";
import { SidebarDefaultAdm } from "@/components/AdmProfile/SidebarDefaultAdm";
import { SurveyTableAdm } from "@/components/AdmProfile/SurveyTableAdm";
import { useState } from "react";


export const SurveyPage = () => {
  // O estado para controlar o layout global
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex w-full min-h-screen items-stretch">
      <SidebarDefaultAdm
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <HeaderAdm />
        <SurveyTableAdm />
      </div>
    </div>
  );
};
