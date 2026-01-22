import InputForm from "@/components/Input/InputForm";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import useAuthStore from "@/store/auth/auth.store";
import userStore from "@/store/user/user.store";

import { useFormik } from "formik";
import { User, Mail, Calendar, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { toast } from "sonner";

const Profile = () => {
    const { user, userId }: any = useAuthStore();
    const { getUser, updateUser, loading }: any = userStore();
    const [userData, setUserData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);



    const validation = useFormik({
        initialValues: {
            name: userData?.name || "",
            email: userData?.email || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("El nombre es requerido"),
            email: Yup.string()
                .email("Email inválido")
                .required("El email es requerido"),

        }),
        onSubmit: async (values) => {

            const result = await updateUser(userId, values);
            if (result.success) {
                toast.success("Perfil actualizado exitosamente");
                setIsEditing(false);
                await loadUserData();
            } else {
                toast.error(result.error || "Error al actualizar el perfil");
            }
        },
        enableReinitialize: true,
    });

    const loadUserData = async () => {
        if (userId) {
            const data = await getUser(userId);
            if (data) {
                setUserData(data);
            }
        }
    };

    useEffect(() => {
        loadUserData();
    }, [userId]);

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">

                                    {userData?.photoUrl ? (
                                        <img src={userData.photoUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover aspect-square" />
                                    ) : (
                                        userData?.name?.charAt(0)?.toUpperCase() || user?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                {/* <Button
                                    size="sm"
                                    className="absolute bottom-0 right-0 rounded-full p-1 h-8 w-8"
                                    onClick={() => setShowAvatarDialog(true)}
                                >
                                    <Camera className="h-4 w-4" />
                                </Button> */}
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Mi Perfil</CardTitle>
                                <CardDescription>
                                    Gestiona tu información personal
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            validation.resetForm();
                                        }}
                                    >
                                        <X className="h-4 w-4 mr-2 cursor-pointer" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={() => validation.handleSubmit()}
                                        disabled={loading}
                                    >
                                        <Save className="h-4 w-4 mr-2 cursor-pointer" />
                                        {loading ? "Guardando..." : "Guardar"}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>
                                    <Edit2 className="h-4 w-4 mr-2 cursor-pointer" />
                                    Editar Perfil
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium">
                                    <User className="h-4 w-4 mr-2" />
                                    Nombre Completo
                                </label>
                                {isEditing ? (
                                    <InputForm
                                        name="name"
                                        placeholder="Tu nombre completo"
                                        validation={validation}
                                    />
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300 p-2 border rounded-md">
                                        {userData?.name || "No especificado"}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                </label>

                                <p className="text-gray-700 dark:text-gray-300 p-2 border rounded-md">
                                    {userData?.email || user}
                                </p>

                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Teléfono
                                </label>
                                {isEditing ? (
                                    <InputForm
                                        name="phone"
                                        placeholder="+1234567890"
                                        validation={validation}
                                    />
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-300 p-2 border rounded-md">
                                        {userData?.phone || "No especificado"}
                                    </p>
                                )}
                            </div> */}

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Miembro desde
                                </label>
                                <p className="text-gray-700 dark:text-gray-300 p-2 border rounded-md">
                                    {userData?.createdAt ?
                                        new Date(userData.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) :
                                        "No disponible"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <label className="text-sm font-medium">Biografía</label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                className="w-full p-2 border rounded-md resize-none"
                                rows={4}
                                placeholder="Cuéntanos sobre ti..."
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.bio}
                            />
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 p-2 border rounded-md min-h-[100px]">
                                {userData?.bio || "No hay biografía disponible"}
                            </p>
                        )}
                    </div> */}

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">Información de la Cuenta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                                <p className="text-green-600 font-medium">Activo</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar Foto de Perfil</DialogTitle>
                        <DialogDescription>
                            Esta función estará disponible próximamente. Podrás subir una imagen desde tu dispositivo.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowAvatarDialog(false)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;