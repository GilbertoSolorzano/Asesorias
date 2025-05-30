"use client";

export default function AsesorCardCompleted({
  materia,
  tema,
  nombreAsesor,
  fechaAtendida,
  onVerChat,
  onEncuesta,
  contestada = false
}) {
  return (
    <div className="border rounded-lg p-4 bg-green-100 shadow-md">
      <h3 className="text-lg font-bold text-green-800">Asesoría Completada</h3>
      <p className="text-black"><strong>Materia:</strong> {materia}</p>
      <p className="text-black"><strong>Tema:</strong> {tema}</p>
      <p className="text-black"><strong>Asesor:</strong> {nombreAsesor}</p>
      <p className="text-black"><strong>Atendida el:</strong> {new Date(fechaAtendida).toLocaleString()}</p>

      <div className="flex flex-row gap-4 mt-4">
        <button
          onClick={onVerChat}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Ver Chat
        </button>

        <button
          onClick={contestada ? undefined : onEncuesta}
          disabled={contestada}
          className={`px-4 py-2 rounded font-medium transition \
            ${contestada
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'}
          `}
        >
          {contestada ? 'Encuesta Enviada' : 'Encuesta'}
        </button>
      </div>
    </div>
  );
}
