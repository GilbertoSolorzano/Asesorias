'use client';
import axios from "axios";
import { useState } from "react";

export default function AgregarAdmin({ onClose }) {
    const [matricula, setMatricula] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!matricula || !nombre || !email || !password) {
            alert("Completa todos los campos.");
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/admin/admins', {
                matricula,
                nombre,
                email,
                password
            });
            alert("Administrador agregado correctamente.");
            onClose();
        } catch (error) {
            console.error("Error al agregar admin:", error);
            alert("Hubo un error al guardar el admin");
        }
    };

    return (
        <div className="bg-green-600 p-6 rounded-lg shadow-lg relative">
            {/* Botón de cerrar */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white text-xl"
            >
                ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-white text-center">Agregar administrador</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-white font-semibold">Matricula:</label>
                    <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-white font-semibold">Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-white font-semibold">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-white font-semibold">Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-white text-green-600 w-full p-2 rounded hover:bg-gray-200"
                >
                    Agregar
                </button>
            </form>
        </div>
    );
}
