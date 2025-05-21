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
 * GET /api/alumno/perfil/:matricula
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

/**
 * Listar asesorías completadas de un alumno
 * GET /api/alumno/asesorias/completadas
 */
router.get('/asesorias/completadas', (req, res) => {
  const { matricula } = req.query;
  if (!matricula) {
    return res.status(400).json({ error: 'Matrícula requerida' });
  }
  const sql = `
    SELECT
      a.idAsesoria,
      m.nombreMateria AS materia,
      t.nombreTema    AS tema,
      s.nombre        AS nombreAsesor,
      a.fecha_acordada AS fechaAtendida
    FROM Asesoria a
    JOIN Tema    t ON a.idTema   = t.idTema
    JOIN Materia m ON t.idMateria = m.idMateria
    JOIN Asesor  s ON a.matriculaAsesor = s.matricula
    WHERE a.matriculaAlumno = ?
      AND a.estado = 4
  `;
  db.query(sql, [matricula], (err, results) => {
    if (err) {
      console.error('Error al obtener completadas:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
});

// Listar todas las materias con material de apoyo disponible
router.get('/materiales/materias', (req, res) => {
  const sql = `
    SELECT DISTINCT m.idMateria, m.nombreMateria
    FROM MaterialApoyo ma
    JOIN Materia m ON ma.idMateria = m.idMateria
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener materias:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
});

// Listar materiales de apoyo por materia y tipo
router.get('/materiales', (req, res) => {
  const { materia, tipo } = req.query;
  if (!materia) {
    return res.status(400).json({ error: 'idMateria es requerido' });
  }
  let sql = `
    SELECT idMaterial, titulo, contenido, descripcion
    FROM MaterialApoyo
    WHERE idMateria = ?
  `;
  const params = [materia];
  if (tipo === 'pdf') sql += " AND contenido LIKE '%.pdf'";
  else if (tipo === 'video') sql += " AND contenido NOT LIKE '%.pdf'";
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error al obtener materiales:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
});

router.delete('/asesorias/:idAsesoria', (req, res) => {
  const { idAsesoria } = req.params;
  const sql = 'DELETE FROM Asesoria WHERE idAsesoria = ?';
  db.query(sql, [idAsesoria], (err, result) => {
    if (err) {
      console.error('Error al eliminar asesoría:', err);
      return res.status(500).json({ error: 'Error al eliminar asesoría' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json({ message: 'Asesoría eliminada' });
  });
});

// crear alumno 
/**
 * POST /api/alumno/register
 * Recibe: { matricula, nombre, carrera, correoInstitucional, password }
 */
router.post('/register', (req, res) => {
  const { matricula, nombre, carrera, correoInstitucional, password } = req.body;
  // Validaciones
  if (!matricula || !nombre || !carrera || !correoInstitucional || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  if (!correoInstitucional.endsWith('@ite.edu.mx')) {
    return res.status(400).json({ error: 'El correo debe ser institucional (@ite.edu.mx).' });
  }

  const idCarrera = parseInt(carrera, 10);
  if (isNaN(idCarrera)) {
    return res.status(400).json({ error: 'Carrera inválida.' });
  }

  const sql = `
    INSERT INTO Alumno
      (matricula, nombre, email, idCarrera, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [matricula, nombre, correoInstitucional, idCarrera, password], (err, result) => {
    if (err) {
      console.error('Error al registrar alumno:', err);
      return res.status(500).json({ error: 'Error al registrar alumno.' });
    }
    res.status(201).json({ message: 'Alumno registrado', matricula });
  });
});

/**
 * Historial de mensajes de una asesoría
 * GET /api/alumno/mensajes/:idAsesoria
 */
// GET /api/mensajes/:idAsesoria
router.get('/mensajes/:idAsesoria', async (req, res) => {
  const { idAsesoria } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT matriculaRemitente AS remitente, mensaje AS texto, horaMensaje AS timestamp
       FROM Mensaje
       WHERE idAsesoria = ?
       ORDER BY horaMensaje ASC`,
      [idAsesoria]
    );

    // Validar que sea un array válido
    if (!Array.isArray(rows)) {
      return res.status(500).json({ error: 'La respuesta no es una lista de mensajes' });
    }

    // Forzar el encabezado de tipo de contenido
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

module.exports = router;
