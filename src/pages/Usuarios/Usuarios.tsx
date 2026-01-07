import DataTable from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import useUserStore from "@/store/user/user.store";
import { DataTableActions } from "@/components/DataTable/DataTableAction";

const Usuarios = () => {

  const [open, setOpen] = useState(false);
  const { users, getUsers }: any = useUserStore();


  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const usersColumns = [

    {
      header: "Email",
      accessorKey: "email",
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
            // handleEditRole(row.original.id)
          }}
          onDelete={() => {
            // handleDeleteRoleModal(row.original.id)
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
            // setOpen(true);
            // setIsEdit(false);
            // validation.resetForm();
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
              {/* {isEdit ? "EDITAR ROL" : "CREAR ROL"} */}
            </DialogTitle>
            <DialogDescription className="text-center">
              {/* {isEdit ? "Complete los datos para editar el rol" : "Complete los datos para crear un nuevo rol"} */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            // e.preventDefault()
            // validation.handleSubmit()
          }}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <label >Nombre del rol</label>
                {/* <InputForm
                  name="name"
                  placeholder="Ingrese el nombre del rol"
                  validation={validation}
                /> */}
              </div>

            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  // validation.resetForm();
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

      <DataTable
        data={users || []}
        columns={usersColumns}
      />

      {/* <DataTablePagination
        pageIndex={pagination.pageIndex}
        pageCount={meta?.pageCount || 1}
        canPreviousPage={pagination.pageIndex > 0}
        canNextPage={pagination.pageIndex < (meta?.pageCount || 1) - 1}
        onPrevious={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
        onNext={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
      /> */}

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
              // setDeleteOpen(false);
            }}>
              Cerrar
            </Button>
            <Button
              // onClick={async () => {
              //   const data = await deleteRole(roleId);
              //   if (data.success === true) {
              //     toast.success("Registro eliminado exitosamente");
              //   } else {
              //     toast.error("Error al eliminar el registro");
              //   }
              //   setDeleteOpen(false);
              //   getAllRoles(pagination.pageIndex + 1, pagination.pageSize);
              // }}
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
