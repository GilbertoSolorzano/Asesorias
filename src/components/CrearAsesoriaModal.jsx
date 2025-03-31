export default function CrearAsesoriaModal({ onClose }) {
    return (
      <div className="bg-blue-500 p-6 rounded-lg shadow-lg relative">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white text-xl"
        >
          ✖
        </button>
  
        <h2 className="text-xl font-bold mb-4 text-white text-center">Crear Solicitud</h2>
  
        <form className="space-y-4">
          <div>
            <label className="block text-white font-semibold">Materia:</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
  
          <div>
            <label className="block text-white font-semibold">Tema de interés:</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>
  
          <div className="flex justify-between text-white">
            <label>
              <input type="radio" name="modalidad" /> Presencial
            </label>
            <label>
              <input type="radio" name="modalidad" /> En línea
            </label>
          </div>
  
          <div>
            <label className="block text-white font-semibold">Nivel de urgencia:</label>
            <select className="w-full p-2 border rounded">
              <option>Seleccione...</option>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </div>
  
          <div>
            <label className="block text-white font-semibold">Fecha límite:</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
  
          <div>
            <label className="block text-white font-semibold">Observaciones:</label>
            <textarea className="w-full p-2 border rounded"></textarea>
          </div>
  
          <button type="submit" className="bg-white text-blue-500 w-full p-2 rounded hover:bg-gray-200">
            Enviar
          </button>
        </form>
      </div>
    );
  }
  