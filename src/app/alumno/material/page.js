"use client";

import { useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <aside className="bg-gray-800 w-20 flex flex-col items-center py-4">
        <HamburgerMenu />
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
