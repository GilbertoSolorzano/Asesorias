import React from 'react'

const AsesorSecCard = ({nombre, tema, fecha, lugar, hora, onModificar, onFinalizar}) => {
    return (
        <div className="border rounded-lg p-4 bg-[#BDD4E7] shadow-md w-60">
            <h3 className="text-lg font-bold">{nombre}</h3>
            <p>
                <strong>Tema:</strong> {tema}
            </p>
            <p>
                <strong>Fecha:</strong> {fecha}
            </p>
            <p>
                <strong>Lugar:</strong> {lugar}
            </p>
            <p>
                <strong>Hora:</strong> {hora}
            </p>
            <div className="flex justify-between mt-4">
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
