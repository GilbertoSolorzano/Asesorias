"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import AsesorCardCompleted from "@/components/AsesorCardCompleted";
import EncuestaAlumno from "@/components/EncuestaAlumno";

export default function HistorialPage() {
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);
  const [completadas, setCompletadas] = useState([]);
  const [matricula, setMatricula] = useState(null);
  const router = useRouter();

  // Leer matrícula al montar
  useEffect(() => {
    const m = localStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  // Cargar solo completadas (estado 4)
  useEffect(() => {
    if (!matricula) return;
    fetch(
      `http://localhost:3001/api/alumno/asesorias/completadas?matricula=${matricula}`
    )
      .then((r) => r.json())
      .then(setCompletadas)
      .catch(console.error);
  }, [matricula]);

  return (
    <div className="flex min-h-screen relative bg-gray-100">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>
      <div className="flex-1 p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">
            Historial de Asesorías Completadas
          </h1>
        </header>

        {completadas.length === 0 ? (
          <p className="text-gray-500">
            No tienes asesorías completadas aún.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-8">
           {completadas.map(c => (
              <AsesorCardCompleted
                key={c.idAsesoria}
                materia={c.materia}
                tema={c.tema}
                nombreAsesor={c.nombreAsesor}
                fechaAtendida={c.fechaAtendida}
                //onVerChat={() => router.push(`/chat/${c.idAsesoria}`)}
                onEncuesta={() => setMostrarEncuesta(c.idAsesoria)}
                contestada={c.contestada === 1}  // o true/false
              />
            ))}
          </div>
        )}
       {mostrarEncuesta && asesoriaSeleccionada && (
        <EncuestaAlumno
          idAsesoria={asesoriaSeleccionada.idAsesoria}
          matricula={matricula}
          onClose={() => {
            setMostrarEncuesta(false);
            setAsesoriaSeleccionada(null);
          }}
        />
)}
      </div>
    </div>
  );
}
