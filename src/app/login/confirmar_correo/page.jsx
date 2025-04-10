'use client'
import React, { useState } from 'react';

const VerificationPage = () => {
  const [code, setCode] = useState('');

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const handleVerifyClick = () => {
    // Add your verification logic here
    console.log('Verifying code:', code);
    alert(`Verifying code: ${code}`); // For demonstration purposes
  };

  return (
    <div className="bg-[#637074] min-h-screen flex justify-center items-center">
      <div className="bg-gray-300 p-8 rounded-md shadow-md text-center">
        <p className="text-[#637074] text-xl mb-6">Se envió un código de confirmación a tu correo</p>
        <div className="mb-6 flex flex-col items-start">
          <label className="text-[#637074] font-bold mb-2">Ingresa el código:</label>
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-[#637074] focus:outline-none focus:ring-2 focus:ring-[#637074] focus:border-transparent"
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

export default VerificationPage;