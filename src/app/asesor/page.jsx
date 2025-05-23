// File: app/asesor/page.jsx
'use client';

import AsesorSecCard from '@/components/AsesorSecCard';
import HamburgerMenu from "@/components/HamburgerMenu";
import SolicitudCard from '@/components/SolicitudCard';
import TerminarAsesoria from '@/components/TerminarAsesoria';
import ChatWidget from '@/components/ChatWidget';
import { useEffect, useState } from 'react';

const AsesorPage = () => {
  const [matricula, setMatricula] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);
  const [asesorias, setAsesorias] = useState([]);
  const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  // Leer la matricula del localStorage
  useEffect(() => {
    const m = localStorage.getItem('matricula');
    setMatricula(m);
  }, []);

  //Fetch de las solicitudes
  useEffect(() => {
    if (!matricula) return; 
    const fetchSolicitudes = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asesor/asesorias/solicitud?matricula=${matricula}`);
        if (!res.ok) throw new Error(`Error al cargar solicitudes: ${res.status}`);
        const data = await res.json();
        const mSolicitudes = data.map((sol) => ({
          idAsesoria: sol.id,
          materia: sol.tema,
          nombre: sol.nombreAlumno,
          notas: sol.notas
        }));
        setSolicitudes(mSolicitudes);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      }
    };
    fetchSolicitudes();
  }, [matricula]);

  //Fetch de las asesorias activas
  useEffect(() => {
    const fetchAsesorias = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asesor/asesorias/activas?matricula=${matricula}`);
        if (!res.ok) throw new Error(`Error al cargar asesorías: ${res.status}`);
        const data = await res.json();
        setAsesorias(data);
      } catch (error) {
        console.error('Error al cargar asesorías activas:', error);
      }
    };
    fetchAsesorias();
  }, [matricula]);

  //Fetch de las asesorias finalizadas
  const finalizarAsesoria = async () => {
    if (!asesoriaSeleccionada) return;

    try {
      const res = await fetch('http://localhost:3001/api/asesor/asesorias/finalizar-asesoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idAsesoria: asesoriaSeleccionada }),
      });
      if (!res.ok) throw new Error('Error al finalizar la asesoría');

      setAsesorias(prev => prev.filter(a => a.idAsesoria !== asesoriaSeleccionada));
      setIsFinalizarModalOpen(false);
      setAsesoriaSeleccionada(null);
    } catch (error) {
      console.error(error);
      alert('No se pudo finalizar la asesoría');
    }
  };
  const abrirChat = async (asesoriaId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/alumno/mensajes/${asesoriaId}`);
      const data = await res.json();
      setChatMessages(data);
      setChatRoom(asesoriaId);
    } catch (error) {
      console.error("Error al cargar mensajes del chat:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 min-h-[60px]">
        <HamburgerMenu role="asesor" />
      </aside>

      {/* Contenedor principal */}
      <main className="flex-1 bg-gray-100 p-8 relative overflow-y-auto flex flex-col">
        {/* Encabezado */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">BIENVENIDO ASESOR!</h1>
        </header>

        <section className="flex flex-col sm:flex-row gap-4">
          {/* Botón para abrir modal */}
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-4 flex flex-col items-center justify-center border-2 border-dashed border-[#BDD4E7] hover:bg-blue-50 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {solicitudes && solicitudes.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                {solicitudes.length}
              </span>
            )}
            <p className="text-gray-500 text-sm mb-2">SOLICITUDES</p>
            <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <span className="text-gray-600 text-2xl font-bold">+</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Asesorias Activas */}
            {asesorias.map((a) => (
              <AsesorSecCard
                key={a.idAsesoria}
                tema={a.tema}
                nombre={a.nombreAlumno}
                fechaAcordada={new Date(a.fecha).toLocaleString('es-MX', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
                lugar={a.lugar}
                onFinalizar={() => {
                  setAsesoriaSeleccionada(a.idAsesoria);
                  setIsFinalizarModalOpen(true);
                }}
                onModificar={() => console.log('Modificar', a.idAsesoria)}
                onClickChat={() => abrirChat(a.idAsesoria)}
              />
            ))}
          </div>
        </section>

        {/* Modales */}
        {isModalOpen && (
          <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
            <SolicitudCard
              onClose={() => setIsModalOpen(false)}
              solicitudes={solicitudes}
              onAceptar={async (idAsesoria) =>{
                try {
                  const res = await fetch('http://localhost:3001/api/asesor/asesorias/aceptar-asesoria', {
                    method:'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idAsesoria }),
                  });
                  
                  if (!res.ok) throw new Error('No se pudo aceptar la asesoría');
                  const result = await res.json();
                  console.log(result)
                  alert('Asesoría aceptada correctamente');

                  //Actualizar solicitudes
                  setSolicitudes(prev => prev.filter(s => s.idAsesoria !== idAsesoria));
                  //Actualizar asesorias activas
                  const asesoriasRes = await fetch(`http://localhost:3001/api/asesor/asesorias/activas?matricula=${matricula}`);
                  const asesoriasData = await asesoriasRes.json();
                  setAsesorias(asesoriasData);

                  setIsModalOpen(false);
                }catch (err) {
                  console.error('Error al aceptar asesoría:', err);
                  alert('Ocurrió un error al aceptar la asesoría');
                }
              }}
            />
          </div>
        )}

        {isFinalizarModalOpen && (
          <TerminarAsesoria
            isOpen={isFinalizarModalOpen}
            onConfirm={finalizarAsesoria}
            onCancel={() => setIsFinalizarModalOpen(false)}
          />
        )}
      </main>

      {/* Chat */}
      {chatRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full h-[80vh] p-4 relative">
            <button
              onClick={() => setChatRoom(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 font-bold"
            >
              X
            </button>
            <ChatWidget
              room={chatRoom}
              user={matricula} // <-- asegúrate que `matricula` no sea null
              initialMessages={chatMessages}
              onClose={() => setChatRoom(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AsesorPage;
