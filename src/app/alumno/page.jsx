"use client";

import { useState, useEffect } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import CrearAsesoriaModal from "@/components/CrearAsesoriaModal";
import AsesorCardPending from "@/components/AsesorCardPending";
import ChatWidget from "@/components/ChatWidget";
import { CirclePlus } from "lucide-react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [asesoriaEditando, setAsesoriaEditando] = useState(null);
  const [matricula, setMatricula] = useState(null);
  const [pendientes, setPendientes] = useState([]);
  const [aceptadas, setAceptadas] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [nombreAsesor, setNombreAsesor] = useState("");

  // 1) Obtener matrícula del alumno
  useEffect(() => {
    const m = sessionStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  // 2) Función que consulta al backend y actualiza estados
  const cargarAsesorias = () => {
    if (!matricula) return;
    fetch(`http://localhost:3001/api/alumno/asesorias?matricula=${matricula}`)
      .then((res) => res.json())
      .then((all) => {
        // Filtra según estado
        const pendientesFiltradas = all.filter(
          (a) => a.matriculaAlumno === matricula && a.estado === 1
        );
        const aceptadasFiltradas = all.filter(
          (a) => a.matriculaAlumno === matricula && a.estado === 3
        );
        setPendientes(pendientesFiltradas);
        setAceptadas(aceptadasFiltradas);
      })
      .catch(console.error);
  };

  // 3) Efecto con polling cada 5 segundos
  useEffect(() => {
    if (!matricula) return;

    // Carga inicial
    cargarAsesorias();

    // Programa polling cada 5 seg
    const intervalo = setInterval(() => {
      cargarAsesorias();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [matricula]);

  // 4) Funciones de modificar, eliminar y cerrar modal
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
    cargarAsesorias();
  };

  // 5) Función para abrir chat
  const abrirChat = async (asesoriaId, nombreAsesor) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/alumno/mensajes/${asesoriaId}`
      );
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        console.error("Error servidor:", await res.text());
        return;
      }
      if (!contentType?.includes("application/json")) {
        console.error("Respuesta no JSON:", await res.text());
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setChatMessages(data);
        setChatRoom(asesoriaId);
        setChatVisible(true);
        setNombreAsesor(nombreAsesor);
      } else {
        console.error("Formato inesperado:", data);
      }
    } catch (error) {
      console.error("Error al cargar chat:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      {/* Sidebar oculta en móvil */}
      <aside className="hidden sm:flex bg-[#212227] sm:w-20 flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <header className="mb-6 flex flex-col sm:flex-row items-center px-2 sm:px-4">
          <HamburgerMenu className="sm:hidden self-start mb-2" role="alumno" />
          <h5 className="flex-1 text-center text-2xl font-bold text-zinc-950">
            Bienvenido, Alumno
          </h5>
          <div
            onClick={() => {
              setIsEditMode(false);
              setAsesoriaEditando(null);
              setIsModalOpen(true);
            }}
            className="flex flex-col items-center cursor-pointer mt-4 sm:mt-0 sm:ml-4"
          >
            <CirclePlus className="w-10 h-10 text-blue-500" />
            <span className="text-sm text-gray-600 mt-1">
              Agregar solicitud
            </span>
          </div>
        </header>

        {/* Solicitudes Pendientes */}
        <section className="mb-8">
          <h2 className="text-black text-xl font-semibold mb-4">
            Solicitudes Pendientes
          </h2>
          {pendientes.length === 0 ? (
            <p className="text-black">No tienes solicitudes pendientes.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Solicitudes Aceptadas */}
        <section className="mb-8">
          <h2 className="text-black text-xl font-semibold mb-4">
            Solicitudes Aceptadas
          </h2>
          {aceptadas.length === 0 ? (
            <p className="text-black">No tienes solicitudes aceptadas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aceptadas.map((a) => (
                <div
                  key={a.idAsesoria}
                  className="bg-blue-500 text-black p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-bold mb-1">
                    {a.nombreMateria}
                  </h3>
                  <p className="text-sm">Tema: {a.nombreTema}</p>
                  <p className="text-sm">Lugar: {a.lugar}</p>
                  <p className="text-sm">
                    Fecha: {a.fecha_acordada
                      ? new Date(a.fecha_acordada).toLocaleString()
                      : new Date(a.fecha_creacion).toLocaleString()}
                  </p>
                  <p className="text-sm">Asesor: {a.nombreAsesor}</p>
                  <button
                    onClick={() => abrirChat(a.idAsesoria, a.nombreAsesor)}
                    className="mt-2 bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-100 w-full"
                  >
                    Mensaje
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Chat flotante */}
      {chatVisible && chatRoom && (
        <div className="fixed bottom-4 right-4 w-[90vw] max-w-xs sm:w-[350px] sm:h-[500px] bg-white rounded-lg shadow-lg z-50 p-4">
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
            nombreOtroUsuario={nombreAsesor}
            onClose={() => setChatVisible(false)}
          />
        </div>
      )}

      {/* Modal de creación/edición */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90vw] sm:w-[80%] max-w-lg sm:max-w-2xl">
            <CrearAsesoriaModal
              onClose={handleCloseModal}
              matriculaAlumno={matricula}
              modoEdicion={isEditMode}
              asesoriaInicial={asesoriaEditando}
            />
          </div>
        </div>
      )}
    </div>
  );
}
