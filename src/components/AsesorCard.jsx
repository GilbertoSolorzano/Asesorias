"use client";

export default function AsesorCard({ tema, nombre, fecha, status, onMensaje }) {
  return (
    <div className="items-center justify-center h-[125px] border rounded-lg p-4 bg-[#66D575] shadow-md">
      <h3 className="text-xs font-bold text-center"> {nombre}</h3>
      <p className="text-xs text-center">Tema: {tema}</p>
      <p className="text-xs text-center">Fecha: {fecha}</p>
      <p className="text-xs text-center">Status: {status}</p>
      <div className="flex justify-center mt-2">
        <button
          onClick={onMensaje}
          className="bg-[#FFC943] text-black px-4 py-2 rounded-3xl hover:bg-blue-600"
        >
        Mensaje
        </button>
      </div>
    </div>
  );
}
