"use client";

export default function AsesorCardPending({ tema, status, onModificar, onEliminar }) {
  return (
    <div className="border rounded-lg p-4 bg-yellow-50 shadow-md">
      <h3 className="text-lg font-bold">Solicitud Pendiente</h3>
      
      <p>
        <strong>Tema:</strong> {tema}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <div className="mt-2 flex space-x-2">
        <button
          onClick={onModificar}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Modificar
        </button>
        <button
          onClick={onEliminar}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
