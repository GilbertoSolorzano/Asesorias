// app/alumno/page.jsx (o donde tengas tu HomePage)
"use client";

import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import CrearAsesoriaModal from "@/components/CrearAsesoriaModal";
import AsesorCardPending from "@/components/AsesorCardPending";
import { CirclePlus } from "lucide-react";


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [asesoriaEditando, setAsesoriaEditando] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const [pendientes, setPendientes] = useState([]);

  useEffect(() => {
    const m = localStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  const cargarPendientes = () => {
    if (!matricula) return;
    fetch(`http://localhost:3001/api/alumno/asesorias?matricula=${matricula}`)
      .then((res) => res.json())
      .then((all) => {
        const filt = all.filter(
          (a) => a.matriculaAlumno === matricula && a.estado === 1
        );
        setPendientes(filt);
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarPendientes();
  }, [matricula]);

  const handleModificar = (id) => {
    const asesoria = pendientes.find((a) => a.idAsesoria === id);
    setAsesoriaEditando(asesoria);
    setIsEditMode(true);
    setIsModalOpen(true);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setAsesoriaEditando(null);
    cargarPendientes();
  };

  return (
    <div className="flex min-h-screen relative bg-gray-100">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>

      <div className="flex-1 bg-gray-100 p-8 relative">
        <header className="mb-8 flex items-center px-4">
        {/* El título ocupa todo el espacio disponible y está centrado */}
        <h5 className="flex-1 text-center text-2xl font-bold text-zinc-950">
          Bienvenido, Alumno
        </h5>
        <div
          onClick={() => {
              setIsEditMode(false);
              setAsesoriaEditando(null);
              setIsModalOpen(true);
            }}
          className="flex flex-col items-center mr-4 mt-4 cursor-pointer"
        >
          <CirclePlus className="w-10 h-10 text-blue-500" />
          <span className="text-sm text-gray-600 mt-1">
            Agregar solicitud
          </span>
        </div>
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
                  materia={a.nombreMateria}
                  tema={a.nombreTema}
                  status="Pendiente"
                  onModificar={() => handleModificar(a.idAsesoria)}
                  onEliminar={() => handleEliminar(a.idAsesoria)}
                />
              ))}
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
            <CrearAsesoriaModal
              onClose={handleCloseModal}
              matriculaAlumno={matricula}
              modoEdicion={isEditMode}
              asesoriaInicial={asesoriaEditando}
            />
          </div>
        )}
      </div>
    </div>
  );
}
