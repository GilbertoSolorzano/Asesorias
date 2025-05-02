'use client'
import HamburgerMenu from '@/components/HamburgerMenu'
import React, { useState } from 'react'

const PerfilPage = () => {

  const [selectedTags, setSelectedTags] = useState(['Fundamentos', 'Calculo I']);
  const [newPassword, setNewPassword] = useState('');
  const [options] = useState([
    'Programación', 'Matemáticas', 'POO', 'FUNDAMENTOS', 'ESTRUCTURA', 'AUTÓMATAS I'
  ]);

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
            <input type="text" className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" />
          </div>

          {/* Correo */}
          <div className="flex items-center">
            <label className="w-32">Correo:</label>
            <input type="email" className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" />
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
            <label className="w-32">Contraseña:</label>
            <input type="password" className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" />
          </div>

          {/* Cambiar contraseña */}
          <div className="flex items-center">
            <label className="w-32">Cambiar contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="ingresa tu nueva contraseña"
              className="flex-1 p-2 text-black rounded bg-[#FFFFFF]"
            />
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default PerfilPage
