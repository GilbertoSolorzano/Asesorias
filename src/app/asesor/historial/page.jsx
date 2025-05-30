'use client'
import AsesorCardCompleted from '@/components/AsesorCardComplete'
import AsesorDataGraph from '@/components/AsesorDataGraph'
import ChatModal from "@/components/ChatModal"
import EncuestaAsesor from '@/components/EncuestaAsesor'
import HamburgerMenu from '@/components/HamburgerMenu'
import { useEffect, useState } from 'react'

export default function HistorialPage() {
  const [matricula, setMatricula] = useState(null);
  const [asesoriaTerminada, setAsesoriaTerminada] = useState([])
  const [idChatAsesoria, setIdChatAsesoria] = useState(null);
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [completadas, setCompletadas] = useState([]);
  const [completadasPendientes, setCompletadasPendientes] = useState([]);
  const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);

  const [mensajes, setMensajes] = useState([]);
  const [mostrarChat, setMostrarChat] = useState(false);

  // Leer la matricula del localStorage
  useEffect(() => {
    const m = sessionStorage.getItem('matricula');
    if (m) {
      setMatricula(m);
    } else {
      router.push('/login');
    }
  }, []);

  const cargarCompletadas = () => {
    if (!matricula) return;
    fetch(`http://localhost:3001/api/asesor/asesorias/completadas?matricula=${matricula}`)
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
  useEffect(() => {
    cargarCompletadas();
  }, [matricula]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 md:h-full min-h-[60px]">
        <HamburgerMenu role="asesor" />
      </aside>
      <div className="flex-1 p-8">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">
            Historial de Asesorías Completadas
          </h1>
        </header>
        <div className="w-full h-64 sm:h-80 md:h-96 mb-6 flex items-center justify-center">
          <AsesorDataGraph matricula={matricula} />
        </div>
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
                        nombreAlumno={c.nombreAlumno}
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
      {mostrarEncuesta && asesoriaSeleccionada && (
                <EncuestaAsesor
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
  )
}

