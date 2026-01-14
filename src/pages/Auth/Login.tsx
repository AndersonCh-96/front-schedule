import InputForm from "@/components/Input/InputForm";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import useAuthStore from "@/store/auth/auth.store";

import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {

    const { loginUser }: any = useAuthStore();
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);
    const validation = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email inválido")
                .required("El email es requerido"),
            password: Yup.string().required("La contraseña es requerida"),
        }),
        onSubmit: async (values) => {

            const data = await loginUser(values.email, values.password);

            if (data.success) {
                navigate("/calendario")
            } else {
                toast.error(data.error)
            }


        },
    });

    return (
        <div style={{ backgroundImage: "url('https://images.unsplash.com/photo-1659011557941-f61112150a77?q=80&w=924&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
            className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="mx-auto max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tu email y contraseña para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={validation.handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label >Email</label>
                            <InputForm
                                name="email"
                                placeholder="m@example.com"
                                validation={validation}
                            />

                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <label htmlFor="password">Contraseña</label>
                                {/* <a onClick={() => navigate("/forget-password")} className="ml-auto cursor-pointer inline-block text-sm underline">
                                    ¿Olvidaste tu contraseña?
                                </a> */}
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <InputForm
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    validation={validation}
                                />
                                {
                                    showPassword ? (
                                        <EyeOff onClick={() => { setShowPassword(!showPassword) }} className="ml-auto cursor-pointer" />
                                    ) : (
                                        <Eye onClick={() => { setShowPassword(!showPassword) }} className="ml-auto cursor-pointer" />
                                    )
                                }
                            </div>

                        </div>
                        <Button type="submit" className="w-full cursor-pointer">
                            Iniciar Sesión
                        </Button>
                    </form>

                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
