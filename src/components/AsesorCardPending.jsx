"use client";

export default function AsesorCardPending({ materia, tema, status, onModificar, onEliminar }) {
  return (
    <div className="border rounded-lg p-4 bg-yellow-50 shadow-md">
      <h3 className="text-lg font-bold text-black">Solicitud Pendiente</h3>
      <p className="text-black">
        <strong>Materia:</strong> {materia}
      </p>

      <p className="text-black">
        <strong>Tema:</strong> {tema}
      </p>
      <p className="text-black">
        <strong>Status:</strong> {status}
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-2">
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
