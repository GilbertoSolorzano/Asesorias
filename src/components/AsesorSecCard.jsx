import React from 'react'

const AsesorSecCard = ({tema, nombre, fechaAcordada, lugar, onModificar, onFinalizar}) => {
    return (
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl border rounded-lg p-4 shadow-md bg-[#BDD4E7] ">
            
            <h3 className="text-lg font-bold"><strong>Tema:</strong> {tema}</h3>
            <p><strong>Nombre alumno:</strong>{nombre}</p>
            <p><strong>Fecha:</strong> {fechaAcordada}</p>
            <p><strong>Lugar:</strong> {lugar}</p>
            
            <div className="flex flex-col md:flex-row justify-between gap-2 mt-4">
                <button onClick={onModificar} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                Modificar
                </button>
                <button onClick={onFinalizar} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Finalizar
                </button>
            </div>
        </div>
    );
}

export default AsesorSecCard
