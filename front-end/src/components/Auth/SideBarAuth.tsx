import logoBayFormFlowLogin from "@/assets/logos/logoBayFormFlowLogin.svg";

export const SidebarAuth = () => {
  return (
    <div className="w-1/5 max-w-100 h-screen box-border overflow-hidden rounded-tr-[16px] rounded-br-[16px] rounded-tl-0 rounded-bl-0 px-6 bg-blue-primary flex flex-col items-center pt-10 gap-2.5">
      <div className="flex items-center justify-center w-full">
        <img
          src={logoBayFormFlowLogin}
          alt="Logo Bay Form Flow"
          className="h-auto max-w-full"
        />
      </div>
    </div>
  );
};
