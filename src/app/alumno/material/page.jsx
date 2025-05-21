"use client";
import CrearMaterial from "@/components/CrearMaterialApoyo";
import HamburgerMenu from "@/components/HamburgerMenu";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [create, setCreate] = useState(false);
  const [materiales, setMateriales] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [filtroMateria, setFiltroMateria] = useState("");

  // 1) Carga de materiales
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/admin/materiales")
      .then((res) => setMateriales(res.data))
      .catch((err) => console.error("Error al obtener materiales:", err));
  }, [create]);

  // 2) Carga de materias para el filtro
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/admin/materias")
      .then((res) => setMaterias(res.data))
      .catch((err) => console.error("Error al obtener materias:", err));
  }, []);

  // 3) Materiales ya filtrados
  const materialesFiltrados = filtroMateria
    ? materiales.filter((mat) => mat.idMateria === Number(filtroMateria))
    : materiales;

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
        <HamburgerMenu role="administrador" />
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 bg-gray-100 p-8 relative">
        {/* Encabezado */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-950">
            Bienvenido al material para los alumnos
          </h1>
        </header>

        {/* Filtro por materia */}
        <div className="mb-6 flex items-center space-x-4">
          <label className="font-semibold text-gray-700">Filtrar por materia:</label>
          <select
            className="p-2 border rounded"
            value={filtroMateria}
            onChange={(e) => setFiltroMateria(e.target.value)}
          >
            <option value="">— Todas —</option>
            {materias.map((m) => (
              <option key={m.idMateria} value={m.idMateria}>
                {m.nombreMateria}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de materiales */}
        <main className="grid grid-cols-3 gap-8">
          {materialesFiltrados.length === 0 ? (
            <p className="text-gray-500 col-span-3">
              No hay materiales para mostrar.
            </p>
          ) : (
            materialesFiltrados.map((material) => (
              <div
                key={material.idMaterial}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                  {material.titulo}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {material.descripcion}
                </p>
                <a
                  href={material.contenido}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  Ver contenido
                </a>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
