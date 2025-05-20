'use client'
import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyClick = async () => {
    if (email !== confirmEmail) {
      alert('Los correos electrónicos no coinciden.');
      return;
    }

    try {
      const res = await fetch('/api/reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Enlace enviado: ${data.resetUrl}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error al procesar la solicitud');
    }
  };

  return (
    <div className="bg-[#637074] min-h-screen flex justify-center items-center">
      <div className="bg-gray-300 p-8 rounded-md shadow-md text-center">
        <h2 className="text-[#637074] text-xl font-bold mb-6">¿OLVIDASTE TU CONTRASEÑA?</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
          className="mb-4 w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          value={confirmEmail}
          onChange={e => setConfirmEmail(e.target.value)}
          placeholder="Repite tu correo"
          className="mb-6 w-full px-4 py-2 border rounded"
        />
        <button onClick={handleVerifyClick} className="bg-green-600 text-white px-4 py-2 rounded">
          Verificar
        </button>
        {message && <p className="mt-4 text-green-700 font-bold">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
