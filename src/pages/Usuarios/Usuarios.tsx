import DataTable from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import useUserStore from "@/store/user/user.store";
import { DataTableActions } from "@/components/DataTable/DataTableAction";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@/components/Input/InputForm";

import roleStore from "@/store/role/role.store";
import SelectMultiple from "@/components/Input/SelectMultiple";
import { DataTablePagination } from "@/components/DataTable/DataTablePagination";

import { toast } from "sonner";
import SckeletonCard from "@/components/Skeleton/SkeletonCard";


const Usuarios = () => {

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { users, user, getUsers, getUser, meta, createUser, updateUser, deleteUser, loading }: any = useUserStore();
  const { roles, getAllRoles }: any = roleStore();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    search: ""
  });


  const [deleteOpen, setDeleteOpen] = useState(false);


  const validation = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      roles: []
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      email: Yup.string().email("Email invalido").required("El email es requerido"),
      password: Yup.string().required("La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
      roles: Yup.array().required("Seleccione al menos un rol").min(1, "Seleccione al menos un rol"),
    }),
    onSubmit: async () => {

      if (isEdit) {
        const formUserUpdate = {
          name: validation.values.name,
          email: validation.values.email,
          password: validation.values.password,
          roles: validation.values.roles.map((item: any) => item.value)
        }
        const update = await updateUser(user.id, formUserUpdate);
        if (update.success) {
          setOpen(false);
          validation.resetForm();
          toast.success("Usuario actualizado correctamente");
        } else {
          toast.error("Error al actualizar usuario");
        }
      } else {

        const formUserCreate = {
          name: validation.values.name,
          email: validation.values.email,
          password: validation.values.password,
          roles: validation.values.roles.map((item: any) => item.label)
        }

        const addUser = await createUser(formUserCreate);

        if (addUser.success) {
          setOpen(false);
          validation.resetForm();
          toast.success("Usuario creado correctamente");
        } else {
          toast.error("Error al crear usuario");
        }



      }



    }
  })



  useEffect(() => {

    getAllRoles();
  }, []);

  useEffect(() => {
    getUsers(pagination.pageIndex + 1, pagination.pageSize, pagination.search);
  }, [pagination.pageIndex, pagination.pageSize, pagination.search]);

  const selectOptions = (options: any) => {
    validation.setFieldValue("roles", options);
  }

  const handleEditUser = async (id: number) => {
    const userData = await getUser(id);
    if (userData) {
      validation.setValues({
        name: userData.name,
        email: userData.email,
        password: '', // No se debe precargar la contraseña
        roles: userData.roles.map((role: any) => ({ value: role.id, label: role.name }))
      });
      setIsEdit(true);
      setOpen(true);
    }
  }

  const handleDeleteRoleModal = async (id: number) => {

    setDeleteOpen(true)
    await getUser(id)

  }

  const usersColumns = [

    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Estado",
      accessorKey: "isActive",
      cell: ({ row }: any) => (
        <span className="text-green-500">{row.original.isActive ? "Activo" : "Inactivo"}</span>
      ),
    },
    {
      header: "Roles",
      accessorKey: "roles",
      cell: ({ row }: any) => (
        <span className="">{row.original.roles.map((item: any) => item.name).join(", ")}</span>
      ),
    },

    {
      header: "Acciones",
      cell: ({ row }: any) => (
        <DataTableActions
          onEdit={() => {

            handleEditUser(row.original.id)
          }}
          onDelete={() => {
            handleDeleteRoleModal(row.original.id)
          }}
        />
      )
    }
  ]



  return (
    <div className="p-6">
      <div className="flex w-full justify-between mb-4 rounded-xl border py-3 px-2">
        <div>Gestión de usuarios</div>
        <Button
          onClick={() => {
            setOpen(true);
            setIsEdit(false);
            validation.resetForm();
          }}
          className="cursor-pointer"
        >
          Agregar
        </Button>
      </div>
      {/* <div className="flex items-center mb-2">
        <input type="text" className="border rounded px-3 py-2" value={search} onChange={(e) => {
          setPagination({ ...pagination, search: e.target.value })
        }} placeholder="Buscar usuario" />
        <Search className="ml-2" />
      </div> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] overflow-visible">
          <DialogHeader className="font-thin">
            <DialogTitle className="text-center">
              {isEdit ? "EDITAR USUARIO" : "CREAR USUARIO"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isEdit ? "Complete los datos para editar el usuario" : "Complete los datos para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()

            validation.handleSubmit()
          }}>
            <div className="grid gap-4 w-full">
              <div className="flex gap-4 ">
                <div className="grid gap-3 w-full">
                  <label >Nombre del usuario</label>
                  <InputForm
                    name="name"
                    placeholder="Nombre del usuario"
                    validation={validation}
                  />
                </div>

                <div className="grid gap-3 w-full">
                  <label >Email del usuario</label>
                  <InputForm
                    name="email"
                    placeholder="Email del usuario"
                    validation={validation}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <label >Contraseña</label>
                <InputForm
                  name="password"
                  type="text"
                  placeholder="Ingrese la contraseña"
                  validation={validation}
                />
              </div>

              <div className="grid gap-3">
                <label >Roles</label>
                <SelectMultiple name="roles" selectOptions={selectOptions} validation={validation} options={roles && roles.map((role: any) => ({ value: role.id, label: role.name }))} />
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
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {
        loading ? (
          <SckeletonCard />
        ) : (

          <>
            <DataTable
              data={users || []}
              columns={usersColumns}
            />
            <DataTablePagination
              pageIndex={pagination.pageIndex}
              pageCount={meta?.pageCount || 1}
              canPreviousPage={pagination.pageIndex > 0}
              canNextPage={pagination.pageIndex < (meta?.pageCount || 1) - 1}
              onPrevious={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
              onNext={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
            />
          </>
        )
      }




      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="">
          <DialogHeader>
            <div className="flex flex-col items-center">
              <DialogTitle className="text-center p-4">
                <Trash2Icon className="text-red-400" />
              </DialogTitle>
              <DialogDescription className="text-center text-md p-2">
                Está seguro que desea eliminar el registro
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex gap-2 justify-end">
            <Button className="cursor-pointer" onClick={() => {
              setDeleteOpen(false);
            }}>
              Cerrar
            </Button>
            <Button
              onClick={async () => {
                const data = await deleteUser(user?.id);
                if (data.success === true) {
                  toast.success("Registro eliminado exitosamente");
                } else {
                  toast.error("Error al eliminar el registro");
                }
                setDeleteOpen(false);
                getUsers(pagination.pageIndex + 1, pagination.pageSize, pagination.search);
              }}
              className="cursor-pointer"
            >
              Sí, Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
