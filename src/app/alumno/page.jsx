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

  useEffect(() => {
    const m = localStorage.getItem("matricula");
    setMatricula(m);
  }, []);

  const cargarAsesorias = () => {
    if (!matricula) return;
    fetch(`http://localhost:3001/api/alumno/asesorias?matricula=${matricula}`)
      .then((res) => res.json())
      .then((all) => {
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

  useEffect(() => {
    cargarAsesorias();
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
    cargarAsesorias();
  };

  const abrirChat = async (asesoriaId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/alumno/mensajes/${asesoriaId}`);
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        console.error("Respuesta de error del servidor:", await res.text());
        return;
      }
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Respuesta no es JSON:", await res.text());
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setChatMessages(data);
        setChatRoom(asesoriaId);
        setChatVisible(true);
      } else {
        console.error("Formato inesperado:", data);
      }
    } catch (error) {
      console.error("Error al cargar mensajes del chat:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="alumno" />
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center px-4">
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
            <span className="text-sm text-gray-600 mt-1">Agregar solicitud</span>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-black text-xl font-semibold mb-4">Solicitudes Pendientes</h2>
          {pendientes.length === 0 ? (
            <p className="text-black">No tienes solicitudes pendientes.</p>
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

        <section className="mb-8">
          <h2 className="text-black text-xl font-semibold mb-4">Solicitudes Aceptadas</h2>
          {aceptadas.length === 0 ? (
            <p className="text-black">No tienes solicitudes aceptadas.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {aceptadas.map((a) => (
                <div
                  key={a.idAsesoria}
                  className="bg-blue-500 text-white p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-bold mb-1">{a.nombreMateria}</h3>
                  <p className="text-sm">Tema: {a.nombreTema}</p>
                  <p className="text-sm">Lugar: {a.lugar}</p>
                  <p className="text-sm">Fecha: {new Date(a.fecha_creacion).toLocaleString()}</p>
                  <p className="text-sm">Asesor: {a.matriculaAsesor}</p>
                  <button
                    onClick={() => abrirChat(a.idAsesoria)}
                    className="mt-2 bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-100"
                  >
                    Mensaje
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

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
            onClose={() => setChatVisible(false)}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] max-w-2xl">
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