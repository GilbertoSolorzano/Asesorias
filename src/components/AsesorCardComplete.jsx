"use client";

export default function AsesorCardCompleted({
  materia,
  tema,
  nombreAlumno,
  fechaAtendida,
  onVerChat,
  onEncuesta,
  contestada = false
}) {
  return (
    <div className="border rounded-lg p-4 bg-green-100 shadow-md m-2">
      <h3 className="text-lg font-bold text-green-800">Asesoría Completada</h3>
      <p className="text-black text-sm md:text-base"><strong>Materia:</strong> {materia}</p>
      <p className="text-black text-sm md:text-base"><strong>Tema:</strong> {tema}</p>
      <p className="text-black text-sm md:text-base"><strong>Alumno:</strong> {nombreAlumno}</p>
      <p className="text-black text-sm md:text-base"><strong>Atendida el:</strong> {new Date(fechaAtendida).toLocaleString()}</p>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <button
          onClick={onVerChat}
          className="bg-blue-600 text-sm sm:text-base md:text-lg text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3  rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Ver Chat
        </button>

        <button
          onClick={contestada ? undefined : onEncuesta}
          disabled={contestada}
          className={`
            w-full sm:w-auto
            text-sm sm:text-base md:text-lg
            px-3 sm:px-4 md:px-6 
            py-2 sm:py-2.5 md:py-3
            rounded font-medium transition
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
