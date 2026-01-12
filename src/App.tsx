import {  Clock3 } from "lucide-react";
import SchedulesStore from "@/store/schedules/schedule.store";

import { useEffect } from "react";


const App = () => {

  const { schedules, getAllSchedules }: any = SchedulesStore();

  const allSchedules = Array.isArray(schedules) ? schedules : [];



  
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
          </article>  */}

          <article className="rounded-3xl border border-slate-100 bg-slate-900/90 p-5 text-white shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.3em] uppercase text-slate-300">Hoy</p>
              <Clock3 className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-4 text-4xl font-semibold">{todayCount}</p>
            <p className="text-sm text-slate-300 mt-2">agendamientos programados hoy</p>
          </article>

        </div>

        <section className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-xl shadow-slate-200/70">
          <div className="flex items-center justify-between pb-4">
            <div>

              <h2 className="text-2xl font-bold text-slate-900">Últimas reservas</h2>
            </div>
            <span className="text-xs text-slate-500">
              {allSchedules.length} elementos
            </span>
          </div>
          <ul className="space-y-4">
            {allSchedules.length ? (
              allSchedules.map((appointment: any) => {
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
