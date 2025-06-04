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
    a.fecha_acordada, 
    t.nombreTema,
    m.nombreMateria,
    s.nombre AS nombreAsesor
  FROM Asesoria a
  JOIN Tema t ON a.idTema = t.idTema
  JOIN Materia m ON t.idMateria = m.idMateria
  LEFT JOIN Asesor s ON a.matriculaAsesor = s.matricula
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
  const { idTema, lugar, estado, fecha_acordada } = req.body;
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
  if (fecha_acordada) {
    updates.push('fecha_acordada = ?');
  params.push(fecha_acordada);
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
      a.fecha_acordada AS fechaAtendida,
      COALESCE(e.contestada, 0) AS contestada
    FROM Asesoria a
    LEFT JOIN Encuesta e
      ON a.idAsesoria = e.idAsesoria AND e.tipoEncuesta = 'alumno'
    JOIN Tema t    ON a.idTema   = t.idTema
    JOIN Materia m ON t.idMateria = m.idMateria
    LEFT JOIN Asesor s  ON a.matriculaAsesor = s.matricula
    WHERE a.matriculaAlumno = ?
      AND a.estado = 4;
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
// GET /api/alumno/carreras
router.get('/carreras', (req, res) => {
  const sql = 'SELECT idCarrera, nombreCarrera AS nombre FROM Carrera';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener carreras:', err);
      return res.status(500).json({ error: 'Error al consultar carreras' });
    }
    res.json(results);
  });
});

router.get('/asesorias/:idAsesoria', (req, res) => {
  const { idAsesoria } = req.params;
  const sql = `
    SELECT 
      a.idAsesoria,
      a.matriculaAlumno,
      a.matriculaAsesor,
      a.lugar,
      a.estado,
      a.fecha_acordada,
      t.nombreTema,
      m.nombreMateria,
      s.nombre AS nombreAsesor
    FROM Asesoria a
    JOIN Tema t ON a.idTema = t.idTema
    JOIN Materia m ON t.idMateria = m.idMateria
    JOIN Asesor s ON a.matriculaAsesor = s.matricula
    WHERE a.idAsesoria = ?
  `;
  db.query(sql, [idAsesoria], (err, results) => {
    if (err) {
      console.error('Error al obtener asesoría:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json(results[0]);
  });
});


router.get('/preguntas/alumno', async (req, res) => {
  try {
    // Usamos db.promise() si tu conexión es con mysql2; si es con otro cliente,
    // adapta la llamada a tu API de promesas o callbacks.
    const [preguntas] = await db.promise().query(
      `SELECT idPregunta, enunciado
       FROM PreguntaEncuesta
       WHERE tipoEncuesta = 'alumno'`
    );
    res.json(preguntas);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ mensaje: 'Error al obtener preguntas' });
  }
});

// routes/alumno.js



router.post('/encuesta/alumno', async (req, res) => {
  const { idAsesoria, matriculaRespondente, respuestas } = req.body;
  const arr = Array.isArray(respuestas) ? respuestas : Object.values(respuestas);
  if (!idAsesoria || !matriculaRespondente || arr.length === 0) {
    return res.status(400).json({ error: 'Datos o respuestas faltantes.' });
  }

  try {
    // 1) Upsert en Encuesta
    await db.promise().query(
      `INSERT INTO Encuesta (idAsesoria, tipoEncuesta)
       VALUES (?, 'alumno')
       ON DUPLICATE KEY UPDATE idEncuesta = LAST_INSERT_ID(idEncuesta)`,
      [idAsesoria]
    );

    // 2) Obtener idEncuesta
    const [[{ id }]] = await db.promise().query('SELECT LAST_INSERT_ID() AS id');
    const idEncuesta = id;

    // 3) Insertar respuestas en bloque
    const values = arr.map(r => [
      idEncuesta,
      r.idPregunta,
      matriculaRespondente,
      r.respuesta
    ]);
    await db.promise().query(
      `INSERT INTO RespuestaEncuesta
         (idEncuesta, idPregunta, matriculaRespondente, respuesta)
       VALUES ?`,
      [values]
    );

    // 4) **Marcar encuesta como contestada** (MUEVE este UPDATE **antes** del return)
    await db.promise().query(
      `UPDATE Encuesta
         SET contestada = 1
       WHERE idEncuesta = ?`,
      [idEncuesta]
    );

    // 5) Finalmente responde al cliente
    return res.status(201).json({ message: 'Respuestas guardadas' });

  } catch (error) {
    console.error('Error guardando encuesta:', error.code, error.sqlMessage || error.message);
    return res.status(500).json({ error: 'Fallo al guardar encuesta.' });
  }
});




module.exports = router;
