'use client'
import React, { useState } from 'react'

const SolicitudCard = ({ onClose }) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    return (
        <div className="flex justify-center items-center h-screen drop-shadow-md rounded-md">
          <div className="w-full max-w-xs sm:max-w-xs md:max-w-xs lg:max-w-lg xl:max-w-xl bg-[#96A0A3] p-5 rounded-md shadow-lg relative m-2">
            
            <div className="bg-black text-white text-center py-2 text-sm sm:text-lg md:text-lg lg:text-lg xl:text-lg rounded">
                SOLICITUDES
              <button
              className="absolute max-w-xs sm:max-w-xs md:max-w-sm lg:max-w-sm xl:max-w-sm right-4 top-6 text-white px-3 py-1 rounded"
              onClick={onClose}
              >✖
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-96 p-2">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#BDD4E7] p-4 max-w-xs rounded border border-black text-center"
                >
                  <p>Materia / Tema</p>
                  <p>Nombre</p>
                  <p>Notas</p>
                  <button className="bg-green-500 text-white border-none px-4 sm:px-3 md:px-4 py-1 sm:py-1 md:py-2 mt-2 cursor-pointer rounded">
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
