"use client";

export default function AsesorCardCompleted({
  materia,
  tema,
  nombreAsesor,
  fechaAtendida,
  onVerChat
}) {
  return (
    <div className="border rounded-lg p-4 bg-green-100 shadow-md">
      <h3 className="text-lg font-bold text-green-800">Asesoría Completada</h3>
      <p><strong>Materia:</strong> {materia}</p>
      <p><strong>Tema:</strong> {tema}</p>
      <p><strong>Asesor:</strong> {nombreAsesor}</p>
      <p><strong>Atendida el:</strong> {new Date(fechaAtendida).toLocaleString()}</p>
      <button
        onClick={onVerChat}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Ver Chat
      </button>
    </div>
  );
}
