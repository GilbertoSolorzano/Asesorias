"use client";

import React, { useState, useEffect } from 'react';
import HamburgerMenu from "@/components/HamburgerMenu";
import AsesorSecCard from '@/components/AsesorSecCard';
import TerminarAsesoria from '@/components/TerminarAsesoria';
import SolicitudCard from '@/components/SolicitudCard';

const AsesorPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);
    const [asesorias, setAsesorias] = useState([]);
    const [asesoriaSeleccionada, setAsesoriaSeleccionada] = useState(null);
    
    const [solicitudes, setSolicitudes] = useState([
        { id: 1, materia: "Álgebra", nombre: "Luis", notas: "Urgente" },
        { id: 2, materia: "POO", nombre: "Ana", notas: "Clase pendiente" },
        { id: 3, materia: "Física", nombre: "Carlos", notas: "Examen próximo" },
    ]);

    const eliminarSolicitud = (id) => {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    };

    const matriculaAsesor = 'S101';

    useEffect(() => {
        const fetchAsesorias = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/asesorias/activas?matricula=${matriculaAsesor}`);
                if (!res.ok) {
                    throw new Error(`Error al cargar asesorías: ${res.status} - ${res.statusText}`);
                }
                const data = await res.json();
                setAsesorias(data);
            } catch (error) {
                console.error('Error al cargar asesorías activas:', error);
            }
        };

        fetchAsesorias();
    }, [matriculaAsesor]);


    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 min-h-[60px]">
                <HamburgerMenu  role="asesor"/>
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
                        {solicitudes.length > 0 && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                            {solicitudes.length}
                            </span>
                        )}
                        <p className="text-gray-500 text-sm mb-2">SOLICITUDES</p>
                        <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <span className="text-gray-600 text-2xl font-bold">+</span>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        {/* Asesorias Activas */}
                        {asesorias.map( (a) => (
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
                                onModificar={ () => console.log('Modificar', a.idAsesoria)}
                            />
                        ))}
                    </div>
                </section>
                {/*--------------------------- Modales -----------------------------*/}
                {isModalOpen && (
                <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
                    <SolicitudCard 
                        onClose={() => setIsModalOpen(false)}
                        solicitudes={solicitudes}
                        onAceptar={eliminarSolicitud}
                    />
                </div>
                )}

                {isFinalizarModalOpen && (
                <TerminarAsesoria
                    isOpen={isFinalizarModalOpen} 
                    onConfirm={() => { setIsFinalizarModalOpen(false);}} 
                    onCancel={() => setIsFinalizarModalOpen(false)} 
                />
                )}
            </main>
        </div>
    )
}

export default AsesorPage


