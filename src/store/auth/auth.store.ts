import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist((set) => ({
        user: null,
        userId: null,
        token: null,
        roles: [],
        isAuthenticated: false,
        loading: false,
        error: null,


        loginUser: async (email: string, password: string) => {

            try {
                set({ loading: true })
                const response = await fetch("http://localhost:3000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                })
                const data = await response.json()

                if (data.statusCode === 401) return { success: false, error: data.message }

                console.log("data", data)

                console.log("data", data)
                set({ user: data.email, userId: data.id, token: data.token, roles: data.roles, isAuthenticated: true, loading: false })
                return { success: true }
            } catch (error: any) {
                set({ error: error, loading: false })
            }

        },
        logoutUser: () => {
            set({ user: null, token: null, isAuthenticated: false })
        },


    }),
        {
            name: "auth",
            // storage: createJSONStorage(() => localStorage),
        }
    ))


export default useAuthStore