import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
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
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/auth/auth.store";
import userStore from "@/store/user/user.store";
import SelectMultiple from "@/components/Input/SelectMultiple";
import { MdFreeCancellation } from "react-icons/md";





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
  const [startDateValue, setStartDateValue] = useState("")
  const { users, getUsers }: any = userStore()
  // const [selectDataParticipants, setSelectDataParticipants] = useState([])
  const { schedules, schedule, getAllSchedules, createSchedule, getOneSchedule, deleteSchedule, updateSchedule, initSocket, loading }: any = SchedulesStore()
  const calendarRef = useRef<FullCalendar | null>(null);



  useEffect(() => {
    getAllRooms()
    initSocket()
    // getAllSchedules()
  }, [])

  useEffect(() => {
    getUsers()
  }, [])


  const loadEventsFromApi = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    const start = api.view.activeStart;
    const end = api.view.activeEnd;

    // Ajustar al inicio del día para evitar problemas de zona horaria en el backend
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    getAllSchedules(start, end);
  };

  useEffect(() => {
    loadEventsFromApi();
  }, []);



  const initialValues = {
    title: "",
    startDate: startDateValue ? toDatetimeLocal(startDateValue) : "",
    endDate: "",
    roomId: "",
    participants: [],
  };



  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required("El título es requerido"),
      roomId: Yup.string().required("La sala es requerida"),

      startDate: Yup.string()
        .required("La hora de inicio es requerida")
        .test("start-time-range", "La hora de inicio debe estar entre 07:30 y 18:30", (value) => {
          if (!value) return false;
          const startDate = new Date(value);
          if (Number.isNaN(startDate.getTime())) return false;
          const minutes = startDate.getHours() * 60 + startDate.getMinutes();
          return minutes >= 7 * 60 + 30 && minutes <= 18 * 60 + 30;
        }),
      endDate: Yup.string()
        .required("La hora de finalización es requerida")
        .test("end-time-range", "La hora de finalización debe estar entre 07:30 y 18:30", (value) => {
          if (!value) return false;
          const endDate = new Date(value);
          if (Number.isNaN(endDate.getTime())) return false;
          const minutes = endDate.getHours() * 60 + endDate.getMinutes();
          return minutes >= 7 * 60 + 30 && minutes <= 18 * 60 + 30;
        })
        .test("same-day", "La hora de finalización debe ser el mismo día que la hora de inicio", function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return false;
          const start = new Date(startDate);
          const end = new Date(value);
          if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
          return start.toDateString() === end.toDateString();
        })
        .test("end-after-start", "La hora de finalización debe ser posterior a la hora de inicio", function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return false;
          const start = new Date(startDate);
          const end = new Date(value);
          if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
          return end > start;
        }),
    }),
    onSubmit: async (values: any) => {



      if (isEdit) {
        const editData = {
          ...values,
          participants: values.participants.map((item: any) => {
            return {
              id: item.value,
              email: item.label
            }
          }) || [],
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString()
        }


        const data = await updateSchedule(schedule.id, editData)


        if (data.success) {
          setOpen(false)
          validation.resetForm()
          toast.success("Reserva actualizada exitosamente")
        }

      } else {
        const createData = {
          ...values,
          participants: values.participants.map((item: any) => {
            return {
              id: item.value,
              email: item.label
            }
          }) || [],
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString()
        }





        const data = await createSchedule(createData)

        if (data.success) {
          setOpen(false)
          validation.resetForm()
        } else {
          toast.error(data.error)
        }
      }
      // setOpen(false)
      // validation.resetForm()

    }
  })

  const roomColors: Record<string, string> = {
    "Sala Phisique": "#aa182c",
    "Sala SmartFit": "#ffb71b",

  };
  const transformReservationsToEvents = (reservations: any) => {
    if (!reservations) return [];
    return reservations.map((r: any) => {



      // const start = toDatetimeLocal(r.startDate);

      // const end = toDatetimeLocal(r.endDate)



      return {
        id: r.id,
        title: r.title,
        start: new Date(r.startDate),
        end: new Date(r.endDate),
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


  const setSelectParticipants = (options: any) => {
    validation.setFieldValue("participants", options);
  }






  return (
    <div className=" ml-2 h-screen overflow-hidden">
      <div className="flex gap-8 -mt-2  justify-center h-0 bg-red-300 absolute top-8 left-0 right-0 z-50 ">
        <Button className="cursor-pointer " onClick={() => {
          calendarRef.current?.getApi().prev();
          loadEventsFromApi();
        }}>
          Anterior
        </Button>

        <Button className="cursor-pointer " onClick={() => {
          calendarRef.current?.getApi().today();
          loadEventsFromApi();
        }}>
          Hoy
        </Button>

        <Button className="cursor-pointer " onClick={() => {
          calendarRef.current?.getApi().next();
          loadEventsFromApi();
        }}>
          Siguiente
        </Button>
      </div>
      <FullCalendar
        height="100%"

        ref={calendarRef}
        buttonText={
          {
            week: 'Semana',
            day: 'Día',

          }
        }
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin]}

        timeZone="local"
        slotMinTime="07:30:00"
        slotMaxTime="19:00:00"
        slotDuration="00:30:00"

        expandRows={true}




        locale="es"
        weekText="10px"
        allDayText="Hora"
        allDaySlot={false}

        initialDate={new Date()}
        initialView="timeGridWeek"
        slotEventOverlap={true}
        eventOverlap={true}





        windowResize={() => {

          if (window.innerWidth >= 1920) {
            calendarRef.current?.getApi().setOption('aspectRatio', 2.2);
          } else {
            calendarRef.current?.getApi().setOption('aspectRatio', 1.5);
          }

        }}



        // expandRows

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


          info.el.title = `
        Título: ${info.event.title}
        Sala: ${info.event.extendedProps.roomId.name}
        
     
        `;
        }}


        validRange={{
          start: validation.values.startTime ? new Date(validation.values.startTime) : undefined,
        }}


        selectable
        select={(info) => {

          setStartDateValue(info.startStr.toString())


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

        selectAllow={(info) => {
          const start = new Date(info.start);
          const end = new Date(info.end);
          return start >= new Date() && end >= new Date();
        }}



        eventClick={async (info: any) => {
          const { user } = info.event.extendedProps
          const { userId }: any = useAuthStore.getState()
          const isOwner = user.id === userId

          if (!isOwner) {
            toast.error("No puedes editar esta reserva")
            return
          }
          if (info?.event?.id) {
            setIsEdit(true)
            const { data } = await getOneSchedule(info?.event?.id)




            if (data) {
              validation.setValues({
                title: data.title,
                roomId: data.room.id,
                startDate: toDatetimeLocal(data.startDate),
                endDate: toDatetimeLocal(data.endDate),
                participants: data?.participants?.map((item: any) => ({
                  value: item.id,
                  label: item.email
                })) || [],
              })

              setOpen(true)

            }
          }





        }}


        headerToolbar={{
          // left: "prev today next",
          center: "",
          right: "timeGridWeek timeGridDay",
        }}
        eventContent={(args) => {


          const { user } = args.event.extendedProps
          const { userId }: any = useAuthStore.getState()

          const isOwner = user.id === userId


          return (

            <div className="h-full flex flex-wrap items-center justify-center w-full text-center text-xs text-white cursor-pointer">
              {/* <img
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
              /> */}


              <div className="absolute inset-0 bg-black/10 z-[1] w-full  " />

              <div className="relative z-10 space-y-1  flex flex-col items-center w-full mx-auto ">

                <div className="flex flex-col w-full">
                  <p className="md:text-md text-sm truncate font-bold w-full">
                    {args.event.extendedProps.user.name}
                  </p>

                  <p className="font-bold text-[10px]">
                    {args.event.start?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    -
                    {args.event.end?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {isOwner && (
                  loading ? (
                    <LoaderIcon className="mx-auto h-4 w-4 animate-spin text-red-300" />
                  ) : (
                    <MdFreeCancellation
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSchedule(args.event.id);
                      }}
                      className="mx-auto h-5 w-8 cursor-pointer text-red-600 hover:scale-110 transition-transform"
                    />
                  )
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
            <DialogTitle className="text-center">{isEdit ? "Editar sala" : "Agendar sala"}</DialogTitle>
            <DialogDescription className="text-center font-thin">Complete los datos para crear una nueva sala</DialogDescription>
          </DialogHeader>

          <form onSubmit={validation.handleSubmit}>
            <div className="space-y-2">

              <InputForm
                placeholder="Título de la reunión"
                name="title"
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
                {
                  validation.errors.roomId && (
                    <p className="text-red-500 text-xs">{validation.errors.roomId}</p>
                  )
                }
              </Select>
              <div className="flex gap-4 w-full">
                <div className="w-1/2">
                  <label className="text-sm font-thin" htmlFor="startDate">Hora de inicio</label>
                  <InputForm
                    type="datetime-local"
                    min=""
                    placeholder="Hora de inicio"
                    name="startDate"
                    validation={validation}

                  />


                </div>

                <div className="w-1/2">
                  <label className="text-sm font-thin" htmlFor="endDate">Hora de finalización</label>
                  <InputForm
                    type="datetime-local"
                    placeholder="Hora de finalización"
                    name="endDate"
                    validation={validation}
                  />
                </div>
              </div>

              <div>

                <SelectMultiple name="participants"
                  options={users && users.map((user: any) => ({ value: user.id, label: user.email }))}
                  validation={validation}
                  selectOptions={setSelectParticipants}
                  placeholder="Invite a los asistentes"

                />

              </div>

              <DialogFooter>
                <Button className="cursor-pointer" type="button" variant="outline" onClick={() => {
                  setOpen(false)
                  validation.resetForm()
                }}>
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit" className="cursor-pointer">
                  {loading ? "Guardando..." : "Guardar"}
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
