import { ModalLogin } from "./components/ModalLogin";
import { SidebarAuth } from "./components/SideBarAuth";

export const AuthPage = () => {
  return (
    <div className="flex h-screen w-full ">
      <SidebarAuth />
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <ModalLogin />
      </div>
    </div>
  );
};
