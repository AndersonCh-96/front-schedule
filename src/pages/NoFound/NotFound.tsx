import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">Página no encontrada</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
      <Button 
        onClick={() => navigate('/dashboard')}
        className="mt-6"
      >
        Volver al Inicio
      </Button>
    </div>
  );
};

export default NotFound;
