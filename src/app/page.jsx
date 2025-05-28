'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

function Login() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        matricula,
        password
      });

      const { tipoUsuario } = response.data;
      sessionStorage.setItem('matricula', matricula);
      // Redirecciona según el tipo de usuario
      if (tipoUsuario === 'administrador') router.push('/administrador');
      else if (tipoUsuario === 'asesor') router.push('/asesor');
      else if (tipoUsuario === 'alumno') router.push('/alumno');
      else alert('No se reconoce el tipo de usuario.');
    } catch (error) {
      alert('Credenciales incorrectas o error del servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#637074]">
      <div className="bg-[#FFFF] p-8 rounded shadow-md w-96 h-4/5">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-[#212227]">
            PROGRAMA INSTITUCIONAL DE ASESORIAS (PIA)
          </h2>
        </div>

        <div className="flex justify-center mb-6">
          <img src="/img/image.png" alt="Logo ITE" className="w-24 h-24" />
        </div>

        <div className="mb-4">
          <label className="block text-[#637074] text-sm font-bold mb-2">
            Número de acceso:
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-[#212227] leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Ingresa tu número de acceso"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-[#637074] text-sm font-bold mb-2">
            Contraseña:
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-[#212227] mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-center mb-4">
          <button
            className="bg-[#BDD4E7] text-[#212227] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            CONTINUAR
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <a
            className="inline-block align-baseline font-bold text-sm text-[#212227] hover:text-[#637074]"
            href="/login/olvidaste_password"
          >
            Olvide la contraseña
          </a>
        </div>

        <div className="flex justify-center space-x-4">
          <a
            className="inline-block align-baseline font-bold text-sm text-[#212227] hover:text-[#637074]"
            href="/login/crear_cuenta"
          >
            Crear cuenta
          </a>
          <a
            className="inline-block align-baseline font-bold text-sm text-[#212227] hover:text-[#637074]"
            href="/login/quiero_ser_asesor"
          >
            Quiero ser asesor
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
