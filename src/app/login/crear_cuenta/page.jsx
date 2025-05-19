'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrearCuenta() {
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [correo, setCorreo] = useState('');
  const [repetirCorreo, setRepetirCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [materias, setMaterias] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/alumno/materias')
      .then(res => res.json())
      .then(data => setMaterias(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricula.trim()) return alert('La matrícula es obligatoria.');
    if (correo !== repetirCorreo) return alert('Los correos no coinciden.');
    if (!correo.endsWith('@ite.edu.mx')) return alert('El correo debe ser institucional (@ite.edu.mx).');
    if (!password || password !== confirmPassword) return alert('Contraseñas vacías o no coinciden.');
    if (!carrera) return alert('Selecciona una carrera.');

    const payload = { matricula, nombre, carrera, correoInstitucional: correo, password };
    const res = await fetch('/api/alumno/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Registro exitoso. Puedes iniciar sesión.');
      router.push('/..');
    } else {
      const err = await res.json();
      alert(err.error || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#637074]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          CREAR CUENTA
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Matrícula:</label>
          <input
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value.toUpperCase())}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Carrera:</label>
          <select
            value={carrera}
            onChange={e => setCarrera(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          >
            <option value="">Selecciona una carrera</option>
            {materias.map(m => (
              <option key={m.idMateria} value={m.idMateria}>
                {m.nombreMateria}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Correo institucional:
          </label>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
            placeholder="@ite.edu.mx"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Repetir correo:
          </label>
          <input
            type="email"
            value={repetirCorreo}
            onChange={e => setRepetirCorreo(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirmar contraseña:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
        >
          REGISTRARSE
        </button>
      </form>
    </div>
  );
}
