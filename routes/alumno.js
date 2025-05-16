const express = require('express');
const router = express.Router();
const db = require('../db');

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

//"http://localhost:3001/api/alumno" +++++ como nombres esto /perfil


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

// Crear nueva solicitud de asesoría
router.post('/asesorias', (req, res) => {
  const {
    matriculaAlumno,
    idTema,
    lugar,
    nivelUrgencia,
    fechaLimite,
    observaciones,
  } = req.body;

  // Validaciones básicas
  if (!matriculaAlumno || !idTema || !lugar) {
    return res.status(400).json({ error: 'Faltan datos obligatorios: matriculaAlumno, idTema o lugar.' });
  }

  // Estado siempre 1 al crear
  const estado = 1;

  // Formatear fecha de creación a formato MySQL DATETIME
  const fechaCreacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // La fecha límite puede ser null o undefined, valida y formatea si existe
  let fechaLimiteFormateada = null;
  if (fechaLimite) {
    fechaLimiteFormateada = new Date(fechaLimite).toISOString().slice(0, 19).replace('T', ' ');
  }

  const sql = `
    INSERT INTO Asesoria 
      (matriculaAlumno, idTema, lugar, estado, fecha_creacion, fecha_limite, nivel_urgencia, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      matriculaAlumno,
      idTema,
      lugar,
      estado,
      fechaCreacion,
      fechaLimiteFormateada,
      nivelUrgencia,
      observaciones || null,
    ],
    (err, result) => {
      if (err) {
        console.error('Error al crear solicitud:', err);
        return res.status(500).json({ error: 'Error al crear solicitud' });
      }
      res.status(201).json({ message: 'Solicitud creada', id: result.insertId });
    }
  );
});

module.exports = router;

module.exports = router;
