export default function Encuesta({ onClose }) {
    return (
      <div className="bg-green-400 p-6 rounded-lg shadow-lg absolute top-0.5 top-left-1/4 w-1/2 z-50">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-700 text-xl"
        >
          ✖
        </button>
  
        <h2 className="text-xl font-bold mb-4 text-white text-center">Encuesta alumno</h2>
  
        <p className="text-white text-center mb-4">
          En escala de 1 a 5 (1 = malo, 5 = excelente)
        </p>
  
        <form className="space-y-4">
          {/* Pregunta 1 */}
          <div>
            <p className="text-white font-semibold">
              1. ¿Estás satisfecho con la calidad de las asesorías universitarias que has recibido?
            </p>
            <div className="flex justify-around mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="text-white">
                  <input type="radio" name="calidad" value={num} className="mr-1" />
                  {num}
                </label>
              ))}
            </div>
          </div>
  
          {/* Pregunta 2 */}
          <div>
            <p className="text-white font-semibold">
              2. ¿Estás satisfecho con la atención que has recibido por parte de los asesores?
            </p>
            <div className="flex justify-around mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="text-white">
                  <input type="radio" name="atencion" value={num} className="mr-1" />
                  {num}
                </label>
              ))}
            </div>
          </div>
  
          {/* Pregunta 3 */}
          <div>
            <p className="text-white font-semibold">
              3. ¿Recomendarías las asesorías universitarias a otros estudiantes?
            </p>
            <div className="flex justify-around mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="text-white">
                  <input type="radio" name="recomendacion" value={num} className="mr-1" />
                  {num}
                </label>
              ))}
            </div>
          </div>
  
          {/* Botón enviar */}
          <button type="submit" className="bg-gray-200 text-green-700 w-full p-2 rounded hover:bg-gray-300">
            Enviar
          </button>
        </form>
      </div>
    );
  }
  