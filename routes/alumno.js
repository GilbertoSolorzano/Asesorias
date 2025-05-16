const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear nueva solicitud de asesoría (POST /asesorias)
// routes/alumno.js

router.post('/asesorias', (req, res) => {
  console.log('Datos recibidos:', req.body);

  const { matriculaAlumno, idTema, lugar } = req.body;

  // Validar campos obligatorios
  if (!matriculaAlumno || !idTema) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: matriculaAlumno o idTema.' });
  }

  const estado = 1;
  const fechaCreacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const sql = `
    INSERT INTO Asesoria
      (matriculaAlumno, idTema, lugar, estado, fecha_creacion)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [matriculaAlumno, idTema, lugar || null, estado, fechaCreacion],
    (err, result) => {
      if (err) {
        console.error('Error al crear solicitud:', err);
        return res.status(500).json({ error: 'Error al crear solicitud' });
      }
      res.status(201).json({ message: 'Solicitud creada', id: result.insertId });
    }
  );
});



// Ruta GET /perfil
router.get('/perfil', (req, res) => {
  const sql = `
    SELECT a.matricula, a.nombre, a.email AS correo, c.nombreCarrera AS carrera
    FROM alumno a
    JOIN carrera c ON a.idCarrera = c.idCarrera
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener alumnos:', err);
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
    res.json(results);
  });
});

// Obtener todas las materias
router.get('/materias', (req, res) => {
  const sql = 'SELECT * FROM Materia';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener materias:', err);
      return res.status(500).json({ error: 'Error al consultar materias' });
    }
    res.json(results);
  });
});

// Obtener temas de una materia específica
router.get('/temas/:idMateria', (req, res) => {
  const idMateria = req.params.idMateria;
  const sql = 'SELECT * FROM Tema WHERE idMateria = ?';
  db.query(sql, [idMateria], (err, results) => {
    if (err) {
      console.error('Error al obtener temas:', err);
      return res.status(500).json({ error: 'Error al consultar temas' });
    }
    res.json(results);
  });
});

module.exports = router;
