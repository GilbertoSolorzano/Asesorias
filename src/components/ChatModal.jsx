// components/ChatModal.jsx
'use client';
import React from 'react';

export default function ChatModal({ visible, onClose, mensajes }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Historial de Mensajes</h2>

        {mensajes.length > 0 ? (
          mensajes.map((msg, index) => (
            <div key={index} className="mb-3">
              <p className="text-sm text-gray-700">
                <strong>{msg.remitente}:</strong> {msg.texto}
              </p>
              <p className="text-xs text-gray-400 ml-4">{msg.timestamp}</p>
            </div>
          ))
        ) : (
          <p className="italic text-gray-500">No hay mensajes para esta asesoría.</p>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
