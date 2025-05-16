"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import AsesorCardPending from "@/components/AsesorCardPending";
import AsesorCardCompleted from "@/components/AsesorCardCompleted";

export default function HistorialPage() {
  const [pendientes, setPendientes] = useState([]);
  const [completadas, setCompletadas] = useState([]);
  const [matricula, setMatricula] = useState(null);
  const router = useRouter();

  // Leer matrícula al montar
  useEffect(() => {
    const m = localStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  // Cargar datos cuando tengamos matrícula
  useEffect(() => {
    if (!matricula) return;

    // Pendientes (estado 1)
    fetch(`http://localhost:3001/api/alumno/asesorias?matricula=${matricula}`)
      .then((r) => r.json())
      .then((all) => setPendientes(all.filter((a) => a.estado === 1)))
      .catch(console.error);

    // Completadas (estado 4)
    fetch(
      `http://localhost:3001/api/alumno/asesorias/completadas?matricula=${matricula}`
    )
      .then((r) => r.json())
      .then(setCompletadas)
      .catch(console.error);
  }, [matricula]);

  const handleModificar = (id) => {
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
    <div className="flex min-h-screen relative bg-gray-100">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>
      <div className="flex-1 bg-gray-100 p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">
            Historial de Asesorías
          </h1>
        </header>

        {/* Pendientes */}
        <section className="mb-12">
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

        {/* Completadas */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Asesorías Completadas
          </h2>
          {completadas.length === 0 ? (
            <p className="text-gray-500">
              No tienes asesorías completadas aún.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {completadas.map((c) => (
                <AsesorCardCompleted
                  key={c.idAsesoria}
                  materia={c.materia}
                  tema={c.tema}
                  nombreAsesor={c.nombreAsesor}
                  fechaAtendida={c.fechaAtendida}
                  onVerChat={() => router.push(`/chat/${c.idAsesoria}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
