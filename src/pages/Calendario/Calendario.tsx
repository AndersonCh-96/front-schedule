import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import InputForm from "@/components/Input/InputForm";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import roomStore from "@/store/room/room.store";
import SchedulesStore from "@/store/schedules/schedule.store";
import { ArrowRightSquare, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/auth/auth.store";




const TIME_RANGE_MINUTES = {
  start: 8 * 60 + 30,
  end: 17 * 60 + 30,
};

const getMinutesFromTime = (value?: string) => {
  if (!value) return undefined;
  const [hour, minute] = value.split(":").map((segment) => Number(segment));
  if (Number.isNaN(hour) || Number.isNaN(minute)) return undefined;
  return hour * 60 + minute;
};

const isWithinAllowedRange = (minutes?: number) => {
  if (minutes === undefined) return false;
  return minutes >= TIME_RANGE_MINUTES.start && minutes <= TIME_RANGE_MINUTES.end;
};

const toDatetimeLocal = (iso?: string) => {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const offsetMs = parsed.getTimezoneOffset() * 60000;
  return new Date(parsed.getTime() - offsetMs).toISOString().slice(0, 16);
};





const Calendario = () => {


  const [open, setOpen] = useState(false)
  const { rooms, getAllRooms }: any = roomStore()
  const [isEdit, setIsEdit] = useState(false)

  const { schedules, schedule, getAllSchedules, createSchedule, getOneSchedule, deleteSchedule, updateSchedule, initSocket }: any = SchedulesStore()
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    getAllRooms()
    initSocket()
    // getAllSchedules()
  }, [])


  const loadEventsFromApi = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const start = api.view.activeStart.toISOString();
    const end = api.view.activeEnd.toISOString();

    console.log("start", start)
    console.log("end", end)

    getAllSchedules(start, end);
  };

  useEffect(() => {
    loadEventsFromApi();
  }, []);



  const initialValues = {
    title: isEdit ? schedule?.title || "" : "",
    startDate: isEdit ? toDatetimeLocal(schedule?.startDate) : "",
    endDate: isEdit ? schedule?.endDate : "",
    roomId: isEdit ? schedule?.room?.id || "" : "",
  };

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required("El título es requerido"),
      roomId: Yup.string().required("La sala es requerida"),
      startDate: Yup.string()
        .required("La hora de inicio es requerida")
        .test("start-time-range", "La hora de inicio debe estar entre 08:30 y 17:30", (value) => {
          const startDate = value ? new Date(value) : undefined;
          if (!startDate || Number.isNaN(startDate.getTime())) return false;
          const minutes = startDate.getHours() * 60 + startDate.getMinutes();
          return isWithinAllowedRange(minutes);
        }),
      endDate: Yup.string()
        .required("La hora de finalización es requerida")
        .test("end-time-range", "La hora de finalización debe estar entre 08:30 y 17:30", (value) =>
          isWithinAllowedRange(getMinutesFromTime(value))
        )
        .test("end-after-start", "La hora de finalización debe ser posterior a la hora de inicio", function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return false;
          const startDateNew = new Date(startDate);
          if (Number.isNaN(startDateNew.getTime())) return false;
          const endMinutes = getMinutesFromTime(value);
          if (endMinutes === undefined) return false;
          const endDate = new Date(startDateNew);
          endDate.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);
          return endDate > startDateNew;
        }),
    }),
    onSubmit: async (values: any) => {
      console.log(values);
      if (isEdit) {
        const data = await updateSchedule(schedule.id, values)

        if (data.success) {
          setOpen(false)
          validation.resetForm()
          toast.success("Reserva actualizada exitosamente")
        }

      } else {
        const data = await createSchedule(values)
        console.log("data", data)
        if (data.success) {
          setOpen(false)
          validation.resetForm()
        }
      }
      // setOpen(false)
      // validation.resetForm()

    }
  })

  const roomColors: Record<string, string> = {
    "Sala Phisique": "#757575",
    "Sala SmartFit": "#eba200",

  };
  const transformReservationsToEvents = (reservations: any) => {
    return reservations?.map((r: any) => {

      console.log("r", r)
      const start = new Date(r.startDate);

      const [hour, minute, second] = r.endDate
        .split(":")
        .map(Number);

      const end = new Date(start);
      end.setHours(hour, minute, second || 0, 0);


      if (end <= start) {
        end.setDate(end.getDate() + 1);
      }

      return {
        id: r.id,
        title: r.title,
        start,
        end,
        backgroundColor: roomColors[r.room.name],
        borderColor: roomColors[r.room.name],
        textColor: "#000000",
        extendedProps: {
          roomId: r.room,
          user: r.user,
          status: r.status,
        },
      };
    });
  };


  const handleDeleteSchedule = async (id: string) => {
    const result = await deleteSchedule(id)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success("Reserva eliminada exitosamente")
  }





  return (
    <div className="p-1">
      <div className="flex gap-8 mb-2 justify-center">
        <Button onClick={() => {
          calendarRef.current?.getApi().prev();
          loadEventsFromApi();
        }}>
          Anterior
        </Button>

        <Button onClick={() => {
          calendarRef.current?.getApi().today();
          loadEventsFromApi();
        }}>
          Hoy
        </Button>

        <Button onClick={() => {
          calendarRef.current?.getApi().next();
          loadEventsFromApi();
        }}>
          Siguiente
        </Button>
      </div>
      <FullCalendar

        ref={calendarRef}
        buttonText={
          {
            week: 'Semana',

          }
        }
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        locale="es"
        allDayText="Hora"
        initialDate={new Date()}
        expandRows
        handleWindowResize={true}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}



        hiddenDays={[0, 6]}
        firstDay={1}
        dayHeaderFormat={{
          day: "numeric",
          month: "short",
        }}
        eventDidMount={(info) => {
          console.log("info.event", info.event)
          info.el.title = `
        Título: ${info.event.title}
        Sala: ${info.event.extendedProps.roomId.name}
     
        `;
        }}



        selectable
        select={(info) => {
          validation.resetForm()
          setIsEdit(false)
          // setSelectedSlot({
          //   start: info.start.toISOString(),
          //   end: info.end.toISOString(),
          // })
          // validation.setFieldValue("startTime", info.start.toISOString())
          // validation.setFieldValue("endTime", info.end.toISOString())
          setOpen(true)
        }}





        eventClick={async (info) => {
          const { user } = info.event.extendedProps
          const { userId }: any = useAuthStore.getState()
          const isOwner = user.id === userId
          if (!isOwner) {
            toast.error("No puedes editar esta reserva")
            return
          }
          await getOneSchedule(info.event.id)
          setOpen(true)
          setIsEdit(true)
          console.log(info.event.id);
          console.log(info.event.title);
          console.log("Esta ingresando", info.event.start?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
          console.log("Esta ingresando", info.event.end?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        }}


        headerToolbar={{
          // left: "prev today next",
          center: "title",
          right: "timeGridWeek",
        }}
        eventContent={(args) => {

          console.log("LLego", args.event.extendedProps)
          const { user } = args.event.extendedProps
          const { userId }: any = useAuthStore.getState()

          const isOwner = user.id === userId


          return (
            <div className="relative flex h-full w-full flex-col items-center justify-center text-center text-xs text-white">

            
              <img
                src={
                  args.event.extendedProps?.roomId?.name === "Sala SmartFit"
                    ? "/img/smartfit.png"
                    : "/img/phisique.png"
                }
                alt="Logo sala"
                className="
      pointer-events-none
      absolute
      inset-[20%]
      m-auto
      h-25
      w-25
      object-contain
      opacity-50
      z-0
    "
              />


              <div className="absolute inset-0 bg-black/10 z-[1]" />

              <div className="relative z-10 space-y-1 px-1">
                <p className="font-semibold text-[13px] leading-tight">
                  {args.event.title}
                </p>

                <p className="text-[10px] truncate">
                  {args.event.extendedProps.user.email}
                </p>

                <p className="text-[10px]">
                  {args.event.start?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  -
                  {args.event.end?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>

                {isOwner && (
                  <Trash2Icon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSchedule(args.event.id);
                    }}
                    className="mx-auto h-4 w-4 cursor-pointer text-red-300 hover:scale-110"
                  />
                )}
              </div>
            </div>


          )
        }}
        events={transformReservationsToEvents(schedules)}
      />


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="r">
            <DialogTitle className="text-center">{isEdit ? "Editar reunión" : "Agendar reunión"}</DialogTitle>
            <DialogDescription className="text-center font-thin">Complete los datos para crear una nueva reunión</DialogDescription>
          </DialogHeader>

          <form onSubmit={validation.handleSubmit}>
            <div className="space-y-4">

              <InputForm
                placeholder="Título de la reunión"
                name="title"
                validation={validation}
              />

              <InputForm
                type="datetime-local"
                placeholder="Hora de inicio"
                name="startDate"
                validation={validation}

              />

              <Select
                onValueChange={(value) => {
                  validation.setFieldValue("roomId", value);
                }}
                value={validation.values.roomId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una sala" />
                </SelectTrigger>
                <SelectContent>
                  {
                    rooms.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              <InputForm
                type="time"
                placeholder="Hora de finalización"
                name="endDate"
                validation={validation}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpen(false)
                  validation.resetForm()
                }}>
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer">
                  Guardar
                </Button>
              </DialogFooter>
            </div>
          </form>



        </DialogContent>

      </Dialog>
    </div >
  );
};

export default Calendario;
