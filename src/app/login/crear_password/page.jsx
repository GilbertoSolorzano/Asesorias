'use client'
import React, { useState } from 'react';

const CreatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleVerifyClick = () => {
    if (password === confirmPassword) {
      // Add your password creation logic here
      console.log('Creating password:', password);
      alert('Contraseña creada!'); // For demonstration purposes
    } else {
      alert('Las contraseñas no coinciden.');
    }
  };

  return (
    <div className="bg-[#637074] min-h-screen flex justify-center items-center">
      <div className="bg-gray-300 p-8 rounded-md shadow-md text-center">
        <h2 className="text-[#637074] text-xl font-bold mb-6">CREAR CONTRASEÑA</h2>
        <div className="mb-4 flex flex-col items-start">
          <label className="text-[#637074] font-bold mb-2">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 rounded-md border border-[#637074] focus:outline-none focus:ring-2 focus:ring-[#637074] focus:border-transparent"
            placeholder="Ingresa tu nueva contraseña"
          />
        </div>
        <div className="mb-6 flex flex-col items-start">
          <label className="text-[#637074] font-bold mb-2">Repetir contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full px-4 py-2 rounded-md border border-[#637074] focus:outline-none focus:ring-2 focus:ring-[#637074] focus:border-transparent"
            placeholder="Repite la contraseña"
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md cursor-pointer transition duration-300"
          onClick={handleVerifyClick}
        >
          Verificar
        </button>
      </div>
    </div>
  );
};

export default CreatePasswordPage;