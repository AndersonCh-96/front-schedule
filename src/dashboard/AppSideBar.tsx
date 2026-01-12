import { Calendar, HomeIcon, Settings, User, Users2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,

  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth/auth.store";

const hasAdminRole = (roles: any[]) => {
  if (!Array.isArray(roles)) return false;
  return roles.some((role) => {
    if (!role) return false;
    if (typeof role === "string") return role.toLowerCase() === "admin";
    const value = role.name || role.role || role.rol;
    return typeof value === "string" && value.toLowerCase() === "admin";
  });
};

export function AppSidebar() {

  const { logoutUser, roles }: any = useAuthStore();
  const canSeeSettings = hasAdminRole(roles);
  const canSeeRoles = hasAdminRole(roles);
  const canSeeUsers = hasAdminRole(roles);
  const canSeeSalas = hasAdminRole(roles);

  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarHeader onClick={() => navigate("/dashboard")} className="text-center cursor-pointer font-bold 
       
       text-lg rounded-lg mx-2">
        WellSchedule
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel></SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>

              {
                canSeeRoles && (<SidebarMenuItem>
                  <SidebarMenuButton asChild className="  hover:scale-101 transition-transform ">
                    <Link to="/roles">
                      <Users2 />
                      <span>Roles</span>
                  
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)
              }
              {
                canSeeUsers && (<SidebarMenuItem>
                  <SidebarMenuButton asChild className="  hover:scale-101 transition-transform">
                    <Link to="/usuarios">
                      <User />
                      <span>Usuarios</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)
              }
              {
                canSeeSalas && (<SidebarMenuItem>
                  <SidebarMenuButton asChild className="  hover:scale-101 transition-transform">
                    <Link to="/salas">
                      <HomeIcon />
                      <span>Salas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)
              }
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="  hover:scale-101 transition-transform ">
                  <Link to="/calendario">
                    <Calendar />
                    <span>Calendario</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {canSeeSettings && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="  hover:scale-101 transition-transform">
                    <Link to="/settings">
                      <Settings />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="cursor-pointer"
          onClick={() => {
            logoutUser();
            navigate("/login");
          }}
        >
          Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
