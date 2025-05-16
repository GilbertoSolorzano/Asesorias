'use client'
import HamburgerMenu from '@/components/HamburgerMenu'
import { ClientSegmentRoot } from 'next/dist/client/components/client-segment';
import React, { useState, useEffect } from 'react'

const PerfilPage = () => {
  const matriculaAsesor = 'S102';
  const [selectedTags, setSelectedTags] = useState(['Fundamentos', 'Calculo I']);
  const [newPassword, setNewPassword] = useState('');
  const [options] = useState([
    'Programación', 'Matemáticas', 'POO', 'FUNDAMENTOS', 'ESTRUCTURA', 'AUTÓMATAS I'
  ]);
  const [perfil, setPerfil] = useState({
    nombreAsesor: '',
    correo: '',
    foto: '',
    contraseñaActual: ''
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asesor/asesorias/perfil-asesor?matricula=${matriculaAsesor}`);
        if (!res.ok) throw new Error('Error al obtener perfil');
        const data = await res.json();
          if (data.length > 0) {
          setPerfil(data[0]);
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      }
    };
    fetchPerfil();
  }, [matriculaAsesor]);

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const addTag = (e) => {
    const value = e.target.value;
    if (value && !selectedTags.includes(value)) {
      setSelectedTags([...selectedTags, value]);
    }
  };

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <aside className="bg-[#212227] w-full md:w-20 flex flex-col items-center py-4 md:h-full min-h-[60px]">
        <HamburgerMenu role="asesor" />
      </aside>

      <main className="bg-[#96A0A3] w-full max-h-screen overflow-y-auto p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Perfil Asesor</h1>

        <div className="bg-gray-500 rounded-lg p-8 w-full text-white space-y-6">
          {/* Foto */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-sm">
              foto
            </div>
          </div>

          {/* Nombre */}
          <div className="flex items-center">
            <label className="w-32">Nombre:</label>
            <input 
              type="text"
              value={perfil.nombreAsesor  ?? ''} 
              readOnly
              className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" 
            />
          </div>

          {/* Correo */}
          <div className="flex items-center">
            <label className="w-32">Correo:</label>
            <input 
              type="email"
              value={perfil.correo}
              readOnly
              className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" />
          </div>

          {/* Capacitación */}
          <div>
            <label className="block mb-2">Capacitación:</label>
            <select onChange={addTag} className="w-full p-2 mb-2 text-black rounded bg-[#FFFFFF]">
              <option value="">Elegir opciones</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <div key={tag} className="bg-white text-black px-2 py-1 rounded flex items-center">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex items-center">
            <label className="w-32">Contraseña actual:</label>
            <input
              type="password"
              value={perfil.contraseñaActual}
              readOnly
              className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" />
          </div>
         {/* Cambiar contraseña */}
         <div className="flex items-center">
            <label className="w-32">Nueva Contraseña:</label>
            <input type="password" className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" />
          </div>
          {/* Cambiar contraseña */}
          <div className="flex items-center">
            <label className="w-32">Confirme su nueva contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Repite tu nueva contraseña"
              className="flex-1 p-2 text-black rounded bg-[#FFFFFF]"
            />
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default PerfilPage
