import { Clock3, User2, Calendar1, Users2Icon } from "lucide-react";
import SchedulesStore from "@/store/schedules/schedule.store";

import { useEffect } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="grid gap-5 md:grid-cols-3">
        

          <article className="rounded-3xl border border-slate-100 bg-slate-900/90 p-5 text-white shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-[0.3em] uppercase text-slate-300">Hoy</p>
              <Clock3 className="h-5 w-5 text-slate-300" />
            </div>
            <p className="mt-4 text-4xl font-semibold">{todayCount}</p>
            <p className="text-sm text-slate-300 mt-2">Agendamientos programados hoy</p>
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
                    <Tabs defaultValue="tab1" className="w-full" >
                      <TabsList>
                        <TabsTrigger className="cursor-pointer" value="tab1">
                          <Calendar1/>
                        </TabsTrigger>
                       {
                        appointment.participants && appointment.participants.length > 0 && (
                          <TabsTrigger className="cursor-pointer" value="tab2"><Users2Icon/></TabsTrigger>
                        )
                       }
                      </TabsList>
                      <TabsContent className="flex items-center justify-between" value="tab1">
                        <div>
                          <div className="flex items-center gap-1"> <User2 className="h-4 w-4 text-slate-500" /> <p>{appointment.user?.name}</p></div>
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
                      </TabsContent>
                      <TabsContent value="tab2">
                        {
                          appointment.participants && appointment.participants.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {
                                appointment.participants?.map((participant: any) => (
                                  <div className="border shadow-sm rounded-lg p-2"  key={participant.id}>
                                    <p className="text-xs">{participant?.email}</p>
                                  </div>
                                ))
                              }
                            </div>
                          )
                        }
                      </TabsContent>
                    </Tabs>
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
