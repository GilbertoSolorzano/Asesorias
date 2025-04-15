// components/HamburgerMenu.jsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function HamburgerMenu({role}) {
  const [isOpen, setIsOpen] = useState(false);
  // Menu de opciones para cada tipo de usuario
  const menuOptions = {
    alumno: [
      {label: "Inicio", path: "/alumno"},
      {label: "Asesorías realizadas", path: "/alumno/historial"},
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
      {label: "Material de apoyo", path: "/administrador/material"}
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
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel del menú */}
          <div className="relative bg-black w-64 p-4">
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
                  className="block px-4 py-2 hover:bg-gray-900 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {option.label}
                </Link>
              ))}
              {/* Botón de cerrar sesión */}
              <button
                onClick={() => {
                  alert("Cerrando sesión...");
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-900"
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
