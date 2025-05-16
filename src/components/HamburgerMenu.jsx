// components/HamburgerMenu.jsx
"use client";
import Link from "next/link";
import { useState } from "react";

export default function HamburgerMenu({role}) {
  const [isOpen, setIsOpen] = useState(false);
  // Menu de opciones para cada tipo de usuario
  const menuOptions = {
    alumno: [
      {label: "Inicio", path: "/alumno"},
      {label: "Historial de Asesorias", path: "/alumno/historial"},
      {label: "Material de apoyo", path: "/alumno/material"},
      {label: "Perfil", path: "/alumno/perfil"}
    ],
    asesor: [
      {label: "Inicio", path: "/asesor"},
      {label: "Asesorías realizadas", path: "/asesor/historial"},
      {label: "Perfil", path: "/asesor/perfil"}
    ],
    administrador: [
      {label: "Inicio", path: "/administrador"},
      {label: "Asesores", path: "/administrador/asesores"},
      {label: "Asesorias finalizadas", path: "/administrador/historial"},
      {label: "Alumnos", path: "/administrador/alumnos"},
      {label: "Encuestas", path: "/administrador/encuestas"},
      {label: "Material de apoyo", path: "/administrador/material"},
      {label: "Materias y temas", path: "/administrador/materia"}

    ],
  };

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
          {/* Fondo oscuro para cerrar al hacer clic */}
          <div
            className="fixed inset-0 bg-[#212227] opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel del menú */}
          <div className="relative bg-[#212227] w-64 p-4">
            {/* Botón de cierre */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 text-2xl focus:outline-none"
            >
              ✖
            </button>
            <nav className="mt-10">
              {/* Genera los links según el rol */}
              {menuOptions[role]?.map((option) => (
                <Link
                  key={option.path}
                  href={option.path}
                  className="block px-4 py-2 text-center text-white hover:bg-white hover:text-black rounded-l-2xl"
                  onClick={() => setIsOpen(false)}
                >
                  {option.label}
                </Link>
              ))}
              {/* Botón de cerrar sesión */}
              <Link
              key="/"
              href="/"
                onClick={() => {
                  alert("Cerrando sesión...");
                  setIsOpen(false);
                }}
                className="block w-full text-center px-4 py-2 text-red-600  hover:bg-white hover:text-red-600 rounded-l-2xl"
              >
                Cerrar Sesión
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
