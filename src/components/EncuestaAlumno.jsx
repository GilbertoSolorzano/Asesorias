"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function EncuestaAlumno({ idAsesoria, matricula, onClose }) {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    console.log("idAsesoria recibido:", idAsesoria);
  }, []);
  useEffect(() => {
    async function fetchPreguntas() {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/alumno/preguntas/alumno"
        );
        setPreguntas(res.data);
      } catch (err) {
        console.error("Error al cargar preguntas:", err);
        setError("No pudimos cargar las preguntas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    }
    fetchPreguntas();
  }, []);

  const allAnswered =
    preguntas.length > 0 &&
    Object.keys(respuestas).length === preguntas.length;

  const handleChange = (idPregunta, valor) => {
    setRespuestas((prev) => ({ ...prev, [idPregunta]: valor }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setMensaje("");
    try {
      await axios.post(
        "http://localhost:3001/api/alumno/encuesta/alumno",
        {
          idAsesoria,
          matriculaRespondente: matricula,
          respuestas: Object.entries(respuestas).map(([idPregunta, respuesta]) => ({
            idPregunta: Number(idPregunta),
            respuesta: Number(respuesta),
          })),
        }
      );
      setMensaje("¡Gracias! Tus respuestas fueron enviadas con éxito");
      // Cerrar la encuesta inmediatamente después de enviar
      onClose();
    } catch (err) {
      console.error("Error al enviar encuesta:", err);
      setMensaje("Ups, algo salió mal. Por favor inténtalo de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-2xl max-w-2xl w-full mx-2 shadow-xl">

        <h2 className="text-3xl font-extrabold mb-2 text-center text-black">
          ¡Tu opinión cuenta!
        </h2>
        <p className="text-center text-black mb-6">
          Califica del 1 (malo) al 5 (excelente)
        </p>

        {loading ? (
          <p className="text-center text-black">Cargando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {preguntas.map((pregunta, i) => (
              <div key={pregunta.idPregunta} className="p-3 bg-gray-100 rounded-lg">
                <p className="font-medium mb-2 text-black">
                  {i + 1}. {pregunta.enunciado}
                </p>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleChange(pregunta.idPregunta, num)}
                      className={`px-4 py-1 rounded-full text-lg font-semibold ${
                        respuestas[pregunta.idPregunta] === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center sticky bottom-0 bg-white pt-4">
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`mt-2 px-10 py-1 rounded-full font-medium transition ${
                  !allAnswered
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                Enviar respuestas
              </button>
              {mensaje && <p className="mt-3 text-sm text-black">{mensaje}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
