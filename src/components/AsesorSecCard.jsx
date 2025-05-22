import React from 'react';

const AsesorSecCard = ({ tema, nombre, fechaAcordada, lugar, onModificar, onFinalizar, onClickChat }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl border rounded-lg p-4 shadow-md bg-[#BDD4E7]">
      <h3 className="text-xs font-bold">Tema: {tema}</h3>
      <p className="text-xs">Nombre alumno: {nombre}</p>
      <p className="text-xs">Fecha acordada: {fechaAcordada}</p>
      <p className="text-xs">Lugar: {lugar}</p>

      <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
        <button
          onClick={onModificar}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Modificar
        </button>
        <button
          onClick={onFinalizar}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Finalizar
        </button>
        <button
          onClick={onClickChat}
          className="bg-white text-blue-700 border border-blue-500 px-3 py-1 rounded hover:bg-blue-100"
        >
          Mensaje
        </button>
      </div>
    </div>
  );
};

export default AsesorSecCard;
