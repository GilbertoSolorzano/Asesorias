'use client'
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from 'axios'; // Asegúrate de tener axios importado
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AsesoriasFinalizadas() {
  const [datosAsesores, setDatosAsesores] = useState([]);
  const [graficaData, setGraficaData] = useState({});

  // Función para agrupar por materia y contar las asesorías
  const agruparPorMateria = (datos) => {
    const materialesContados = {};

    // Contar la cantidad de asesorías por materia
    datos.forEach((asesoria) => {
      if (materialesContados[asesoria.material]) {
        materialesContados[asesoria.material]++;
      } else {
        materialesContados[asesoria.material] = 1;
      }
    });

    return materialesContados;
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/asesorias/finalizadas') // Este endpoint debe estar en tu backend
      .then(res => {
        const datos = res.data;
        setDatosAsesores(datos);
        console.log('Datos asignados a datosAsesores:', datos);  

        // Agrupar los datos por materia
        const materialesContados = agruparPorMateria(datos);
        
        // Formato para la gráfica
        const materiales = Object.keys(materialesContados); // Materias
        const cantidades = Object.values(materialesContados); // Cantidades de asesorías

        setGraficaData({
          labels: materiales,
          datasets: [
            {
              label: 'Asesorías por Materia',
              data: cantidades,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'], // Colores para cada segmento
            }
          ]
        });
      })
      .catch(err => console.error('Error al obtener datos:', err));
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                  <HamburgerMenu  role="administrador"/>
      </aside>
      <div className="min-h-screen w-full bg-gray-300 flex flex-col items-center p-6">
        <div className="bg-white w-full max-w-6xl rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Asesorías Finalizadas</h1>

          {/* Gráfica */}
          <div className="bg-purple-300 w-64 h-64 flex items-center justify-center rounded-full">
            {graficaData.labels ? (
              <Pie data={graficaData} />
            ) : (
              <span className="text-center text-white font-bold">No hay datos</span>
            )}
          </div>

          {/* Tabla de Asesores */}
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
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-full">
                          Ver encuesta
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
    </div>
  );
}
