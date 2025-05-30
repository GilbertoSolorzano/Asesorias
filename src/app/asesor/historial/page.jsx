'use client'
import AsesorDataGraph from '@/components/AsesorDataGraph'
import AsesorCard from '@/components/AsesorCard'
import HamburgerMenu from '@/components/HamburgerMenu'
import React, { useEffect, useState } from 'react'
import ChatModal from "@/components/ChatModal"; 

const HistorialPage = () => {
  const [matricula, setMatricula] = useState(null);
  const [asesoriaTerminada, setAsesoriaTerminada] = useState([])
  const [idChatAsesoria, setIdChatAsesoria] = useState(null);
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

  useEffect(() => {
    const fetchAsesorias = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/asesor/asesorias/asesorias-finalizadas?matricula=${matricula}`);
            if (!res.ok) {
                throw new Error(`Error al cargar asesorías finalizadas: ${res.status} - ${res.statusText}`);
            }
            const data = await res.json();
            setAsesoriaTerminada(data);
        } catch (error) {
            console.error('Error al cargar asesorías finalizadas:', error);
        }
    };

    fetchAsesorias();
}, [matricula]);
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 md:h-full min-h-[60px]">
        <HamburgerMenu role="asesor" />
      </aside>
  
      <main className="flex-1 overflow-y-auto flex-col items-center bg-white w-full h-full">
        <div className="w-full h-64 sm:h-80 md:h-96 mb-6 flex items-center justify-center">
          <AsesorDataGraph matricula={matricula} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full justify-center gap-4 p-4 overflow-y-auto">
          {asesoriaTerminada.map( (at, index) => (
            <AsesorCard
              key={index}
              tema={at.tema}
              nombre={at.nombreAlumno}
              fecha={new Date(at.fecha).toLocaleString('es-MX', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
              status="Finalizada" // si deseas mostrar un estado fijo
                  onMensaje={() => {
                    setIdChatAsesoria(at.idAsesoria);
                    fetch(`http://localhost:3001/api/alumno/mensajes/${at.idAsesoria}`)
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

            />
          ))}
        </div>
      </main>
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

export default HistorialPage
