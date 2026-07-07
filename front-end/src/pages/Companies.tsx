import { CompaniesTable } from "@/components/Companies/CompaniesTable";

export const CompaniesPage = () => {
  return (
    <div className="flex w-full min-h-screen items-stretch">
      <div className="flex-1 min-w-0 flex flex-col">
        <CompaniesTable/>
      </div>
    </div>
  );
};