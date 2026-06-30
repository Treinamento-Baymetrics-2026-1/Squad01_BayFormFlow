import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // O Outlet é onde as páginas vão renderizar
import { SidebarDefaultAdm } from "../ui/SidebarDefaultAdm";
import { HeaderAdm } from "../ui/HeaderAdm";

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarDefaultAdm
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <HeaderAdm />
        <main style={{}}>
          {/* O Outlet renderiza a página atual */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
