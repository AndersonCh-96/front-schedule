import { useState } from "react";

const colors: any = {
  red: "bg-red-500 animate-pulse",
  yellow: "bg-yellow-500 animate-pulse",
  green: "bg-green-500 animate-pulse",
};
export const TrafficLight = () => {
  const [ligth, setLigth] = useState("red");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-8">
        <div
          className={`w-32 h-32 bg-red-500 rounded-full ${
            ligth === "red" ? ligth[colors] : "bg-gray-500"
          }`}
        ></div>
        <div
          className={`w-32 h-32 bg-yellow-500 rounded-full ${
            ligth === "yellow" ? ligth[colors] : "bg-gray-500"
          }`}
        ></div>
        <div
          className={`w-32 h-32 bg-green-500 rounded-full ${
            ligth === "green" ? ligth[colors] : "bg-gray-500"
          }`}
        ></div>

        {/* Botón para cambiar el estado de la luz */}
        <div className="flex gap-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer">
            Rojo
          </button>
          <button
            onClick={() => {
              setLigth("yellow");
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Amarillo
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer">
            Verde
          </button>
        </div>
      </div>
    </div>
  );
};
