"use client";

export default function AsesorCardAssigned({
  materia,
  tema,
  status,       // te servirá para mostrar “Asignado”
  onVerDetalle, // quizá quieras ver más info
}) {
  return (
    <div className="border rounded-lg p-4 bg-blue-100 shadow-md">
      <h3 className="text-lg font-bold text-blue-700">Asesoría Asignada</h3>
      <p><strong>Materia:</strong> {materia}</p>
      <p><strong>Tema:</strong> {tema}</p>
      <p><strong>Status:</strong> {status}</p>
      <div className="mt-2">
        <button
          onClick={onVerDetalle}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}
