"use client";

export default function AsesorCard({ nombre, tema, fecha, status, onMensaje }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <h3 className="text-lg font-bold">{nombre}</h3>
      <p>
        <strong>Tema:</strong> {tema}
      </p>
      <p>
        <strong>Fecha:</strong> {fecha}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <button
        onClick={onMensaje}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Mensaje
      </button>
    </div>
  );
}
