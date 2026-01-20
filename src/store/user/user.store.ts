import { create } from "zustand";
import useAuthStore from "../auth/auth.store";

const url = "https://wellschedule-production.up.railway.app"
//const url = "http://localhost:3000"

const userStore = create((set) => ({


    users: [],
    user: {},
    loading: false,
    meta: { page: 1, pageCount: 1, total: 0 },
    search: "",
    setSearch: (search: string) => set({ search }),



    createUser: async (user: any) => {
        try {

            set({ loading: true })
            const response = await fetch(`${url}/api/auth/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify(user),
            });
            const data = await response.json()

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error inesperado",
                };
            }

            set((state: any) => ({ users: [...state.users, data], meta: data.meta, loading: false }))

            return { success: true };
        } catch (error: any) {

            return { success: false, error: error.message, status: error.status };
        }
    },

    updateUser: async (id: string, user: any) => {
        try {

            set({ loading: true })
            const response = await fetch(`${url}/api/auth/user/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify(user),
            });
            const data = await response.json()

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error inesperado",
                };
            }

            set((state: any) => ({
                users: state.users.map((user: any) =>
                    user.id === id ? data : user), meta: data.meta, loading: false
            }))

            return { success: true };
        } catch (error: any) {

            return { success: false, error: error.message, status: error.status };
        }
    },


    getUsers: async (page?: any, limit?: any, search?: string) => {
        set({ loading: true })
        const params = new URLSearchParams()

        if (page) params.append("page", page)
        if (limit) params.append("limit", limit)



        const response = await fetch(`${url}/api/auth/user?${params.toString()}`)

        const { data, meta } = await response.json()

        set({ users: data, meta: meta, search, loading: false })
    },

    getUser: async (id: string) => {
        const token: any = useAuthStore.getState();
        set({ loading: true })
        try {
            const response = await fetch(`${url}/api/auth/user/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token.token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al obtener el usuario');
            }
            set({ user: data, loading: false });
            return data;
        } catch (error) {
            console.error(error);
            set({ loading: false });
            return null;
        }
    },


    deleteUser: async (id: string) => {
        try {
            set({ loading: true })
            const response = await fetch(`${url}/api/auth/user/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error inesperado",
                };
            }
            set((state: any) => ({ users: state.users.filter((user: any) => user.id !== id), meta: data.meta, loading: false }))
            return { success: true };
        } catch (error: any) {

            return { success: false, error: error.message, status: error.status };
        }
    }

}))


export default userStore