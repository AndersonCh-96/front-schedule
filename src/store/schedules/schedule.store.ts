import { create } from "zustand";
import useAuthStore from "../auth/auth.store";
import { io } from "socket.io-client";


// interface ReservationState {
//     schedules: any[];
//     socket: Socket | null;
//     loading: boolean;
//     schedule: any;
//     meta: { page: number; pageCount: number; total: number };
//     success: boolean;

//     getAllSchedules: () => Promise<void>;
//     initSocket: () => void;
//     addSchedule: (r: any) => void;
//     updateSchedule: (r: any) => void;
//     deleteSchedule: (id: string) => void;
// }

const url= "https://wellschedule-production.up.railway.app"

const SchedulesStore = create<any>((set, get) => ({

    schedules: [],
    loading: false,
    schedule: {},
    meta: { page: 1, pageCount: 1, total: 0 },
    success: false,
    socket: null,

    getAllSchedules: async (startDate?: string, endDate?: string) => {
        set({ loading: true })
        const params = new URLSearchParams()
        if (startDate) params.append("startDate", startDate)
        if (endDate) params.append("endDate", endDate)
        console.log("params", params)

        const response = await fetch(`${url}/api/reservation?${params.toString()}`)
        const data = await response.json()

        console.log("data", data)
        set({ schedules: data.data, loading: false })
    },

    initSocket: () => {

        //evita crear multiples sockets
        if (get().socket) return;
        //inicializa el socket
        const socket = io(`${url}`);
        //escucha el evento RESERVATION_CREATED
        socket.on('EVENT_CREATED', (reservation) => {
            set((state: any) => ({
                schedules: [...state.schedules, reservation],
            }));
        });

        socket.on('EVENT_UPDATED', (reservation) => {
            set((state: any) => ({
                schedules: state.schedules.map((r: any) =>
                    r.id === reservation.id ? reservation : r
                ),
            }));
        });

        socket.on('EVENT_DELETED', (id) => {
            set((state: any) => ({
                schedules: state.schedules.filter((r: any) => r.id !== id),
            }));
        });

        set({ socket });

    },

    getOneSchedule: async (id: string) => {
        try {
            set({ loading: true })
            const response = await fetch(`${url}/api/reservation/${id}`)
            const data = await response.json()
            console.log("data", data)
            set({ schedule: data, loading: false })
            return { success: true, data }
        } catch (error) {
            console.log("error", error)
            return { success: false }
        }
    },

    updateSchedule: async (id: string, body: any) => {
        const token: any = useAuthStore.getState()
        try {
            set({ loading: true })
            const response = await fetch(`${url}/api/reservation/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token ? token.token : ""}`,
                },
                body: JSON.stringify(body)
            })

            const data = await response.json();

            console.log("data", data)

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error inesperado",
                };
            }
            set((state: any) => ({
                schedules: state.schedules.map((schedule: any) =>
                    schedule.id === id ? { ...schedule, ...data } : schedule
                ),
                loading: false,
            }));
            return { success: true };

        } catch (error: any) {
            console.log(error)
            set({ loading: false });
            return { success: false, error: error.message, status: error.status };
        }

    },

    createSchedule: async (body: any) => {
        const token: any = useAuthStore.getState();
        try {
            set({ loading: true });
            const response = await fetch(`${url}/api/reservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token ? token.token : ""}`,
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error inesperado",
                };
            }
            set((state: any) => ({
                schedules: [...state.schedules, data],
                loading: false,
            }));
            return { success: true };
        } catch (error: any) {
            console.log(error)
            set({ loading: false });
            return { success: false, error: error.message, status: error.status };
        }
    },

    deleteSchedule: async (id: string) => {

        const token: any = useAuthStore.getState();
        try {
            set({ loading: true })
            const response = await fetch(`${url}/api/reservation/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token ? token.token : ""}`,
                },
            })

            const data = await response.json()


            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || "Error inesperado",
                };
            }

            set((state: any) => ({
                schedules: state.schedules?.filter((schedule: any) => schedule.id !== id)
                ,
                loading: false,
            }));
            return { success: true };
        } catch (error: any) {
            console.log(error)
            return { success: false, error: error.message, status: error.status };
        }

    }

}))


export default SchedulesStore

