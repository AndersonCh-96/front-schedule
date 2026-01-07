import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";

import {
  BrowserRouter,
  Navigate,
  RouterProvider,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./dashboard/Layout.tsx";
import Room from "./pages/room/Room.tsx";
import Usuarios from "./pages/Usuarios/Usuarios.tsx";
import Roles from "./pages/Roles/Roles.tsx";
import Calendario from "./pages/Calendario/Calendario.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Login from "./pages/Auth/Login.tsx";
import PrivateRoutes from "./hooks/PrivateRoutes.tsx";
import NotFound from "./pages/NoFound/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton pauseOnHover />
      <Routes>
        {/* Redirección inicial */}
        {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        {/* Layout Dashboard */}
        <Route element={<PrivateRoutes />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<App />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/salas" element={<Room />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/settings" element={<Settings />} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
