'use client'
import HamburgerMenu from '@/components/HamburgerMenu'
import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from "lucide-react";

const PerfilPage = () => {
  const [matricula, setMatricula] = useState(null);
  const [verContrasena, setVerContrasena] = useState(false);
  const [verNuevaContrasena, setVerNuevaContrasena] = useState(false);
  const [verConfirmacion, setVerConfirmacion] = useState(false);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [msgError, setMsgError] = useState('');
  const [msgExito, setMsgExito] = useState('');
  
  // Leer la matricula del localStorage
  useEffect(() => {
    const m = sessionStorage.getItem('matricula');
    setMatricula(m);
  }, []);

  const [perfil, setPerfil] = useState({
    nombreAsesor: '',
    correo: '',
    foto: '',
    contraseñaActual: ''
  });

  const handleCambiarContra = async () => {
    setMsgError('');
    setMsgExito('');
    if(!nuevaContrasena || !confirmarContrasena){
      setMsgError("Complete por favor los campos de contraseña!");
      return;
    }
    if(nuevaContrasena !== confirmarContrasena) {
      setMsgError("Las contraseñas no coinciden")
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/asesor/cambiar-contrasena',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: matriculaAsesor,
          nuevaContrasena
        }),
      });
      if (!res.ok) throw new Error("Error al cambiar la contraseña");
      setMsgExito('Contraseña actualizada con exito!');
      setNuevaContrasena('');
      setConfirmarContrasena('');
    } catch (err) {
      setMsgError('Ocurrió un error al cambiar la contraseña.');
      console.error(err);
    }

  }
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asesor/asesorias/perfil-asesor?matricula=${matricula}`);
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
  }, [matricula]);


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
          {/* Contraseña */}
          <div className="flex items-center">
            <label className="w-32">Contraseña actual:</label>
            <div className="flex items-center flex-1 bg-[#FFFFFF] rounded p-2">
              <input
                type={verContrasena ? "text" : "password"}
                value={perfil.contraseñaActual}
                readOnly
                className="flex-1 text-black bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setVerContrasena(!verContrasena)}
                className="ml-2 text-gray-500 hover:text-gray-800"
              >
                {verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
         {/* Cambiar contraseña */}
         <div className="flex items-center">
            <label className="w-32">Nueva Contraseña:</label>
            <div className="flex items-center flex-1 bg-[#FFFFFF] rounded p-1">
              <input 
                type={verNuevaContrasena ? "text" : "password"}
                value={nuevaContrasena}
                onChange={e => setNuevaContrasena(e.target.value)} 
                className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" 

              />
              <button
                type="button"
                onClick={() => setVerNuevaContrasena(!verNuevaContrasena)}
                className="ml-2 text-gray-500 hover:text-gray-800"
              >
                {verNuevaContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {/* Cambiar contraseña */}
          <div className="flex items-center">
            <label className="w-32">Confirme su nueva contraseña:</label>
            <div className="flex items-center flex-1 bg-[#FFFFFF] rounded p-1">
              <input 
                type={verConfirmacion ? "text" : "password"} 
                className="flex-1 p-2 text-black rounded bg-[#FFFFFF]" 
                value={confirmarContrasena}
                onChange={e => setConfirmarContrasena(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setVerConfirmacion(!verConfirmacion)}
                className="ml-2 text-gray-500 hover:text-gray-800"
              >
                {verConfirmacion ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {msgError && (
            <p className="text-red-500 text-sm mt-2">{msgError}</p>
          )}
          {msgExito && (
            <p className="text-green-500 text-sm mt-2">{msgExito}</p>
          )}

          {/* Botón para guardar */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCambiarContra}
              className="bg-[#FFC943] hover:bg-yellow-300 text-white font-semibold py-2 px-4 rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
 
}

export default PerfilPage
