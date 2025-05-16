"use client";
import CrearMaterial from "@/components/CrearMaterialApoyo";
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from "axios";
import { useEffect, useState } from "react";



export default function HomePage() {
    const [create, setCreate] = useState(false);
    
    const [materiales, setMateriales] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/admin/materiales')
        .then((res) => setMateriales(res.data))
        .catch((err) => console.error('Error al obtener materiales:', err));
    }, [create]);

    const eliminarMaterial = (idMaterial) => {
        if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
            axios
                .delete(`http://localhost:3001/api/admin/materiales/${idMaterial}`)
                .then(() => {
                // Elimina el material del estado local sin recargar
                setMateriales((prev) => prev.filter((mat) => mat.idMaterial !== idMaterial));
                })
                .catch((err) => {
                console.error('Error al eliminar material:', err);
                alert('No se pudo eliminar el material.');
                });
            }
        };
    return (
        <div className="flex h-screen relative">
                {/* Sidebar */}
                <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                    <HamburgerMenu  role="administrador"/>
                </aside>

        {/* Contenedor principal */}
        <div className="flex-1 bg-gray-100 p-8 relative">
            {/* Encabezado */}
            <header className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-950">Bienvenido al material para los alumnos</h1>
            </header>

            {/* Contenido principal */}
            <main className="grid grid-cols-3 gap-8">
            {/* Botón para abrir modal */}
            <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-md p-4 hover:bg-blue-50 cursor-pointer"
                onClick={() => setCreate(true)}
            >
                <p className="text-gray-500 text-sm mb-2">CREAR MATERIAL</p>
                <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-gray-600 text-2xl font-bold">+</span>
                </div>
            </div>
            {materiales.map((material) => (
                <div key={material.idMaterial} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">{material.titulo}</h2>
                    <p className="text-sm text-gray-600 mb-2">{material.descripcion}</p>
                    <a
                        href={material.contenido}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm underline"
                    >
                        Ver contenido
                    </a>
                    <div className="flex justify-end">
                    <button
                        onClick={() => eliminarMaterial(material.idMaterial)}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded self-end"
                        >
                        Eliminar
                    </button>
                    </div>
                    </div>
                    
                ))}
            </main>

            {/* Modal sin fondo oscuro */}
            {create && (
            <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
                <CrearMaterial onClose={() => setCreate(false)} />
            </div>
            )}
        </div>
        </div>
    );
    }
