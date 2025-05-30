'use client';

import React, { useState } from 'react';

function CrearCuenta() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [capacitacion, setCapacitacion] = useState([]);
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');


  const handleCapacitacionChange = (opcion) => {
    if (capacitacion.includes(opcion)) {
      setCapacitacion(capacitacion.filter((item) => item !== opcion));
    } else {
      setCapacitacion([...capacitacion, opcion]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena !== repetirContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          capacitacion,
          contrasena
        })
      });

      if (res.ok) {
        setMensajeExito('Tu solicitud ha sido enviada. Te enviaremos respuesta por correo.');
        setNombre('');
        setCorreo('');
        setCapacitacion([]);
        setContrasena('');
        setRepetirContrasena('');
      } else {
        alert('Error al enviar la solicitud.');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al enviar los datos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#637074]">
      <div className="bg-[#FFFFFF] p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">CREAR CUENTA</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre (solo mayúsculas):</label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 border-gray-400 focus:outline-none"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value.toUpperCase())}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo:</label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 border-gray-400 focus:outline-none"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Capacitación:</label>
            <div className="flex flex-wrap gap-2">
              {['Fundamentos', 'Calculo I', 'Programacion POO', 'Matema Fundam...', 'Estructura', 'Automatas I'].map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`border rounded py-1 px-2 ${capacitacion.includes(opcion) ? 'bg-blue-200' : ''} border-gray-400`}
                  onClick={() => handleCapacitacionChange(opcion)}
                >
                  {opcion} {capacitacion.includes(opcion) && 'x'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 border-gray-400 focus:outline-none"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Repetir contraseña:</label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 border-gray-400 focus:outline-none"
              type="password"
              value={repetirContrasena}
              onChange={(e) => setRepetirContrasena(e.target.value)}
            />
          </div>

          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
            type="submit"
          >
            SOLICITAR
          </button>
          {mensajeExito && (
            <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded text-sm text-center">
              {mensajeExito}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CrearCuenta;
