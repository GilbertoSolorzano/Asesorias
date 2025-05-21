'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');        
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');

  const handleReset = async () => {
    if (!password || password !== confirmPassword) {
      return alert('Las contraseñas no coinciden o están vacías.');
    }
    try {
      const res = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return alert(data.message);
      }
      alert('Contraseña restablecida correctamente.');
      router.push('/');
    } catch (e) {
      console.error(e);
      alert('Error de red');
    }
  };

  return (
    <div className="bg-[#637074] min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer contraseña</h2>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirma contraseña"
          value={confirmPassword}
          onChange={e => setConfirm(e.target.value)}
          className="w-full mb-6 px-3 py-2 border rounded"
        />
        <button
          onClick={handleReset}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
}
