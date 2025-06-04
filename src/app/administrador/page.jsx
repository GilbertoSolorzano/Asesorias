"use client";

// Importación de componentes y librerías necesarias
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from "axios";
import { useEffect, useState } from "react";

// Componente principal del dashboard del administrador
const DashboardAdministrador = () => {
    // Estado que almacena todas las asesorías obtenidas
    const [asesorias, setAsesorias] = useState([]);

    // useEffect para obtener asesorías del backend al montar el componente
    useEffect(() => {
        const obtenerAsesorias = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/admin/asesorias');
                setAsesorias(res.data);
            } catch (error) {
                console.error("Error al obtener asesorías:", error);
            }
        };

        obtenerAsesorias();
    }, []);

    // Devuelve clases de color según el estado de la asesoría
    const getColorClase = (estado) => {
        switch (estado) {
            case 1: return "bg-blue-400 text-white";     // Nueva
            case 2: return "bg-red-500 text-white";      // Retardo
            case 3: return "bg-green-500 text-white";    // Asignada
            case 4: return "bg-yellow-400 text-black";   // Finalizada
            default: return "bg-gray-300 text-black";    // Desconocido
        }
    };

    // Devuelve el texto que representa el estado de la asesoría
    const getTextoEstado = (estado) => {
        switch (estado) {
            case 1: return "Nueva";
            case 2: return "Retardo";
            case 3: return "Asignada";
            case 4: return "Finalizada";
            default: return "Desconocido";
        }
    };

    // Render principal del dashboard
    return (
        <div className="flex h-screen relative">
            {/* Menú lateral */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu role="administrador" />
            </aside>

            {/* Contenido principal del dashboard */}
            <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4 overflow-y-auto">
                <h1 className="text-2xl font-bold text-center mb-8">Bienvenido, Administrador!</h1>

                {/* Grid de tarjetas dinámicas para asesorías activas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {asesorias
                        .filter(asesoria => asesoria.estado !== 4) // Excluye las finalizadas
                        .sort((a, b) => {
                            const ordenDeseado = [2, 1, 3]; // Orden personalizado: Retardo, Nueva, Asignada
                            return ordenDeseado.indexOf(a.estado) - ordenDeseado.indexOf(b.estado);
                        })
                        .map((asesoria) => (
                            <div
                                key={asesoria.idAsesoria}
                                className={`${getColorClase(asesoria.estado)} p-6 rounded-md shadow-md text-center`}
                            >
                                <p className="font-bold">Tema: {asesoria.tema || "Sin tema"}</p>
                                <p>Alumno: {asesoria.alumno}</p>
                                {asesoria.asesor && <p>Asesor: {asesoria.asesor}</p>}
                                <p className="font-light">Estado: {getTextoEstado(asesoria.estado)}</p>
                                {asesoria.lugar && <p className="italic">Lugar: {asesoria.lugar}</p>}
                                {asesoria.fecha_acordada && (
                                    <p>Fecha: {new Date(asesoria.fecha_acordada).toLocaleString()}</p>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardAdministrador;
