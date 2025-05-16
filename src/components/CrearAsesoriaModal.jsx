import React, { useState, useEffect } from 'react';

export default function CrearAsesoriaModal({ onClose, matriculaAlumno }) {
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);
  const [materiaId, setMateriaId] = useState('');
  const [temaId, setTemaId] = useState('');
  const [lugar, setLugar] = useState('Presencial');
  const [nivelUrgencia, setNivelUrgencia] = useState('');

  // Carga materias
  useEffect(() => {
    fetch('http://localhost:3001/api/alumno/materias')
      .then((r) => r.json())
      .then(setMaterias)
      .catch(console.error);
  }, []);

  // Carga temas según materia
  useEffect(() => {
    if (!materiaId) return setTemas([]);
    fetch(`http://localhost:3001/api/alumno/temas/${materiaId}`)
      .then((r) => r.json())
      .then(setTemas)
      .catch(console.error);
  }, [materiaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si no tenemos matrícula, abortamos
    if (!matriculaAlumno) {
      alert('Debe iniciar sesión para crear una solicitud');
      return;
    }

    const payload = {
      matriculaAlumno, // ahora sí la estamos enviando
      idTema: temaId,
      lugar,
      nivelUrgencia: nivelUrgencia || null,
      // NO enviamos fecha_creacion ni estado: el backend las asigna
    };

    try {
      const res = await fetch('http://localhost:3001/api/alumno/asesorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Error: ' + err.error);
        return;
      }

      alert('Solicitud creada con éxito');
      // limpiar
      setMateriaId('');
      setTemaId('');
      setLugar('Presencial');
      setNivelUrgencia('');
      setTemas([]);
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
        Crear Solicitud
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
          <label className="block text-white font-semibold">
            Tema de interés:
          </label>
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
          Enviar
        </button>
      </form>
    </div>
  );
}
