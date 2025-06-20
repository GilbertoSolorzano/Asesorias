'use client';

// Importación de componentes, librerías y hooks necesarios
import AgregarAsesor from "@/components/AgregarAsesorModal";
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from 'axios';
import { Plus } from "lucide-react";
import { useEffect, useState } from 'react';

// Componente principal de la pantalla para mostrar y gestionar asesores
export default function Asesores() {

    // Estados para almacenar datos de asesores, texto de búsqueda y modal de creación
    const [asesoresData, setAsesoresData] = useState([]);
    const [search, setSearch] = useState('');
    const [create, setCreate] = useState(false);

    // Función para obtener los asesores desde la API
    const obtenerAsesores = () => {
        axios.get('http://localhost:3001/api/admin/asesores')
            .then((res) => setAsesoresData(res.data))
            .catch((err) => {
                console.error('Error al obtener asesores:', err);
                alert('No se pudieron cargar los asesores.');
            });
    };
        
    // useEffect que ejecuta la carga de asesores al montar el componente
    useEffect(() => {
        obtenerAsesores();
    }, []);

    // Filtro local sobre los asesores basado en la búsqueda por nombre, matrícula o correo
    const filteredAsesores = asesoresData.filter((asesor) =>
        asesor.nombre.toLowerCase().includes(search.toLowerCase()) ||
        asesor.matricula.includes(search) ||
        asesor.correo.toLowerCase().includes(search.toLowerCase())
    );

    // Render principal
    return (
        <div className="flex h-screen relative text-black">
            {/* Menú lateral izquierdo */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu role="administrador"/>
            </aside>
            
            {/* Contenedor principal */}
            <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">Asesores</h1>

                {/* Contenedor de búsqueda, botón y tabla */}
                <div className="bg-[#7E8DA9] w-full p-6 rounded-3xl flex flex-col items-center">
                    
                    {/* Barra de búsqueda y botón para agregar nuevo asesor */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center bg-gray-400 rounded-full px-4 py-2 w-72">
                            <span className="material-icons text-white mr-2">search</span>
                            <input
                                type="text"
                                placeholder="Buscar"
                                className="bg-transparent outline-none text-white placeholder-white flex-1"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => setCreate(true)}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full shadow transition"
                            title="Agregar asesor"
                        >
                            <Plus size={16}/>
                            <span className="text-sm font-medium hidden sm:inline">Agregar</span>
                        </button>
                    </div>

                    {/* Tabla que muestra los asesores filtrados */}
                    <div className="bg-white rounded-3xl p-6 w-full max-w-4xl overflow-x-auto">
                        <table className="w-full text-center">
                            <thead>
                                <tr className="font-bold text-gray-700">
                                    <th>Matrícula</th>
                                    <th>Nombre</th>
                                    <th>Horas Totales</th>
                                    <th>Correo</th>
                                    <th>Calificaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAsesores.map((asesor, index) => (
                                    <tr key={index} className="border-t">
                                        <td>{asesor.matricula}</td>
                                        <td>{asesor.nombre}</td>
                                        <td>{asesor.horas}</td>
                                        <td>{asesor.correo}</td>
                                        <td>{asesor.calificacion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal para agregar un nuevo asesor */}
                {create && (
                    <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
                        <AgregarAsesor
                            onClose={() => {
                                setCreate(false);
                                obtenerAsesores(); // Recargar lista tras agregar
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
