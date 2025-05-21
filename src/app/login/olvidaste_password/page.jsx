'use client';
import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyClick = async () => {
    if (email !== confirmEmail) {
      return alert('Los correos no coinciden');
    }
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      setMessage(data.message);
    } catch {
      alert('Error de red');
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
        <button
          onClick={handleVerifyClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Enviar enlace
        </button>
        {message && <p className="mt-4 text-green-700">{message}</p>}
      </div>
    </div>
  );
}
