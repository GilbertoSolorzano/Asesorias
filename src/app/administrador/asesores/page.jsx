'use client';

import HamburgerMenu from "@/components/HamburgerMenu";
import axios from 'axios';
import { useEffect, useState } from 'react';

const TablaAsesores = () => {
    const [asesoresData, setAsesoresData] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
    axios.get('http://localhost:3001/api/asesores')
        .then((res) => setAsesoresData(res.data))
        .catch((err) => {
            console.error('Error al obtener asesores:', err);
            alert('No se pudieron cargar los asesores.');
        });
    }, []);

const filteredAsesores = asesoresData.filter((asesor) =>
    asesor.nombre.toLowerCase().includes(search.toLowerCase()) ||
    asesor.matricula.includes(search) ||
    asesor.correo.toLowerCase().includes(search.toLowerCase())
);

return (
    <div className="flex h-screen relative">
        <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
            <HamburgerMenu  role="administrador"/>
        </aside>
        
        <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">Asesores</h1>

        <div className="bg-[#7E8DA9] w-full p-6 rounded-3xl flex flex-col items-center">
            {/* Barra de búsqueda */}
            <div className="flex items-center bg-gray-400 rounded-full px-4 py-2 mb-6 w-72">
            <span className="material-icons text-white mr-2">search</span>
            <input
                type="text"
                placeholder="Buscar"
                className="bg-transparent outline-none text-white placeholder-white flex-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>

            {/* Tabla */}
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
    </div>
    </div>
);
};

export default TablaAsesores;
