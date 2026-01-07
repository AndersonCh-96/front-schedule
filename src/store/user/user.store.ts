import { create } from "zustand";

const userStore = create((set) => ({


    users: [],
    user: {},
    loading: false,
    meta: { page: 1, pageCount: 1, total: 0 },


    getUsers: async () => {
        set({ loading: true })
        const response = await fetch("http://localhost:3000/api/auth/user")
        const data = await response.json()
        console.log("data", data)
        set({ users: data || data, meta: data.meta || { page: 1, pageCount: 1, total: data.length }, loading: false })
    },

}))


export default userStore