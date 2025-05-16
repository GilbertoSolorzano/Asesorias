// app/alumno/page.jsx (o donde tengas tu HomePage)
"use client";

import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import CrearAsesoriaModal from "@/components/CrearAsesoriaModal";
import AsesorCardPending from "@/components/AsesorCardPending";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matricula, setMatricula] = useState(null);
  const [pendientes, setPendientes] = useState([]);

  // 1) Leer matrícula al montar
  useEffect(() => {
    const m = localStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  // 2) Cargar solicitudes pendientes
  useEffect(() => {
    if (!matricula) return;
    fetch("http://localhost:3001/api/alumno/asesorias")
      .then((res) => res.json())
      .then((all) => {
        // filtrar por este alumno y estado === 1 (pendiente)
        const filt = all.filter(
          (a) => a.matriculaAlumno === matricula && a.estado === 1
        );
        setPendientes(filt);
      })
      .catch(console.error);
  }, [matricula]);

  const handleModificar = (id) => {
    // redirigir o abrir modal para modificar, p.e.:
    console.log("Modificar", id);
  };
  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta solicitud?")) return;
    try {
      const res = await fetch(
        `http://localhost:3001/api/alumno/asesorias/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setPendientes((prev) => prev.filter((a) => a.idAsesoria !== id));
      } else {
        alert("No se pudo eliminar");
      }
    } catch {
      alert("Error de red");
    }
  };

  return (
    <div className="flex h-screen relative">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>

      <div className="flex-1 bg-gray-100 p-8 relative">
        <header className="text-center mb-8">
          <h5 className="text-2xl font-bold text-zinc-950">
            Bienvenido, Alumno
          </h5>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Solicitudes Pendientes</h2>
          {pendientes.length === 0 ? (
            <p className="text-gray-500">No tienes solicitudes pendientes.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {pendientes.map((a) => (
                <AsesorCardPending
                  key={a.idAsesoria}
                  tema={a.idTema /* o busca el nombre de tema si prefieres */}
                  status="Pendiente"
                  onModificar={() => handleModificar(a.idAsesoria)}
                  onEliminar={() => handleEliminar(a.idAsesoria)}
                />
              ))}
            </div>
          )}
        </section>

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
              matriculaAlumno={matricula}
            />
          </div>
        )}
      </div>
    </div>
  );
}
