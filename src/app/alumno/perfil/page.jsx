"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function PerfilPage() {
  const [alumno, setAlumno]     = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState(null);
  const router                  = useRouter();

  const [matricula, setMatricula] = useState(null);

  // 1) Leer matrícula de localStorage
  useEffect(() => {
    const m = localStorage.getItem('matricula');
    if (m) {
      setMatricula(m);
    } else {
      router.push('/login');
    }
  }, []);

  // 2) Cuando tengamos matrícula, pedir el perfil
  useEffect(() => {
    if (!matricula) return;

    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/alumno/perfil/${matricula}`
        );
        setAlumno(res.data);       // res.data es ya el objeto alumno
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setError("No se pudo cargar la información del alumno.");
      } finally {
        setLoading(false);
      }
    })();
  }, [matricula, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando perfil...</p>
      </div>
    );
  }
  if (error || !alumno) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error || "Alumno no encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative bg-gray-100">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>
      <div className="flex-1 bg-gray-100 p-8 relative">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">Perfil de Alumno</h1>
        </header>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-90">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Información del Alumno
            </h2>
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full bg-white">
                <tbody>
                  {Object.entries({
                    matricula: alumno.matricula,
                    nombre:    alumno.nombre,
                    carrera:   alumno.carrera,
                    correo:    alumno.correo,
                  }).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={`border ${idx % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                      <td className="py-3 px-6 font-semibold text-gray-700 uppercase">
                        {key}
                      </td>
                      <td className="py-3 px-6 text-gray-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => window.open('../login/olvidaste_password')}
              >
                Recuperar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
