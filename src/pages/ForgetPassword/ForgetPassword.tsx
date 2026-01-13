import InputForm from "@/components/Input/InputForm";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useFormik } from "formik";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validation = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email inválido")
                .required("El email es requerido"),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);

            try {
                // Aquí iría la lógica para enviar el email de recuperación
                // Por ahora simulo una llamada a API
                await new Promise(resolve => setTimeout(resolve, 2000));

                toast.success("Se ha enviado un enlace de recuperación a tu email");
                navigate("/login");
            } catch (error) {
                toast.error("Error al enviar el email de recuperación");
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <div style={{ backgroundImage: "url('https://images.unsplash.com/photo-1659011557941-f61112150a77?q=80&w=924&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
            className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="mx-auto max-w-md w-full">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">¿Olvidaste tu contraseña?</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tu email y te enviaremos un enlace para que puedas restablecer tu contraseña
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={validation.handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <InputForm
                                name="email"
                                placeholder="m@example.com"
                                validation={validation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enviando...
                                </div>
                            ) : (
                                "Enviar enlace de recuperación"
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al inicio de sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgetPassword;