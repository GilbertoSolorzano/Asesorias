"use client";

import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import CrearAsesoriaModal from "@/components/CrearAsesoriaModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matricula, setMatricula] = useState(null);

  // Al montar, leemos la matrícula guardada en localStorage
  useEffect(() => {
    const m = localStorage.getItem("matricula");
    if (m) setMatricula(m);
    else {
      // si no hay matrícula puedes redirigir al login, p.e.
      // router.push("/login");
      console.warn("No hay matrícula en localStorage");
    }
  }, []);

  return (
    <div className="flex h-screen relative">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>

      <div className="flex-1 bg-gray-100 p-8 relative">
        <header className="text-center mb-8">
          <h5 className="text-2xl font-bold text-zinc-950">Bienvenido, Alumno</h5>
        </header>
        <main className="grid grid-cols-3 gap-8">
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-md p-4 hover:bg-blue-50 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <p className="text-gray-500 text-sm mb-2">CREAR SOLICITUD</p>
            <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <span className="text-gray-600 text-2xl font-bold">+</span>
            </div>
          </div>
        </main>

        {isModalOpen && (
          <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
            <CrearAsesoriaModal
              onClose={() => setIsModalOpen(false)}
              matriculaAlumno={matricula}          // ← aquí!
            />
          </div>
        )}
      </div>
    </div>
  );
}
