import { toast } from "sonner";
import { create } from "zustand";
import useAuthStore from "../auth/auth.store";

const roleStore = create((set) => ({

    roles: [],
    rol: {},
    loading: false,
    meta: { page: 1, pageCount: 1, total: 0 },

    getAllRoles: async (page = 1, pageSize = 10) => {
        const token: any = useAuthStore.getState();
        console.log("token", token)
        set({ loading: true })
        const response = await fetch(`http://localhost:3000/api/roles?page=${page}&limit=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token ? token.token : ""}`
            },
        })
        const data = await response.json()
        if (data.statusCode === 401) toast.error("No tienes permiso para acceder a esta ruta")
        console.log("data", data)
        set({
            roles: data.data || data,
            meta: data.meta || { page, pageCount: 1, total: data.length },
            loading: false
        })
    },

    getOne: async (id: string) => {
        set({ loading: true })
        const response = await fetch(`http://localhost:3000/api/roles/${id}`)
        const data = await response.json()
        set({ rol: data, loading: false })
    }
    ,

    updateRole: async (id: string, body: any) => {
        try {
            set({ loading: true })
            const response = await fetch(`http://localhost:3000/api/roles/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Error en el servidor");
            const data = await response.json();


            set((state: any) => ({
                roles: state.roles.map((role: any) =>
                    role.id === id ? { ...role, ...data } : role
                ),
                loading: false
            }));
            return { success: true };

        } catch (error: any) {
            set({ loading: false });
            return { success: false, error: error?.message };
        }

    }
    ,

    createRole: async (role: any) => {
        try {
            set({ loading: true });
            const response = await fetch("http://localhost:3000/api/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(role)
            })
            if (!response.ok) throw new Error("Error en el servidor")
            const data = await response.json()
            set((state: any) => ({
                roles: [...state.roles, data],
                loading: false,
            }))
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error?.message }
        }
    },


    deleteRole: async (id: string) => {
        try {
            set({ loading: true });
            const response = await fetch(`http://localhost:3000/api/roles/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Error en el servidor");
            set((state: any) => ({
                roles: state.roles.filter((role: any) => role.id !== id),
                loading: false,
            }));
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

}))



export default roleStore