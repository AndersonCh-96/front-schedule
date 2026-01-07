import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSideBar";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full mx-auto">
        <SidebarTrigger />
        {<Outlet />}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
