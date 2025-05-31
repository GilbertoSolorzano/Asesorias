// File: app/asesor/page.jsx
'use client';

import AsesorSecCard from '@/components/AsesorSecCard';
import ChatWidget from '@/components/ChatWidget';
import HamburgerMenu from "@/components/HamburgerMenu";
import SolicitudCard from '@/components/SolicitudCard';
import TerminarAsesoria from '@/components/TerminarAsesoria';
import { useEffect, useState } from 'react';

const AsesorPage = () => {
  const [matricula, setMatricula] = useState(null);
  const [isModificarModalOpen, setIsModificarModalOpen] = useState(false);
  const [modificarAsesoria, setModificarAsesoria] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);
  const [asesorias, setAsesorias] = useState([]);
  const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [chatVisible, setChatVisible] = useState(false);


  // Leer la matricula del localStorage
  useEffect(() => {
    const m = sessionStorage.getItem('matricula');
    if (m) {
      setMatricula(m);
    } else {
      router.push('/login');
    }
  }, []);

  //Fetch de las solicitudes
  useEffect(() => {
    if (!matricula) return;
    const fetchSolicitudes = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asesor/asesorias/solicitud?matricula=${matricula}`);
        if (!res.ok) throw new Error(`Error al cargar solicitudes: ${res.status}`);
        const data = await res.json();
        const mSolicitudes = data.map(sol => ({
          idAsesoria: sol.id,
          materia:    sol.tema,
          nombre:     sol.nombre,
          notas:      sol.notas
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
    if (!matricula) return;

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
  const abrirChat = async (asesoriaId,alumnoNombre) => {
    try {
      const res = await fetch(`http://localhost:3001/api/alumno/mensajes/${asesoriaId}`);
      const data = await res.json();
      setChatMessages(data);
      setChatRoom(asesoriaId);
      setNombreAlumno(alumnoNombre);
      setChatVisible(true); 
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

        <section className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* ───── Primera celda: Botón SOLICITUDES ───── */}
            <div
              className="relative w-full h-full max-h-40 sm:max-h-48 rounded-lg p-4 flex flex-col items-center justify-center border-2 border-dashed border-[#BDD4E7] hover:bg-blue-50 cursor-pointer"
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

            {/* ───── Celdas 2 y 3 (o más): Asesorías activas ───── */}
            {asesorias.length === 0 ? (
              <>
                {/* Si no hay asesorías activas, puedes dejar celdas “vacías” o un mensaje */}
                <div className="flex items-center justify-center border rounded-lg bg-white p-4 text-gray-500">
                  Sin asesorías
                </div>
                <div className="flex items-center justify-center border rounded-lg bg-white p-4 text-gray-500">
                  Sin asesorías
                </div>
              </>
            ) : (
              asesorias.map((a) => (
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
                  onModificar={() => {
                    setModificarAsesoria({
                      ...a,
                      fecha: new Date(a.fecha).toISOString().slice(0, 16), // formato para input datetime-local
                    });
                    setIsModificarModalOpen(true);
                  }}
                  onClickChat={() => abrirChat(a.idAsesoria, a.nombreAlumno)}
                />
              ))
            )}
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
                    body: JSON.stringify({ 
                      idAsesoria,
                      matriculaAsesor: matricula
                    }),
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
      {chatVisible && chatRoom && (
        <div className="fixed bottom-4 right-4 w-[350px] h-[500px] bg-white rounded-lg shadow-lg z-50 p-4">
          <button
            onClick={() => setChatVisible(false)}
            className="absolute top-2 right-2 text-gray-700 hover:text-red-500 font-bold"
          >
            X
          </button>
          <ChatWidget
            room={chatRoom}
            user={matricula}
            initialMessages={chatMessages}
            nombreOtroUsuario={nombreAlumno}
            onClose={() => setChatVisible(false)}
          />
        </div>
      )}

      {isModificarModalOpen && modificarAsesoria && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#BDD4E7] p-4 rounded border-[1.5px] w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-center">Modificar Asesoría</h2>
            <label className="block text-sm">Fecha acordada:</label>
            <input
              type="datetime-local"
              className="w-full mb-2 p-1 border rounded"
              value={modificarAsesoria.fecha}
              onChange={(e) =>
                setModificarAsesoria({
                  ...modificarAsesoria,
                  fecha: e.target.value,
                })
              }
            />
            <label className="block text-sm">Lugar:</label>
            <input
              type="text"
              className="w-full mb-2 p-1 border rounded"
              value={modificarAsesoria.lugar}
              onChange={(e) =>
                setModificarAsesoria({
                  ...modificarAsesoria,
                  lugar: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => setIsModificarModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  try {
                    const res = await fetch("http://localhost:3001/api/asesor/asesorias/modificar", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        idAsesoria: modificarAsesoria.idAsesoria,
                        fecha_acordada: modificarAsesoria.fecha,
                        lugar: modificarAsesoria.lugar,
                      }),
                    });

                    if (!res.ok) throw new Error("Error al actualizar la asesoría");

                    // Recargar asesorías activas
                    const asesoriasRes = await fetch(`http://localhost:3001/api/asesor/asesorias/activas?matricula=${matricula}`);
                    const asesoriasData = await asesoriasRes.json();
                    setAsesorias(asesoriasData);

                    setIsModificarModalOpen(false);
                    setModificarAsesoria(null);
                  } catch (err) {
                    console.error("Error al modificar la asesoría:", err);
                    alert("No se pudo modificar la asesoría");
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AsesorPage;
