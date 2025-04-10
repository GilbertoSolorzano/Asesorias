'use client'
import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleConfirmEmailChange = (event) => {
    setConfirmEmail(event.target.value);
  };

  const handleVerifyClick = () => {
    if (email === confirmEmail) {
      // Add your forgot password logic here (e.g., send reset link)
      console.log('Email:', email);
      alert(`Se enviará un enlace de restablecimiento a: ${email}`); // For demonstration purposes
    } else {
      alert('Los correos electrónicos no coinciden.');
    }
  };

  return (
    <div className="bg-[#637074] min-h-screen flex justify-center items-center">
      <div className="bg-gray-300 p-8 rounded-md shadow-md text-center">
        <h2 className="text-[#637074] text-xl font-bold mb-6">¿OLVIDASTE TU CONTRASEÑA?</h2>
        <div className="mb-4 flex flex-col items-start">
          <label className="text-[#637074] font-bold mb-2">Ingresa tu correo:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-2 rounded-md border border-[#637074] focus:outline-none focus:ring-2 focus:ring-[#637074] focus:border-transparent"
            placeholder="Ingresa tu correo"
          />
        </div>
        <div className="mb-6 flex flex-col items-start">
          <label className="text-[#637074] font-bold mb-2">Repetir correo:</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={handleConfirmEmailChange}
            className="w-full px-4 py-2 rounded-md border border-[#637074] focus:outline-none focus:ring-2 focus:ring-[#637074] focus:border-transparent"
            placeholder="Repite tu correo"
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

export default ForgotPasswordPage;