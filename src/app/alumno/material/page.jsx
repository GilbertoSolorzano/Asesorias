"use client";

import { useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative bg-gray-100">
            {/* Sidebar */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu  role="alumno"/>
            </aside>

      {/* Contenedor principal */}
      <div className="flex-1 bg-gray-100 p-8 relative">
        {/* Encabezado */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">Material de Apoyo</h1>
        </header>

        

       
      </div>
    </div>
  );
}
