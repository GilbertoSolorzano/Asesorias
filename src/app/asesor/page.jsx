"use client";

import React from 'react'
import { useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import AsesorSecCard from '@/components/AsesorSecCard';
import TerminarAsesoria from '@/components/TerminarAsesoria';
import SolicitudCard from '@/components/SolicitudCard';

const AsesorPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);
    
    const [solicitudes, setSolicitudes] = useState([
        { id: 1, materia: "Álgebra", nombre: "Luis", notas: "Urgente" },
        { id: 2, materia: "POO", nombre: "Ana", notas: "Clase pendiente" },
        { id: 3, materia: "Física", nombre: "Carlos", notas: "Examen próximo" },
    ]);

    const eliminarSolicitud = (id) => {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    };

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

                {/*-------------------------- Contenido principal -----------------------*/}
                
                <main className="flex flex-col sm:flex-row gap-4">
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
                    <div>
                        <AsesorSecCard 
                            nombre="Daniel" 
                            tema="Integrales Simples" 
                            fecha="2025-03-31" 
                            lugar="Aula 406" 
                            hora="18:00:00"
                            onFinalizar={() => setIsFinalizarModalOpen(true)}
                        />
                    </div>
                </main>
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


