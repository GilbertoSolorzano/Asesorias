"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HamburgerMenu from "@/components/HamburgerMenu";
import AsesorCardCompleted from "@/components/AsesorCardCompleted";
import EncuestaAlumno from "@/components/EncuestaAlumno";
import ChatModal from "@/components/ChatModal"; 


export default function HistorialPage() {
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);
  const [completadas, setCompletadas] = useState([]);
  const [completadasPendientes, setCompletadasPendientes] = useState([]);
  const [matricula, setMatricula] = useState(null);
  const router = useRouter();
  const [mostrarChat, setMostrarChat] = useState(false);
  const [idChatAsesoria, setIdChatAsesoria] = useState(null);
  const [mensajes, setMensajes] = useState([]);



  // 1) Leer matrícula
  useEffect(() => {
    const m = localStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  // 2) Función para recargar completadas y pendientes
  const cargarCompletadas = () => {
    if (!matricula) return;
    fetch(`http://localhost:3001/api/alumno/asesorias/completadas?matricula=${matricula}`)
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta del backend:", data);
        if (Array.isArray(data)) {
          setCompletadas(data);
          setCompletadasPendientes(data.filter(a => Number(a.contestada) === 0));
        } else {
          console.error('Respuesta inesperada:', data);
        }
      })
      .catch(console.error);
  };

  // 3) Al montar o cambiar matrícula, cargar
  useEffect(() => {
    cargarCompletadas();
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

        {/* 4) Renderizar todas las completadas */}
        {completadas.length === 0 ? (
          <p className="text-gray-500">
            No tienes asesorías completadas aún.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {completadas.map((c) => (
              <AsesorCardCompleted
                key={c.idAsesoria}
                materia={c.materia}
                tema={c.tema}
                nombreAsesor={c.nombreAsesor}
                fechaAtendida={c.fechaAtendida}
                onVerChat={() => {
                  setIdChatAsesoria(c.idAsesoria);
                  fetch(`http://localhost:3001/api/alumno/mensajes/${c.idAsesoria}`)
                    .then(res => res.json())
                    .then(data => {
                      setMensajes(data);
                      setMostrarChat(true);
                    })
                    .catch(err => {
                      console.error("Error al cargar mensajes:", err);
                      setMensajes([]);
                      setMostrarChat(true);
                    });
                }}

                onEncuesta={() => {
                  setAsesoriaSeleccionada(c);
                  setMostrarEncuesta(true);
                }}
                contestada={c.contestada === 1}
              />
            ))}
          </div>
        )}

        {/* 5) Modal de encuesta */}
        {mostrarEncuesta && asesoriaSeleccionada && (
          <EncuestaAlumno
            idAsesoria={asesoriaSeleccionada.idAsesoria}
            matricula={matricula}
            onClose={() => {
              setMostrarEncuesta(false);
              setAsesoriaSeleccionada(null);
              cargarCompletadas(); // << refresca aquí para deshabilitar botón
            }}
          />
        )}
      </div>
      {mostrarChat && (
        <ChatModal
          visible={mostrarChat}
          mensajes={mensajes}
          onClose={() => setMostrarChat(false)}
        />
      )}

    </div>
  );
}
