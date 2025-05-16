// routes/alumno.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * 1) Listar materias
 * GET /api/alumno/materias
 */
router.get('/materias', (req, res) => {
  const sql = 'SELECT idMateria, nombreMateria FROM Materia';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener materias:', err);
      return res.status(500).json({ error: 'Error al consultar materias' });
    }
    res.json(results);
  });
});

/**
 * 2) Listar temas de una materia
 * GET /api/alumno/temas/:idMateria
 */
router.get('/temas/:idMateria', (req, res) => {
  const { idMateria } = req.params;
  const sql = 'SELECT idTema, nombreTema, descripcion FROM Tema WHERE idMateria = ?';
  db.query(sql, [idMateria], (err, results) => {
    if (err) {
      console.error('Error al obtener temas:', err);
      return res.status(500).json({ error: 'Error al consultar temas' });
    }
    res.json(results);
  });
});

/**
 * 3) Perfil del alumno
 * GET /api/alumno/perfil?matricula=XYZ
 */
router.get('/perfil/:matricula', (req, res) => {
  const { matricula } = req.params;
  const sql = `
    SELECT
      a.matricula,
      a.nombre,
      a.email   AS correo,
      c.nombreCarrera AS carrera
    FROM Alumno a
    JOIN Carrera c ON a.idCarrera = c.idCarrera
    WHERE a.matricula = ?
  `;
  db.query(sql, [matricula], (err, results) => {
    if (err) {
      console.error('Error al obtener perfil:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json(results[0]);
  });
});

router.get('/asesorias', (req, res) => {
  const { matricula } = req.query;

  let sql = `
   SELECT 
    a.idAsesoria,
    a.matriculaAlumno,
    a.idTema,
    a.lugar,
    a.estado,
    a.fecha_creacion,
    t.nombreTema,
    m.nombreMateria
  FROM Asesoria a
  JOIN Tema t ON a.idTema = t.idTema
  JOIN Materia m ON t.idMateria = m.idMateria
  `;

  const params = [];
  if (matricula) {
    sql += ' WHERE a.matriculaAlumno = ?';
    params.push(matricula);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error al obtener asesorías:', err);
      return res.status(500).json({ error: 'Error al consultar asesorías' });
    }
    res.json(results);
  });
});


 

// Crear nueva solicitud de asesoría
router.post('/asesorias', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { matriculaAlumno, idTema, lugar } = req.body;
  if (!matriculaAlumno || !idTema) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: matriculaAlumno o idTema.' });
  }

  const estado = 1;
  const fecha_creacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sql = `
    INSERT INTO Asesoria
      (matriculaAlumno, idTema, lugar, estado, fecha_creacion)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [matriculaAlumno, idTema, lugar || null, estado, fecha_creacion], (err, result) => {
    if (err) {
      console.error('Error al crear solicitud:', err);
      return res.status(500).json({ error: 'Error al crear solicitud' });
    }
    res.status(201).json({ message: 'Solicitud creada', id: result.insertId });
  });
});


// Modificar una asesoría existente
router.put('/asesorias/:idAsesoria', (req, res) => {
  const { idAsesoria } = req.params;
  const { idTema, lugar, estado } = req.body;
  if (!idTema && lugar === undefined && estado === undefined) {
    return res.status(400).json({ error: 'Nada que actualizar' });
  }

  const updates = [];
  const params = [];
  if (idTema) {
    updates.push('idTema = ?');
    params.push(idTema);
  }
  
  if (lugar !== undefined) {
    updates.push('lugar = ?');
    params.push(lugar);
  }
  if (estado !== undefined) {
    updates.push('estado = ?');
    params.push(estado);
  }
  params.push(idAsesoria);

  const sql = `UPDATE Asesoria SET ${updates.join(', ')} WHERE idAsesoria = ?`;
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error al actualizar asesoría:', err);
      return res.status(500).json({ error: 'Error al actualizar asesoría' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json({ message: 'Asesoría actualizada' });
  });
});

module.exports = router;
