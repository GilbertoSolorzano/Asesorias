// components/HamburgerMenu.jsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón de hamburguesa */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-200 text-2xl focus:outline-none"
      >
        ☰
      </button>

      {/* Menú deslizante */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo semitransparente para cerrar el menú al hacer clic */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel del menú */}
          <div className="relative bg-white w-64 p-4">
            {/* Botón para cerrar el menú */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 text-2xl focus:outline-none"
            >
              ✖
            </button>
            <nav className="mt-10">
              <Link
                href="/alumno"
                className="block px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => setIsOpen(false)}
              >
                Asesorías
              </Link>
              <Link
                href="/alumno/historial"
                className="block px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => setIsOpen(false)}
              >
                Historial
              </Link>
              <Link
                href="/material"
                className="block px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => setIsOpen(false)}
              >
                Material de Apoyo
              </Link>
              
              <Link
                href="/alumno/perfil"
                className="block px-4 py-2 hover:bg-gray-100 text-black"
                onClick={() => setIsOpen(false)}
              >
                Perfil
              </Link>
              <button
                onClick={() => {
                  alert("Cerrando sesión...");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
