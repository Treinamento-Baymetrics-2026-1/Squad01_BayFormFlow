import { UserTable } from "@/components/Users/UserTable";

export const UsersPage = () => {
  return (
    <div className="flex w-full min-h-screen items-stretch">
      <div className="flex-1 min-w-0 flex flex-col">
        <UserTable />
      </div>
    </div>
  );
};
