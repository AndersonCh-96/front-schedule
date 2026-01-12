import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import roomStore from "@/store/room/room.store";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@/components/Input/InputForm";
import { toast } from "sonner";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SckeletonCard from "@/components/Skeleton/SkeletonCard";

const Room = () => {
  const { rooms, room, getAllRooms, createRoom, getOne, loading, deleteRoom, updateRoom }: any =
    roomStore();

  const [form, setForm]: any = useState({
    name: "",
    description: "",
  });

  const [romStatus, setRoomStatus] = useState(true);

  const [open, setOpen] = useState<any>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roomId, setRoomId] = useState<any>("");

  useEffect(() => {
    getAllRooms();
  }, []);

  const validation: any = useFormik({
    enableReinitialize: true,
    // initialValues: {
    //   name: (room && room.name) || "",
    //   description: (room && room.description) || "",
    //   status: (room && room.status) || true,
    // },
    initialValues: {
      name: isEdit ? room?.name : "",
      description: isEdit ? room?.description : "",
      status: isEdit ? room?.status : true,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("El nombre es requerido"),
      description: Yup.string().required("La descripción es requerida"),
    }),
    onSubmit: async (values: any) => {
      if (isEdit) {
        const data = await updateRoom(room.id, values);
        data.success ? toast.success("Sala actualizada exitosamente") : toast.error(`Error al actualizar la sala: ${data.error}`);
      } else {
        const data = await createRoom(values);
        data.success ? toast.success("Sala creada exitosamente") : toast.error(`Error al crear la sala: ${data.error}`);
      }
      setOpen(false);

    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("form", form);
    const roomForm = {
      ...form,
      status: romStatus,
    };

    console.log("roomForm", roomForm);
  };

  const handleEditRoom = async (id: string) => {
    setIsEdit(true);
    await getOne(id);
    setOpen(true);
  };

  const handleDeleteRoomModal = (id: string) => {
    setRoomId(id)
    setDeleteOpen(true)
  };

  return (
    <div className="p-6   flex flex-col w-full">
      <div className="flex w-full  justify-between mb-4 rounded-xl border py-3 px-2">
        <div>Gestión de salas</div>

        <Button
          onClick={() => {
            setOpen(true);
            setIsEdit(false);

          }}
          className="cursor-pointer"
        >
          Agregar
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          {/* <DialogTrigger asChild>
            <Button className="cursor-pointer">Agregar</Button>
          </DialogTrigger> */}
          <DialogContent className="sm:max-w-[425px] overflow-visible">
            <DialogHeader className=" font-thin">
              <DialogTitle className="text-center">
                {isEdit ? "EDITAR SALA" : "CREAR SALA"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {isEdit ? "Complete los datos para editar la sala" : "Complete los datos para crear una nueva sala"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              validation.handleSubmit()
            }}>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <label>Nombre de la sala</label>


                  <InputForm
                    name="name"
                    placeholder="Sala de reuniones A"
                    validation={validation}
                  />
                </div>

                <div className="grid gap-3">
                  <label >Descripción</label>
                  <InputForm
                    name="description"
                    placeholder="Descripción de la sala"
                    validation={validation}
                  />
                </div>

                <div className="grid gap-3">
                  <label >Estado</label>
                  <Select
                    onValueChange={(value) => {
                      validation.setFieldValue("status", value === "true");
                    }}
                    value={validation.values.status ? "true" : "false"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Activo</SelectItem>
                      <SelectItem value="false">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-2">

                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    validation.resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer">
                  Guardar sala
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 flex-wrap">
        {
          loading ? (
            <SckeletonCard />
          ) : (
            rooms.map((item: any) => (
              <Card key={item.id} className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(33.333%-11px)]">
                <CardHeader>

                  <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                    <img
                      src={item.image || "https://images.pexels.com/photos/10041250/pexels-photo-10041250.jpeg"}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                  <CardTitle>
                    {item.name}
                  </CardTitle>
                  <CardDescription>
                    {item.description}
                  </CardDescription>
                  <CardAction className="flex  gap-2">
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        handleEditRoom(item.id);
                        validation.resetForm();
                      }}
                    >
                      <PencilIcon className="hover:text-red-500 cursor-pointer " />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDeleteRoomModal(item.id);

                      }}
                      className="cursor-pointer"
                    >
                      <Trash2Icon className=" text-white-400 " />
                    </Button>
                  </CardAction>

                </CardHeader>


                <CardFooter className="flex justify-between">

                </CardFooter>
              </Card>
            ))
          )
        }
      </div>



      <div>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="">
            <DialogHeader>
              <div className="flex flex-col items-center">

                <DialogTitle className="text-center p-4"><Trash2Icon className=" text-red-400 " /></DialogTitle>
                <DialogDescription className="text-center text-md p-2">
                  Esta seguro que desea eliminar el registro
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex gap-2 justify-end">
              <Button className="cursor-pointer" onClick={() => setDeleteOpen(false)}>Cerrar</Button>
              <Button onClick={async () => {
                const data = await deleteRoom(roomId)
                if (data.success === true) {
                  toast.success("Registro eliminado exitosamente")
                } else {
                  toast.error("Error al eliminar el registro")
                }
                setDeleteOpen(false)
              }
              } className="cursor-pointer">Si, Eliminar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
};

export default Room;
