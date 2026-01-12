import DataTable from "@/components/DataTable/DataTable";
import { DataTableActions } from "@/components/DataTable/DataTableAction";
import { DataTablePagination } from "@/components/DataTable/DataTablePagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import roleStore from "@/store/role/role.store";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@/components/Input/InputForm";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import SckeletonCard from "@/components/Skeleton/SkeletonCard";

const Roles = () => {
  const { roles, rol, meta, getAllRoles, createRole, getOne, updateRole, deleteRole, loading }: any = roleStore();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);


  useEffect(() => {
    getAllRoles(pagination.pageIndex + 1, pagination.pageSize);

  }, [pagination.pageIndex, pagination.pageSize]);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: isEdit ? rol?.name : "",

    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("El nombre es requerido"),
    }),
    onSubmit: async (values: any) => {
      if (isEdit) {
        const data = await updateRole(rol.id, values);
        data.success ? toast.success("Rol actualizado exitosamente") : toast.error(`Error al actualizar el rol: ${data.error}`);
      } else {
        const data = await createRole(values);
        setOpen(false);
        data.success ? toast.success("Rol creado exitosamente") : toast.error(`Error al crear el rol: ${data.error}`);
      }
      setOpen(false);

    },
  });

  const handleEditRole = async (id: string) => {
    setIsEdit(true);
    await getOne(id);
    setOpen(true);
  };

  const handleDeleteRoleModal = (id: string) => {
    setRoleId(id);
    setDeleteOpen(true);
  };

  const rolesColumns = [

    {
      header: "Nombre",
      accessorKey: "name",
    },

    {
      header: "Acciones",
      cell: ({ row }: any) => (
        <DataTableActions
          onEdit={() => {
            handleEditRole(row.original.id)
          }}
          onDelete={() => handleDeleteRoleModal(row.original.id)}
        />
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="flex w-full justify-between mb-4 rounded-xl border py-3 px-2">
        <div>Gestión de roles</div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-visible">
          <DialogHeader className="font-thin">
            <DialogTitle className="text-center">
              {isEdit ? "EDITAR ROL" : "CREAR ROL"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isEdit ? "Complete los datos para editar el rol" : "Complete los datos para crear un nuevo rol"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            validation.handleSubmit()
          }}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <label >Nombre del rol</label>
                <InputForm
                  name="name"
                  placeholder="Ingrese el nombre del rol"
                  validation={validation}
                />
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

          <SckeletonCard/>

        ) : (
          <>
            <DataTable
              data={roles?.data || roles || []}
              columns={rolesColumns}
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
            <Button className="cursor-pointer" onClick={() => setDeleteOpen(false)}>
              Cerrar
            </Button>
            <Button
              onClick={async () => {
                const data = await deleteRole(roleId);
                if (data.success === true) {
                  toast.success("Registro eliminado exitosamente");
                } else {
                  toast.error("Error al eliminar el registro");
                }
                setDeleteOpen(false);
                getAllRoles(pagination.pageIndex + 1, pagination.pageSize);
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

export default Roles;
