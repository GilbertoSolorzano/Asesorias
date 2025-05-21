import React, { useState, useEffect } from 'react';

export default function CrearAsesoriaModal({ onClose, matriculaAlumno, modoEdicion = false, asesoriaInicial = null }) {
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);
  const [materiaId, setMateriaId] = useState('');
  const [temaId, setTemaId] = useState('');
  const [lugar, setLugar] = useState('Presencial');

  // Carga materias
  useEffect(() => {
    fetch('http://localhost:3001/api/alumno/materias')
      .then((r) => r.json())
      .then(setMaterias)
      .catch(console.error);
  }, []);

  // Carga temas según materia
  useEffect(() => {
    if (!materiaId) {
      setTemas([]);
      return;
    }
    fetch(`http://localhost:3001/api/alumno/temas/${materiaId}`)
      .then((r) => r.json())
      .then(setTemas)
      .catch(console.error);
  }, [materiaId]);

  // Si es edición, precargar datos
  useEffect(() => {
    if (modoEdicion && asesoriaInicial) {
      setMateriaId(asesoriaInicial.idMateria || '');
      setTemaId(asesoriaInicial.idTema);
      setLugar(asesoriaInicial.lugar || 'Presencial');
    }
  }, [modoEdicion, asesoriaInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!temaId) {
      alert('Selecciona un tema');
      return;
    }

    const payload = { idTema: temaId, lugar };

    try {
      let res;
      if (modoEdicion && asesoriaInicial?.idAsesoria) {
        // Editar
        res = await fetch(
          `http://localhost:3001/api/alumno/asesorias/${asesoriaInicial.idAsesoria}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Crear
        res = await fetch('http://localhost:3001/api/alumno/asesorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, matriculaAlumno }),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        alert('Error: ' + err.error);
        return;
      }

      alert(modoEdicion ? 'Solicitud actualizada' : 'Solicitud creada');
      // Limpiar solo en creación
      if (!modoEdicion) {
        setMateriaId('');
        setTemaId('');
        setLugar('Presencial');
        setTemas([]);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error de red o servidor');
    }
  };

  return (
    <div className="bg-blue-500 p-6 rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white text-xl"
      >
        ✖
      </button>
      <h2 className="text-xl font-bold mb-4 text-white text-center">
        {modoEdicion ? 'Modificar Solicitud' : 'Crear Solicitud'}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-white font-semibold">Materia:</label>
          <select
            className="w-full p-2 border rounded"
            value={materiaId}
            onChange={(e) => setMateriaId(e.target.value)}
            required
          >
            <option value="">Seleccione materia</option>
            {materias.map((m) => (
              <option key={m.idMateria} value={m.idMateria}>
                {m.nombreMateria}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold">Tema de interés:</label>
          <select
            className="w-full p-2 border rounded"
            value={temaId}
            onChange={(e) => setTemaId(e.target.value)}
            disabled={!materiaId}
            required
          >
            <option value="">Seleccione tema</option>
            {temas.map((t) => (
              <option key={t.idTema} value={t.idTema}>
                {t.nombreTema}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between text-white">
          <label>
            <input
              type="radio"
              name="lugar"
              value="Presencial"
              checked={lugar === 'Presencial'}
              onChange={() => setLugar('Presencial')}
            />{' '}
            Presencial
          </label>
          <label>
            <input
              type="radio"
              name="lugar"
              value="En línea"
              checked={lugar === 'En línea'}
              onChange={() => setLugar('En línea')}
            />{' '}
            En línea
          </label>
        </div>

        <button
          type="submit"
          className="bg-white text-blue-500 w-full p-2 rounded hover:bg-gray-200"
        >
          {modoEdicion ? 'Guardar Cambios' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
