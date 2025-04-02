'use client'
import React, { useState } from 'react'

const SolicitudCard = ({ onClose }) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="flex justify-center items-center h-screen drop-shadow-md">
          <div className="w-4/5 max-w-2xl bg-[#96A0A3] p-5 rounded-md shadow-lg relative">
            <div className="bg-black text-white text-center py-2 text-lg rounded">
                Solicitudes
            </div>
            <button 
            className="absolute right-6 top-7 text-white px-3 py-1 rounded"
            onClick={onClose}
            >X
            </button>
            <div className="flex flex-wrap gap-4 overflow-y-auto max-h-96 p-2">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#BDD4E7] p-4 rounded border border-black w-[calc(50%-10px)] text-center"
                >
                  <p>Materia / Tema</p>
                  <p>Nombre</p>
                  <p>Notas</p>
                  <button className="bg-green-500 text-white border-none px-4 py-1 mt-2 cursor-pointer rounded">
                    Aceptar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
}

export default SolicitudCard
