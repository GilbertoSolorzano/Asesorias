'use client';
import axios from "axios";
import { useEffect, useState } from "react";

export default function CrearMaterial({ onClose }) {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [materias, setMaterias] = useState([]);
    const [materiaSeleccionado, setMateriaSeleccionado] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/api/admin/materias')
        .then(res => res.json())
        .then(data => setMaterias(data))
        .catch(err => console.error('Error al cargar materias:', err));
    }, []);

    const handleSeleccion = (e) => {
        const idSeleccionado = e.target.value;
        setMateriaSeleccionado(idSeleccionado);
        console.log('ID seleccionado:', idSeleccionado);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titulo || !contenido || !materiaSeleccionado) {
            alert("Completa los campos obligatorios.");
            return;
        }
    
        try {
            await axios.post('http://localhost:3001/api/admin/materiales', {
                titulo,
                contenido,
                descripcion,
                idMateria: materiaSeleccionado
            });
            alert("Material agregado correctamente.");
            onClose();
        } catch (error) {
            console.error("Error al agregar material:", error);
            alert("Hubo un error al guardar el material.");
        }
    };
    return (
        <div className="bg-blue-500 p-6 rounded-lg shadow-lg relative">
            {/* Botón de cerrar */}
            <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-xl"
            >
            ✖
            </button>
    
            <h2 className="text-xl font-bold mb-4 text-white text-center">Agregar Material de apoyo</h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-white font-semibold">Titulo para el material:</label>
                <input type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full p-2 border rounded"
                    />
            </div>
    
            <div>
                <label className="block text-white font-semibold">URL:</label>
                <input type="text"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-white font-semibold">Descripcion:</label>
                <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-2 border rounded"
                />
            </div>
    
            <div>
                <label className="block text-white font-semibold">Materia a la que corresponde:</label>
                <select
            onChange={handleSeleccion}
            value={materiaSeleccionado}
            className="w-full p-2 border rounded"
        >
            <option value="">Seleccione...</option>
            {materias.map(materia => (
            <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nombreMateria}
            </option>
            ))}
        </select>
            </div>
    
            <button type="submit"  className="bg-white text-blue-500 w-full p-2 rounded hover:bg-gray-200">
                Agregar
            </button>
            </form>
        </div>
    );
}
