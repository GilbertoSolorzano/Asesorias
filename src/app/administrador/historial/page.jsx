'use client';

import HamburgerMenu from "@/components/HamburgerMenu";

export default function asesoriasfinalizadas() {
  // Simulación de datos que luego conectarás a una base
  const datosAsesores = [
    { material: 'Calculo I', nombre: 'Abraham H.', alumno: 'Erick' },
    { material: 'Calculo II', nombre: 'Barry L.', alumno: 'Marcos' },
    { material: 'Fundamentos', nombre: 'Carlos S.', alumno: 'Esteban' },
    { material: 'POO', nombre: 'Diana O.', alumno: 'Ricardo' },
  ];

  return (
    <div className="flex relative">
                {/* Sidebar */}
                <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
                    <HamburgerMenu  role="administrador"/>
                </aside>
    <div className="min-h-screen  w-full bg-gray-300 flex flex-col items-center p-6">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Asesorias finalizadas</h1>

        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          
          {/* Gráfica (simulada aquí como un div, la puedes remplazar por chart.js o d3.js) */}
          <div className="bg-purple-300 w-64 h-64 flex items-center justify-center rounded-full">
            {/* Aquí va la gráfica */}
            <span className="text-center text-white font-bold">Gráfica<br/>de materias</span>
          </div>

          {/* Botones de filtro y ordenar */}
          <div className="flex flex-col gap-4">
            <button className="bg-gray-400 text-white font-semibold py-2 px-4 rounded shadow">
              Filtrar
            </button>
            <button className="bg-gray-400 text-white font-semibold py-2 px-4 rounded shadow flex items-center justify-center gap-2">
              Ordenar
              <div className="flex flex-col">
                <span>⬇️</span>
                <span>⬆️</span>
              </div>
            </button>
          </div>

        </div>

        {/* Tabla de asesores */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">Material</th>
                  <th className="py-2 px-4">Nombre</th>
                  <th className="py-2 px-4">Nombre alumno</th>
                  <th className="py-2 px-4">Encuestas</th>
                </tr>
              </thead>
              <tbody>
                {datosAsesores.map((asesor, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{asesor.material}</td>
                    <td className="py-2 px-4">{asesor.nombre}</td>
                    <td className="py-2 px-4">{asesor.alumno}</td>
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
