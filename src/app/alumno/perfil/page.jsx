"use client";

import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function PerfilPage() {
  const [alumno, setAlumno] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);


  const matricula = "22760235";

  useEffect(() => {
    async function fetchAlumno() {
      try {
        const res = await fetch("http://localhost:3001/api/alumnos");
        if (!res.ok) throw new Error("Error al cargar lista de alumnos");
        const all = await res.json();

        const data = all.find((a) => a.matricula === matricula);
        if (!data) throw new Error("Alumno no encontrado");

        setAlumno({
          nombre:    data.nombre,
          matricula: data.matricula,
          carrera:   data.carrera,
          email:     data.correo
        });
      } catch (err) {
        console.error(err);
        console.error("[PerfilPage] ", err);
        setAlumno(null);
      } finally {
        setIsLoading(false);
      }
    }
  fetchAlumno();
}, [matricula]);

   if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error: no se pudo cargar la información del alumno.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative">
            {/* Sidebar */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu  role="alumno"/>
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
                { "Cambiar Contraseña"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
