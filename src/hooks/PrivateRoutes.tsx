import useAuthStore from "@/store/auth/auth.store";

import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {

    const { isAuthenticated }: any = useAuthStore();

    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace />
}

export default PrivateRoutes