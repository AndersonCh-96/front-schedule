import { Calendar as CalendarIcon, Clock3, PencilIcon, Trash2Icon, Users } from "lucide-react";
import SchedulesStore from "@/store/schedules/schedule.store";
import useAuthStore from "./store/auth/auth.store";
import { useEffect } from "react";

const formatDate = (date: Date) =>
  date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const App = () => {
  // const { isAuthenticated, userId }: any = useAuthStore();
  const { schedules, getAllSchedules }: any = SchedulesStore();

  const allSchedules = Array.isArray(schedules) ? schedules : [];



  console.log("allSchedules", allSchedules)
  const today = new Date();

  useEffect(() => {
    getAllSchedules()
  }, []);

  useEffect(() => {

  }, []);

  const todayCount = allSchedules.filter((event: any) => {
    const start = new Date(event.startDate);
    return (
      start.getFullYear() === today.getFullYear() &&
      start.getMonth() === today.getMonth() &&
      start.getDate() === today.getDate()
    );
  }).length;

  const nextAppointment = allSchedules
    .map((event: any) => ({
      ...event,
      date: new Date(event.startDate),
    }))
    .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())[0];

  const sampleAppointments = allSchedules.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="grid gap-5 md:grid-cols-3">
          {/* <article className="rounded-3xl border border-indigo-100 bg-white/80 p-5 shadow-lg shadow-indigo-100/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-indigo-500 uppercase tracking-[0.3em]">Total</p>
              <CalendarIcon className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">{allSchedules.length}</p>
            <p className="text-sm text-slate-500 mt-2">agendamientos registrados</p>
          </article> */}

          <article className="rounded-3xl border border-slate-100 bg-slate-900/90 p-5 text-white shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.3em] uppercase text-slate-300">Hoy</p>
              <Clock3 className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-4 text-4xl font-semibold">{todayCount}</p>
            <p className="text-sm text-slate-300 mt-2">agendamientos programados hoy</p>
          </article>

          <article className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 shadow-lg shadow-amber-200/40">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.3em] uppercase text-amber-500">Próximo</p>
              <Users className="h-5 w-5 text-amber-500" />
            </div>
            {nextAppointment ? (
              <>
                <p className="mt-4 text-2xl font-semibold text-slate-900">{nextAppointment.title}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {formatDate(nextAppointment.date)}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No hay reuniones próximas</p>
            )}
          </article>
        </div>

        <section className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
          <div className="flex items-center justify-between pb-4">
            <div>

              <h2 className="text-2xl font-bold text-slate-900">Últimas reservas</h2>
            </div>
            <span className="text-xs text-slate-500">
              {sampleAppointments.length} elementos
            </span>
          </div>
          <ul className="space-y-4">
            {sampleAppointments.length ? (
              sampleAppointments.map((appointment: any) => {
                const start = new Date(appointment.startDate);
                const end = new Date(appointment.endDate || start.getTime());
                return (
                  <li
                    key={appointment.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 hover:bg-slate-100  cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{appointment.title}</p>
                      <p className="text-sm text-slate-500">
                        {appointment.room?.name || "Sala sin nombre"}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-slate-900">
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {" - "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-slate-500">
                        {start.toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      {
                        <div className="flex gap-2 justify-end mt-2">

                          <Trash2Icon size={18} className=" text-slate-500 text-xs hover:scale-115 transition-all duration-200 cursor-pointer" />
                          <PencilIcon size={18} className="text-slate-500 text-xs hover:scale-115 transition-all duration-200 cursor-pointer" />
                        </div>
                      }
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
                No hay agendamientos para mostrar todavía.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default App;
