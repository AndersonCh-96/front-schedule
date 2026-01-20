
import { create } from "zustand";
import { persist } from "zustand/middleware";

const url = "https://wellschedule-production.up.railway.app"

const useAuthStore = create(
    persist((set) => ({
        user: null,
        userId: null,
        token: null,
        roles: [],
        avatar: null,
        isAuthenticated: false,
        loading: false,
        error: null,


        loginUser: async (email: string, password: string) => {

            try {
                set({ loading: true })
                const response = await fetch(`${url}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                })
                const data = await response.json()
                console.log("Data", data)

                if (data.statusCode === 401) return { success: false, error: data.message }

                set({ user: data.email, userId: data.id, token: data.token, roles: data.roles, avatar: data.photoUrl, isAuthenticated: true, loading: false })
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