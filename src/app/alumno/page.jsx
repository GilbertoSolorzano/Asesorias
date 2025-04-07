"use client";

import { useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import AsesorCard from "@/components/AsesorCard";
import AsesorCardPending from "@/components/AsesorCardPending";
import CrearAsesoriaModal from "@/components/CrearAsesoriaModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <h1 className="text-2xl font-bold text-zinc-950">Bienvenido, Alumno</h1>
        </header>

        {/* Contenido principal */}
        <main className="grid grid-cols-3 gap-8">
          {/* Botón para abrir modal */}
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

        {/* Modal sin fondo oscuro */}
        {isModalOpen && (
          <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
            <CrearAsesoriaModal onClose={() => setIsModalOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
