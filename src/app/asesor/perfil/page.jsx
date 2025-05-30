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
  const [mostrarMaterias, setMostrarMaterias] = useState(false);
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [materiasAsignadas, setMateriasAsignadas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [msgError, setMsgError] = useState('');
  const [msgExito, setMsgExito] = useState('');
  const [perfil, setPerfil] = useState({
    nombreAsesor: '',
    correo: '',
    foto: '',
    contraseñaActual: ''
  });
  const eliminarMateria = (idMateria) => {
    setMateriasSeleccionadas(prev => prev.filter(id => id !== idMateria));
  };
  const toggleMateria = (idMateria) => {
    setMateriasSeleccionadas((prev) =>
      prev.includes(idMateria)
        ? prev.filter((id) => id !== idMateria)
        : [...prev, idMateria]
    );
  };
  const fetchMateriasAsignadas = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/asesor/materias-asignadas?matricula=${matricula}`);
      if (!res.ok) throw new Error('Error al obtener materias asignadas');
      const data = await res.json();
      return data; // Asumo que el backend devuelve un array con las materias
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  // Leer la matricula del localStorage
  useEffect(() => {
    const m = sessionStorage.getItem('matricula');
    setMatricula(m);
  }, []);

  useEffect(() => {
    const fetchMateriasAsignadas = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/asesor/materias-asignadas?matricula=${matricula}`);
        if (!res.ok) throw new Error('Error al obtener materias asignadas');
        const data = await res.json();
        setMateriasAsignadas(data);
      } catch (error) {
        console.error('Error al cargar materias asignadas:', error);
      }
    };

    fetchMateriasAsignadas();
  }, [matricula]);


  useEffect(() => {
    if (!mostrarMaterias) return;

    const fetchMaterias = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/asesor/materias-disponibles');
        if (!res.ok) throw new Error(`Error al cargar materias: ${res.status}`);
        const data = await res.json();

        const materiasFormateadas = data.map((m) => ({
          id: m.idMateria,
          nombre: m.nombreMateria,
        }));

        setMaterias(materiasFormateadas);
      } catch (error) {
        console.error('Error al obtener materias:', error);
      }
    };

    fetchMaterias();
  }, [mostrarMaterias]);
  

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
          matricula: matricula,
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

  const handleGuardarMaterias = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/asesor/agregar-materia-asesor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: matricula,
          materias: materiasSeleccionadas, // array para varias materias
        }),
      });

      if (!res.ok) throw new Error('Error al asignar materias');

      // Refrescamos las materias asignadas en pantalla
      const nuevasMaterias = await fetchMateriasAsignadas(); // Implementa esta función
      setMateriasAsignadas(nuevasMaterias);
      setMostrarMaterias(false);
      setMateriasSeleccionadas([]);
    } catch (error) {
      console.error('Error al guardar materias:', error);
    }
  };

  const handleEliminarMateria = async (idMateria) => {
    try {
      const res = await fetch(`http://localhost:3001/api/asesor/eliminar-materia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: matricula,
          idMateria: idMateria,
        }),
      });

      if (!res.ok) throw new Error('Error al eliminar materia');

      // Actualiza las materias asignadas tras la eliminación
      setMateriasAsignadas((prev) =>
        prev.filter((materia) => materia.idMateria !== idMateria)
      );
    } catch (error) {
      console.error('Error al eliminar materia:', error);
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

          {/* Capacitaciones */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <label className="w-32">Capacitaciones</label>
              <div className="fflex-1 flex flex-wrap gap-2 overflow-x-auto px-4 justify-between">
                {/* Materias seleccionadas */}
                <div className="flex flex-wrap gap-2 overflow-x-auto max-w-[60%]">
                  {materiasAsignadas.map((materia) => (
                  <div
                    key={materia.idMateria}
                    className="flex items-center bg-gray-300 text-black px-3 py-1 rounded-sm text-sm font-medium"
                  >
                    {materia.nombreMateria}
                    <button
                      onClick={() => handleEliminarMateria(materia.idMateria)}
                      className="ml-2 text-black font-bold hover:text-red-700"
                      aria-label={`Eliminar ${materia.nombreMateria}`}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
                </div>

                {/* Botón Añadir */}
                <div className=''>
                  <button
                    className="bg-[#FFC943] text-white px-4 py-2 rounded font-semibold hover:bg-green-600"
                    onClick={() => setMostrarMaterias(true)}
                  >
                    Añadir
                  </button>
                </div>
              </div>
          </div>
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

          {/* Para mostrar las opciones de materias */}
          {mostrarMaterias && (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl text-black font-bold mb-4">Selecciona las materias</h2>

                <div className="space-y-2 max-h-60 overflow-y-auto text-black">
                  {materias.map((materia) => (
                    <label key={materia.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={materiasSeleccionadas.includes(materia.id)}
                        onChange={() => toggleMateria(materia.id)}
                      />
                      <span>{materia.nombre}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    onClick={() => setMostrarMaterias(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                    onClick={() => {
                      console.log('Materias seleccionadas:', materiasSeleccionadas);
                      handleGuardarMaterias();
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
 
}

export default PerfilPage
