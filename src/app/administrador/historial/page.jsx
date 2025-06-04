'use client'

// Importación de componentes y librerías necesarias
import ChatModal from '@/components/ChatModal';
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from 'axios';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

// Registro de elementos necesarios para la gráfica de pastel
ChartJS.register(ArcElement, Tooltip, Legend);

// Componente principal de la vista de asesorías finalizadas
export default function AsesoriasFinalizadas() {
  // Estados para almacenar datos y controlar interfaz
  const [datosAsesores, setDatosAsesores] = useState([]);
  const [graficaData, setGraficaData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [datosEncuesta, setDatosEncuesta] = useState({ alumno: [], asesor: [] });
  const [mensajesChat, setMensajesChat] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);

  // Función que abre el modal de encuestas y obtiene los datos asociados a una asesoría
  const abrirModal = async (idAsesoria) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/admin/encuestas/${idAsesoria}`);
      setDatosEncuesta(res.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al obtener encuesta:', error);
      alert('Error al cargar las encuestas');
    }
  };

  // Función que abre el modal del chat y carga los mensajes asociados a una asesoría
  const abrirChat = async (idAsesoria) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/alumno/mensajes/${idAsesoria}`);
      setMensajesChat(res.data);
      setChatVisible(true);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      alert('Error al obtener mensajes del chat.');
    }
  };

  // Agrupación de asesorías por materia y conteo para la gráfica
  const agruparPorMateria = (datos) => {
    const materialesContados = {};

    datos.forEach((asesoria) => {
      if (materialesContados[asesoria.material]) {
        materialesContados[asesoria.material]++;
      } else {
        materialesContados[asesoria.material] = 1;
      }
    });

    return materialesContados;
  };

  // Carga de asesorías finalizadas y procesamiento de datos para la gráfica
  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/asesorias/finalizadas')
      .then(res => {
        const datos = res.data;
        setDatosAsesores(datos);

        const materialesContados = agruparPorMateria(datos);
        const materiales = Object.keys(materialesContados);
        const cantidades = Object.values(materialesContados);

        setGraficaData({
          labels: materiales,
          datasets: [
            {
              label: 'Asesorías por Materia',
              data: cantidades,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
            }
          ]
        });
      })
      .catch(err => console.error('Error al obtener datos:', err));
  }, []);

  // Render principal
  return (
    <div className="flex relative text-black">
      {/* Menú lateral */}
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="administrador" />
      </aside>

      {/* Contenido principal */}
      <div className="min-h-screen w-full bg-gray-300 flex flex-col items-center p-6">
        <div className="bg-white w-full max-w-6xl rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Asesorías Finalizadas</h1>

          {/* Gráfica de asesorías por materia */}
          <div className="bg-purple-300 w-64 h-64 flex items-center justify-center rounded-full">
            {graficaData.labels ? (
              <Pie data={graficaData} />
            ) : (
              <span className="text-center text-white font-bold">No hay datos</span>
            )}
          </div>

          {/* Tabla con detalles de asesorías */}
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Fecha</th>
                    <th className="py-2 px-4">Nombre Asesor</th>
                    <th className="py-2 px-4">Nombre Alumno</th>
                    <th className="py-2 px-4">Materia</th>
                    <th className="py-2 px-4">Encuestas</th>
                    <th className="py-2 px-4">Mensajes</th>
                  </tr>
                </thead>
                <tbody>
                  {datosAsesores.map((asesor, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">{asesor.fecha_acordada?.split('T')[0] || 'Sin fecha'}</td>
                      <td className="py-2 px-4">{asesor.nombre_asesor}</td>
                      <td className="py-2 px-4">{asesor.nombre_alumno}</td>
                      <td className="py-2 px-4">{asesor.material}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => abrirModal(asesor.idAsesoria)}
                          className="bg-green-500 hover:bg-orange-600 text-white font-bold py-1 px-4 rounded-full"
                        >
                          Ver
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => abrirChat(asesor.idAsesoria)}
                          className="bg-orange-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-full"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal con resultados de encuestas */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 relative animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Encuesta del Alumno</h2>
            {datosEncuesta.alumno.length > 0 ? (
              datosEncuesta.alumno.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-medium text-gray-900">{item.enunciado}</p>
                  <p className="text-gray-600 ml-4">
                    <span className="font-semibold">Respuesta:</span>{' '}
                    {item.respuesta !== null ? item.respuesta : (
                      <span className="italic text-gray-400">Sin respuesta</span>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <p className="italic text-gray-500">No hay preguntas para el alumno.</p>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6 border-b pb-2">Encuesta del Asesor</h2>
            {datosEncuesta.asesor.length > 0 ? (
              datosEncuesta.asesor.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-medium text-gray-900">{item.enunciado}</p>
                  <p className="text-gray-600 ml-4">
                    <span className="font-semibold">Respuesta:</span>{' '}
                    {item.respuesta !== null ? item.respuesta : (
                      <span className="italic text-gray-400">Sin respuesta</span>
                    )}
                  </p>
                </div>
              ))
            ) : (
              <p className="italic text-gray-500">No hay preguntas para el asesor.</p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalVisible(false)}
                className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de chat con historial de mensajes */}
      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        mensajes={mensajesChat}
      />
    </div>
  );
}
