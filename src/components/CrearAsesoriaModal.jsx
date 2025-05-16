import { useState } from 'react';

export default function CrearAsesoriaModal({ onClose, matriculaAlumno }) {
  const [materiaId, setMateriaId] = useState('');
  const [temaId, setTemaId] = useState('');
  const [lugar, setLugar] = useState('Presencial');
  const [nivelUrgencia, setNivelUrgencia] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);

  // Cargar materias cuando el componente monte
  React.useEffect(() => {
    fetch('http://localhost:3001/api/alumno/materias')
      .then(res => res.json())
      .then(data => setMaterias(data))
      .catch(console.error);
  }, []);

  // Cargar temas cuando seleccionas materia
  React.useEffect(() => {
    if (!materiaId) return;
    fetch(`http://localhost:3001/api/alumno/temas/${materiaId}`)
      .then(res => res.json())
      .then(data => setTemas(data))
      .catch(console.error);
  }, [materiaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      matriculaAlumno,
      idTema: temaId,
      lugar,
      nivelUrgencia,
      fechaLimite,
      observaciones,
    };

    try {
      const res = await fetch('http://localhost:3001/api/alumno/asesorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Error: ' + errorData.error);
        return;
      }

      alert('Solicitud creada con éxito');
      onClose();
    } catch (err) {
      alert('Error de red o servidor');
      console.error(err);
    }
  };

  return (
    <div className="bg-blue-500 p-6 rounded-lg shadow-lg relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">✖</button>
      <h2 className="text-xl font-bold mb-4 text-white text-center">Crear Solicitud</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>

        <div>
          <label className="block text-white font-semibold">Materia:</label>
          <select
            className="w-full p-2 border rounded"
            value={materiaId}
            onChange={e => setMateriaId(e.target.value)}
            required
          >
            <option value="">Seleccione una materia</option>
            {materias.map(m => (
              <option key={m.idMateria} value={m.idMateria}>{m.nombreMateria}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold">Tema de interés:</label>
          <select
            className="w-full p-2 border rounded"
            value={temaId}
            onChange={e => setTemaId(e.target.value)}
            required
            disabled={!materiaId}
          >
            <option value="">Seleccione un tema</option>
            {temas.map(t => (
              <option key={t.idTema} value={t.idTema}>{t.nombreTema}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between text-white">
          <label>
            <input
              type="radio"
              name="modalidad"
              value="Presencial"
              checked={lugar === 'Presencial'}
              onChange={() => setLugar('Presencial')}
            /> Presencial
          </label>
          <label>
            <input
              type="radio"
              name="modalidad"
              value="En línea"
              checked={lugar === 'En línea'}
              onChange={() => setLugar('En línea')}
            /> En línea
          </label>
        </div>

        <div>
          <label className="block text-white font-semibold">Nivel de urgencia:</label>
          <select
            className="w-full p-2 border rounded"
            value={nivelUrgencia}
            onChange={e => setNivelUrgencia(e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold">Fecha límite:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={fechaLimite}
            onChange={e => setFechaLimite(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-white font-semibold">Observaciones:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
          />
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
