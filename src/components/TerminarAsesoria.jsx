import React from 'react';

const TerminarAsesoria = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center border border-gray-300">
        <h2 className="text-lg font-bold mb-4">¿Estás seguro de finalizar?</h2>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminarAsesoria;