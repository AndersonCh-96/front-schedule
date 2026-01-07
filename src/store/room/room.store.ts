import { create } from "zustand";

const roomStore = create((set) => ({
    rooms: [],
    rom: {},
    loading: false,

    getAllRooms: async () => {
        set({ loading: true });
        const response = await fetch("http://localhost:3000/api/room");
        const data = await response.json();
        set({ rooms: data, loading: false });
    },

    getOne: async (id: string) => {
       
        set({ loading: true });
        const response = await fetch(`http://localhost:3000/api/room/${id}`);
        const data = await response.json()
        console.log("data", data)
        set({ room: data, loading: false })

    },

    createRoom: async (room: any) => {
        try {
            set({ loading: true });
            const response = await fetch("http://localhost:3000/api/room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(room),
            });
            if (!response.ok) throw new Error("Error en el servidor");
            const data = await response.json();
            console.log("data", data)
            set((state: any) => ({ rooms: [...state.rooms, data], loading: false }));
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error?.message };
        }
    },

    updateRoom: async (id: string, body: any) => {
        try {
            set({ loading: true })
            const response = await fetch(`http://localhost:3000/api/room/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Error en el servidor");
            const data = await response.json();

            // Actualizar la sala en la lista de rooms
            set((state: any) => ({
                rooms: state.rooms.map((room: any) =>
                    room.id === id ? { ...room, ...data } : room
                ),
                loading: false
            }));
            return { success: true };

        } catch (error: any) {
            set({ loading: false });
            return { success: false, error: error?.message };
        }
    },
    deleteRoom: async (id: string) => {
        try {
            set({ loading: true });
            const response = await fetch(`http://localhost:3000/api/room/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Error en el servidor");
            set((state: any) => ({
                rooms: state.rooms.filter((room: any) => room.id !== id),
                loading: false,
            }));
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

}))


export default roomStore