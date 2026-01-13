import { AlertCircle, Calendar, HomeIcon, Settings, User, Users2 } from "lucide-react";
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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>

        <DialogContent>
          <DialogHeader className="text-center justify-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <AlertCircle className="text-center text-red-500" width={40} height={40} />
              <DialogTitle className="text-center">¿Estás seguro de cerrar sesión?</DialogTitle>
            </div>
            {/* <DialogDescription>
              Esta acción no se puede deshacer. Esto cerrará tu sesión y eliminará tus datos de nuestros servidores.
            </DialogDescription> */}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="cursor-pointer" onClick={() => {
              setDeleteOpen(false);
              logoutUser();
            }}>Si, cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="  hover:scale-101 transition-transform ">
                    <Link to="/dashboard">
                      <HomeIcon />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>



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

              setDeleteOpen(true)
              // logoutUser();
              // navigate("/login");
            }}
          >
            Cerrar sesión
          </Button>
        </SidebarFooter>
      </Sidebar>


    </>
  );
}
