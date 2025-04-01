"use client";

import { useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function PerfilPage() {
  const alumno = {
    nombre: "",
    matricula: "",
    carrera: "",
    correo: "",
    contraseña: "",
  };

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar (barra lateral) */}
      <aside className="bg-gray-800 w-20 flex flex-col items-center py-4">
        <HamburgerMenu />
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 bg-gray-100 p-8 relative">
        {/* Encabezado */}
        <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-950">Perfil de Alumno</h1>
        </header>

        {/* Contenido del Perfil sobre la página */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-90">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Información del Alumno</h2>

            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full bg-white">
                <tbody>
                  {Object.entries(alumno).map(([key, value], index) => (
                    <tr key={key} className={`border ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                      <td className="py-3 px-6 font-semibold text-gray-700 uppercase">{key.replace(/_/g, " ")}</td>
                      <td className="py-3 px-6 text-gray-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Guardar" : "Cambiar Contraseña"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
