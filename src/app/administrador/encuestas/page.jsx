'use client';

// Importación de componentes y librerías necesarias
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from 'axios';
import { useEffect, useState } from 'react';

// Componente principal para gestionar las preguntas de las encuestas
export default function ModificarEncuestas() {
    // Estado que almacena las preguntas separadas por tipo de encuesta: alumno y asesor
    const [encuestas, setEncuestas] = useState({ alumno: [], asesor: [] });

    // useEffect para obtener las preguntas desde el backend al cargar la página
    useEffect(() => {
        axios.get('http://localhost:3001/api/admin/preguntas')
            .then(res => setEncuestas(res.data))
            .catch(err => {
                console.error('Error al obtener preguntas:', err);
                alert('No se pudieron cargar las preguntas.');
            });
    }, []);

    // Función para agregar una nueva pregunta a una encuesta (alumno o asesor)
    const agregarPregunta = async (tipoEncuesta) => {
        const nuevaPregunta = prompt('Escribe la nueva pregunta:');
        if (!nuevaPregunta) return;

        try {
            await axios.post('http://localhost:3001/api/admin/preguntas', {
                tipoEncuesta,
                enunciado: nuevaPregunta,
            });

            // Actualiza el estado local agregando la nueva pregunta
            setEncuestas(prev => ({
                ...prev,
                [tipoEncuesta]: [...prev[tipoEncuesta], { enunciado: nuevaPregunta }]
            }));

            alert('Pregunta agregada correctamente.');
        } catch (error) {
            console.error('Error al insertar pregunta:', error);
            alert('No se pudo guardar la pregunta.');
        }
    };

    // Función para eliminar una pregunta existente
    const eliminarPregunta = async (idPregunta, tipo) => {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta pregunta?');
        if (!confirmacion) return;
    
        try {
            await axios.delete(`http://localhost:3001/api/admin/preguntas/${idPregunta}`);

            // Actualiza el estado eliminando la pregunta del tipo correspondiente
            setEncuestas(prev => ({
                ...prev,
                [tipo]: prev[tipo].filter(p => p.idPregunta !== idPregunta)
            }));
        } catch (err) {
            console.error('Error al eliminar la pregunta:', err);
            alert('No se pudo eliminar la pregunta.');
        }
    };

    // Función reutilizable que renderiza una tabla con preguntas por tipo (alumno o asesor)
    const renderEncuesta = (tipo, titulo) => (
        <div className="bg-white rounded-3xl shadow-md p-6 w-full max-w-2xl mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">{titulo}</h2>
            <table className="w-full mb-4">
                <thead>
                    <tr>
                        <th className="text-left">No.</th>
                        <th className="text-left">Pregunta</th>
                        <th className="text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    {encuestas[tipo]?.map((pregunta, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{pregunta.enunciado}</td>
                            <td className="text-right pr-2">
                                <button
                                    onClick={() => eliminarPregunta(pregunta.idPregunta, tipo)}
                                    className="bg-red-500 px-2 py-[2px] my-[2px] rounded text-white"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end">
                <button
                    onClick={() => agregarPregunta(tipo)}
                    className="bg-teal-500 text-white px-4 py-2 rounded"
                >
                    Agregar Pregunta
                </button>
            </div>
        </div>
    );

    // Render principal que muestra el menú y las encuestas
    return (
        <div className="flex relative">
            {/* Menú lateral */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu role="administrador" />
            </aside>

            {/* Contenido principal */}
            <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-center">Modificar encuestas</h1>

                {/* Renderiza ambas encuestas: alumnos y asesores */}
                {renderEncuesta('alumno', 'Encuesta para Alumnos')}
                {renderEncuesta('asesor', 'Encuesta para Asesores')}
            </div>
        </div>
    );
}
