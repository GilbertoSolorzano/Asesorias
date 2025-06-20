'use client';

// Importación de componentes y librerías necesarias
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from 'axios';
import { useEffect, useState } from 'react';

// Componente principal para crear materias y registrar temas asociados
export default function CrearMateriasTemas() {
    // Estados para materias, selección, inputs y temas agrupados por materia
    const [materias, setMaterias] = useState([]);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
    const [nuevaMateria, setNuevaMateria] = useState('');
    const [nombreTema, setNombreTema] = useState('');
    const [descripcionTema, setDescripcionTema] = useState('');
    const [temasPorMateria, setTemasPorMateria] = useState({});

    // useEffect para obtener materias y sus respectivos temas al iniciar
    useEffect(() => {
        axios.get('http://localhost:3001/api/admin/materia')
            .then(res => {
                setMaterias(res.data);

                // Obtener temas por cada materia
                const promesasTemas = res.data.map(materia =>
                    axios.get(`http://localhost:3001/api/admin/${materia.idMateria}/temas`)
                        .then(resTemas => ({ idMateria: materia.idMateria, temas: resTemas.data }))
                );

                Promise.all(promesasTemas).then(resultados => {
                    const agrupados = {};
                    resultados.forEach(({ idMateria, temas }) => {
                        agrupados[idMateria] = temas;
                    });
                    setTemasPorMateria(agrupados);
                });
            });
    }, []);

    // Manejar selección de materia (existente o nueva)
    const handleMateriaChange = (e) => {
        setMateriaSeleccionada(e.target.value);
        setNombreTema('');
        setDescripcionTema('');
    };

    // Agregar nueva materia con validación de duplicados
    const agregarMateria = () => {
        const nombreLimpio = nuevaMateria.trim().toLowerCase();
        if (!nombreLimpio) return;

        const yaExiste = materias.some(
            (m) => m.nombreMateria.trim().toLowerCase() === nombreLimpio
        );

        if (yaExiste) {
            alert("La materia ya existe.");
            return;
        }

        axios.post('http://localhost:3001/api/admin/materia', { nombreMateria: nuevaMateria })
            .then((res) => {
                setNuevaMateria('');
                const nueva = res.data;
                setMaterias(prev => [...prev, nueva]);
                setTemasPorMateria(prev => ({ ...prev, [nueva.idMateria]: [] }));
            })
            .catch((err) => {
                console.error('Error al agregar materia:', err);
            });
    };

    // Agregar nuevo tema a la materia seleccionada, validando duplicados
    const agregarTema = () => {
        if (!nombreTema.trim() || !descripcionTema.trim()) return;

        const temasActuales = temasPorMateria[materiaSeleccionada] || [];
        const existeTema = temasActuales.some(
            tema => tema.nombreTema.toLowerCase() === nombreTema.trim().toLowerCase()
        );

        if (existeTema) {
            alert('El tema ya existe para esta materia.');
            return;
        }

        axios.post(`http://localhost:3001/api/admin/${materiaSeleccionada}/temas`, {
            nombreTema,
            descripcion: descripcionTema
        }).then(res => {
            setTemasPorMateria(prev => ({
                ...prev,
                [materiaSeleccionada]: [...(prev[materiaSeleccionada] || []), res.data]
            }));
            setNombreTema('');
            setDescripcionTema('');
        });
    };

    // Eliminar materia seleccionada junto con sus temas
    const eliminarMateria = (idMateria) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
            axios.delete(`http://localhost:3001/api/admin/materia/${idMateria}`)
                .then(() => {
                    setMaterias(prev => prev.filter(m => m.idMateria !== idMateria));
                    setTemasPorMateria(prev => {
                        const nuevo = { ...prev };
                        delete nuevo[idMateria];
                        return nuevo;
                    });
                })
                .catch(err => {
                    console.error('Error al eliminar la materia:', err);
                    alert('No se pudo eliminar la materia.');
                });
        }
    };

    // Render principal del componente
    return (
        <div className="flex h-screen relative">
            {/* Menú lateral */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu role="administrador" />
            </aside>

            {/* Contenedor principal */}
            <div className="flex-1 flex flex-col p-8 bg-gray-100 overflow-hidden">

                {/* Encabezado */}
                <header className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-zinc-950">Bienvenido a las materias y temas</h1>
                </header>

                {/* Contenido en dos columnas */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Columna izquierda: formulario de materias y temas */}
                    <div className="w-1/3 bg-white p-6 rounded-lg shadow space-y-4">
                        <label className="block font-semibold">1: Materia</label>
                        <select
                            className="w-full border rounded p-2"
                            value={materiaSeleccionada}
                            onChange={handleMateriaChange}
                        >
                            <option value="">Seleccione una materia</option>
                            {materias.map((m) => (
                                <option key={m.idMateria} value={m.idMateria}>{m.nombreMateria}</option>
                            ))}
                            <option value="nueva">-- Nueva Materia --</option>
                        </select>

                        {/* Formulario para nueva materia */}
                        {materiaSeleccionada === 'nueva' && (
                            <div>
                                <label className="block font-semibold">Nueva Materia</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={nuevaMateria}
                                    onChange={(e) => setNuevaMateria(e.target.value)}
                                />
                                <button
                                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                                    onClick={agregarMateria}
                                >
                                    Agregar Materia
                                </button>
                            </div>
                        )}

                        {/* Formulario para registrar nuevo tema */}
                        <label className="block font-semibold">2: Nombre del Tema</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={nombreTema}
                            onChange={(e) => setNombreTema(e.target.value)}
                            disabled={!materiaSeleccionada || materiaSeleccionada === 'nueva'}
                        />

                        <label className="block font-semibold">3: Descripción breve</label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={descripcionTema}
                            onChange={(e) => setDescripcionTema(e.target.value)}
                            disabled={!materiaSeleccionada || materiaSeleccionada === 'nueva'}
                        />

                        <button
                            className="w-full bg-green-600 text-white py-2 rounded mt-2"
                            onClick={agregarTema}
                            disabled={!materiaSeleccionada || materiaSeleccionada === 'nueva'}
                        >
                            Agregar Tema
                        </button>
                    </div>

                    {/* Columna derecha: visualización de materias y temas */}
                    <div className="flex-1 pl-8 grid grid-cols-2 gap-6 overflow-y-auto">
                        {materias.map((m) => (
                            <div key={m.idMateria} className="bg-white rounded-xl p-4 shadow">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">{m.nombreMateria}</h2>
                                <button
                                    onClick={() => eliminarMateria(m.idMateria)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {(temasPorMateria[m.idMateria] || []).map((tema) => (
                                        <div key={tema.idTema} className="bg-gray-100 p-2 rounded">
                                            <strong>{tema.nombreTema}</strong>
                                            <p className="text-sm text-gray-600">{tema.descripcion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
