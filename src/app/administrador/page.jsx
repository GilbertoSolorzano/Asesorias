"use client";

import HamburgerMenu from "@/components/HamburgerMenu";
import axios from "axios";
import { useEffect, useState } from "react";

const DashboardAdministrador = () => {
    const [asesorias, setAsesorias] = useState([]);

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

    const getColorClase = (estado) => {
        switch (estado) {
            case 1: return "bg-blue-400 text-white";
            case 2: return "bg-red-500 text-white";
            case 3: return "bg-green-500 text-white";
            case 4: return "bg-yellow-400 text-black";
            default: return "bg-gray-300 text-black";
        }
    };

    const getTextoEstado = (estado) => {
        switch (estado) {
            case 1: return "Nueva";
            case 2: return "Retardo";
            case 3: return "Asignada";
            case 4: return "Finalizada";
            default: return "Desconocido";
        }
    };

    return (
        <div className="flex h-screen relative">
            {/* Sidebar */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu role="administrador" />
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4 overflow-y-auto">
                <h1 className="text-2xl font-bold text-center mb-8">Bienvenido, Administrador!</h1>

                {/* Tarjetas dinámicas */}
                <div className="space-y-6">
                {asesorias.filter(asesoria => asesoria.estado !== 4)
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
                        {asesoria.fecha_acordada && <p>Fecha: {new Date(asesoria.fecha_acordada).toLocaleString()}</p>}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardAdministrador;
