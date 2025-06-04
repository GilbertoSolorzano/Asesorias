"use client";

// Importación de componentes personalizados y librerías necesarias
import AgregarAdmin from "@/components/AgregarAdminModal";
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

// Componente principal que representa la pantalla de perfil del administrador
export default function PerfilAdminPage() {
    // Definición de estados para datos del administrador, lista de admins y controles de UI
    const [admin, setAdmin]         = useState(null);
    const [admins, setAdmins]       = useState([]);
    const [isLoading, setLoading]   = useState(true);
    const [error, setError]         = useState(null);
    const [matricula, setMatricula] = useState(null);
    const router                    = useRouter();
    const [create, setCreate] = useState(false);           // Controla visibilidad del modal para agregar admins
    const [editMode, setEditMode] = useState(false);       // Controla si se está editando el perfil
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoEmail, setNuevoEmail] = useState('');
    const [nuevoPassword, setNuevoPassword] = useState('');
    
    // Efecto que se ejecuta al cargar la página: obtiene la matrícula desde sessionStorage
    useEffect(() => {
        const m = sessionStorage.getItem('matricula');
        if (m) {
            setMatricula(m);
        } else {
            router.push('/login'); // Redirige a login si no hay sesión válida
        }
    }, []);

    // Efecto para cargar los datos del perfil del administrador y de todos los admins
    useEffect(() => {
        if (!matricula) return;

        (async () => {
            try {
                // Obtiene el perfil del administrador logueado
                const resAdmin = await axios.get(
                    `http://localhost:3001/api/admin/perfil/${matricula}`
                );
                setAdmin(resAdmin.data);
                setNuevoNombre(resAdmin.data.nombre);
                setNuevoEmail(resAdmin.data.email);
                setNuevoPassword(resAdmin.data.password);

                // Carga la lista de todos los administradores
                const resTodos = await axios.get(`http://localhost:3001/api/admin/perfil`);
                setAdmins(resTodos.data);
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("No se pudo cargar la información del administrador.");
            } finally {
                setLoading(false);
            }
        })();
    }, [matricula, router]);

    // Muestra un mensaje mientras se cargan los datos
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Cargando perfil del administrador...</p>
            </div>
        );
    }

    // Muestra un error si no se pudo cargar el perfil
    if (error || !admin) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error || "Administrador no encontrado."}</p>
            </div>
        );
    }

    // Render principal de la interfaz del perfil del administrador
    return (
        <div className="flex min-h-screen relative bg-gray-100">
            {/* Menú lateral con botón hamburguesa */}
            <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                <HamburgerMenu role="administrador" />
            </aside>

            <div className="flex-1 bg-gray-100 p-8 relative">
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zinc-950">Perfil del Administrador</h1>
                </header>

                {/* Contenedor principal de datos */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start bg-opacity-90 overflow-auto px-4">
                    
                    {/* Tabla de información del administrador */}
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                            Información del Administrador
                        </h2>
                        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                            <tbody>
                                {Object.entries({
                                    matricula: admin.matricula,
                                    nombre:    admin.nombre,
                                    correo:    admin.email,
                                }).map(([key, value], idx) => (
                                    <tr
                                        key={key}
                                        className={`border ${idx % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                                    >
                                        <td className="py-3 px-6 font-semibold text-gray-700 uppercase">
                                            {key}
                                        </td>
                                        <td className="py-3 px-6 text-gray-900">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Sección de edición del perfil */}
                    <div className="flex justify-end mt-4">
                        {!editMode ? (
                            // Botón para activar el modo de edición
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Editar Perfil
                            </button>
                        ) : (
                            // Formulario para editar los datos del perfil
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await axios.put(`http://localhost:3001/api/admin/perfil/${matricula}`, {
                                            nombre: nuevoNombre,
                                            email: nuevoEmail,
                                            password: nuevoPassword,
                                        });
                                        alert('Perfil actualizado correctamente');
                                        setEditMode(false);
                                        // Recargar los datos del perfil actualizado
                                        const resAdmin = await axios.get(`http://localhost:3001/api/admin/perfil/${matricula}`);
                                        setAdmin(resAdmin.data);
                                    } catch (error) {
                                        console.error('Error al actualizar:', error);
                                        alert('Error al actualizar perfil');
                                    }
                                }}
                                className="w-full"
                            >
                                <div className="flex flex-col">
                                    <label htmlFor="nombre" className="mb-1 font-semibold">Nombre</label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        className="border p-2 rounded"
                                        value={nuevoNombre}
                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                        placeholder="Nuevo nombre"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="email" className="mb-1 font-semibold">Correo electrónico</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="border p-2 rounded"
                                        value={nuevoEmail}
                                        onChange={(e) => setNuevoEmail(e.target.value)}
                                        placeholder="Nuevo email"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="password" className="mb-1 font-semibold">Contraseña</label>
                                    <input
                                        id="password"
                                        type="text"
                                        className="border p-2 rounded"
                                        value={nuevoPassword}
                                        onChange={(e) => setNuevoPassword(e.target.value)}
                                        placeholder="Nueva contraseña"
                                    />
                                </div>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                    >
                                        Guardar Cambios
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Tabla con la lista de todos los administradores */}
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                            Lista de Administradores
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left">Matrícula</th>
                                        <th className="py-2 px-4 text-left">Nombre</th>
                                        <th className="py-2 px-4 text-left">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((a, i) => (
                                        <tr key={a.matricula} className={i % 2 === 0 ? "bg-gray-100" : ""}>
                                            <td className="py-2 px-4">{a.matricula}</td>
                                            <td className="py-2 px-4">{a.nombre}</td>
                                            <td className="py-2 px-4">{a.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Botón para abrir el modal de agregar administrador */}
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                                onClick={() => setCreate(true)}
                            >
                                Agregar Administrador
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal para agregar nuevo administrador */}
                {create && (
                    <div className="absolute top-0.5 left-1/4 w-1/2 z-50">
                        <AgregarAdmin
                            onClose={() => {
                                setCreate(false);
                            }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
