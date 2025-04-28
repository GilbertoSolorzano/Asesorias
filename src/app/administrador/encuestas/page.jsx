'use client';
import HamburgerMenu from "@/components/HamburgerMenu";
import { useEffect, useState } from 'react';

export default function ModificarEncuestas() {
  // Simulamos una consulta a la base de datos con un arreglo inicial
const [encuestas, setEncuestas] = useState([]);

useEffect(() => {
    // Aquí simularíamos que se traen los datos desde la base de datos
    const datosDesdeDB = [
    {
        id: 1,
        titulo: 'Encuesta satisfacción de alumnos',
        preguntas: [
        '¿Qué calificación le das a la asesoría del 1-10?',
        '¿Cuántas horas tuviste de asesorías?',
        '¿Tomarías de nuevo asesorías?'
        ]
    },
    {
        id: 2,
        titulo: 'Encuesta satisfacción a Asesores',
        preguntas: [
        '¿Qué calificación le das al alumno del 1-10?',
        '¿Cuántas horas impartiste asesorías?',
        '¿El alumno necesita más asesorías?'
        ]
    }
    ];
    setEncuestas(datosDesdeDB);
}, []);

const agregarPregunta = (idEncuesta) => {
    const nuevaPregunta = prompt('Escribe la nueva pregunta:');
    if (nuevaPregunta) {
    setEncuestas(prev =>
        prev.map(encuesta =>
        encuesta.id === idEncuesta
            ? { ...encuesta, preguntas: [...encuesta.preguntas, nuevaPregunta] }
            : encuesta
        )
    );
    }
};

const guardarCambios = (idEncuesta) => {
    alert(`Guardando cambios de la encuesta con ID ${idEncuesta}`);
    // Aquí se podría hacer una petición para guardar en la base de datos
};

return (
    <div className="flex relative">
            {/* Sidebar */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu  role="administrador"/>
            </aside>
    <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4 flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-6 text-center">Modificar encuestas</h1>

    {/* Barra de búsqueda */}
    <div className="flex items-center mb-10">
        <input
        type="text"
        placeholder="Buscar"
        className="px-4 py-2 rounded-l-full border border-gray-400 focus:outline-none"
        />
        <button className="bg-gray-500 text-white px-4 py-2 rounded-r-full">
        Buscar
        </button>
    </div>

    {/* Renderizar encuestas dinámicamente */}
    {encuestas.map((encuesta) => (
        <div key={encuesta.id} className="bg-white rounded-3xl shadow-md p-6 w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">{encuesta.titulo}</h2>
        <table className="w-full mb-4">
            <thead>
            <tr>
                <th className="text-left">No.</th>
                <th className="text-left">Pregunta</th>
            </tr>
            </thead>
            <tbody>
            {encuesta.preguntas.map((pregunta, index) => (
                <tr key={index}>
                <td>{index + 1}</td>
                <td>{pregunta}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <div className="flex justify-between">
            <button
            onClick={() => agregarPregunta(encuesta.id)}
            className="bg-teal-400 text-white px-4 py-2 rounded"
            >
            Agregar Pregunta
            </button>
            <button
            onClick={() => guardarCambios(encuesta.id)}
            className="bg-green-500 text-white px-4 py-2 rounded"
            >
            Guardar
            </button>
        </div>
        </div>
    ))}
    </div>
    </div>
);
}
