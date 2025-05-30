//para el dani
const express = require('express');
const router = express.Router();
const db = require('../db');

//Asesoria que ya se aceptó
router.get('/asesorias/activas', (req, res) => {
    const { matricula } = req.query;
    
    if (!matricula) {
        return res.status(400).json({ error: 'Matrícula no proporcionada' });
    }

    const sql = `
        SELECT
            ase.idAsesoria AS idAsesoria,
            al.nombre AS nombreAlumno,
            t.nombreTema AS tema,
            ase.fecha_acordada AS fecha,
            ase.lugar
        FROM Asesoria AS ase
        JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula 
        JOIN Tema AS t ON ase.idTema = t.idTema
        WHERE ase.estado = 3 AND ase.matriculaAsesor = ?;
    `;
    db.query(sql, [matricula], (err, results) => {
        if (err) {
            console.error('Error al obtener asesorías activas:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
});

//Asesoria que no se ha aceptado o esta pendiente
router.get('/asesorias/solicitud', (req, res) => {
  const { matricula } = req.query;
  if (!matricula) 
    return res.status(400).json({ error: 'Matrícula no proporcionada' });

  const sql = `
    SELECT
      a.idAsesoria    AS id,
      t.nombreTema    AS tema,
      al.nombre       AS nombre,
      t.descripcion   AS notas
    FROM Asesoria AS a
    JOIN Tema          AS t  ON a.idTema        = t.idTema
    JOIN Alumno        AS al ON a.matriculaAlumno = al.matricula
    JOIN AsesorMateria AS am ON t.idMateria     = am.idMateria
    WHERE
      a.estado = 1                  -- pendientes
      AND a.matriculaAsesor IS NULL -- aún sin asignar
      AND am.matriculaAsesor = ?;   -- tu parámetro de login
  `;

  db.query(sql, [matricula], (err, results) => {
    if (err) {
      console.error('Error al obtener solicitudes:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    console.log(`Solicitudes para ${matricula}:`, results);
    res.json(results);
  });
});

//Asesorias finalizadas
router.get('/asesorias/asesorias-finalizadas', (req, res) => {
    const { matricula } = req.query;

    if (!matricula) {
        return res.status(400).json({ error: 'Matrícula no proporcionada' });
    }

    const sql = `
        SELECT
            ase.idAsesoria AS idAsesoria,
            al.nombre AS nombreAlumno,
            t.nombreTema AS tema,
            ase.fecha_acordada AS fecha,
            ase.lugar
        FROM Asesoria AS ase
        JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula 
        JOIN Tema AS t ON ase.idTema = t.idTema
        WHERE ase.estado = 4 AND ase.matriculaAsesor = ?;
    `;

    db.query(sql, [matricula], (err, results) => {
        if (err) {
            console.error('Error al obtener solicitud de asesoría:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        res.json(results);
    });
});
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
      a.matriculaAsesor,
      al.nombre       AS nombreAlumno,
      a.fecha_acordada AS fechaAtendida,
      COALESCE(e.contestada, 0) AS contestada
    FROM Asesoria a
    LEFT JOIN Encuesta e
      ON a.idAsesoria = e.idAsesoria AND e.tipoEncuesta = 'alumno'
    JOIN Tema t    ON a.idTema = t.idTema
    JOIN Materia m ON t.idMateria = m.idMateria
    JOIN Alumno al ON a.matriculaAlumno = al.matricula
    WHERE a.matriculaAsesor = ?
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
router.get('/preguntas/asesor', async (req, res) => {
  try {
    const [preguntas] = await db.promise().query(
      `SELECT idPregunta, enunciado
       FROM PreguntaEncuesta
       WHERE tipoEncuesta = 'asesor'`
    );
    res.json(preguntas);
  } catch (error) {
    console.error('Error al obtener preguntas del asesor:', error);
    res.status(500).json({ mensaje: 'Error al obtener preguntas del asesor' });
  }
});
router.post('/encuesta/asesor', async (req, res) => {
  const { idAsesoria, matriculaRespondente, respuestas } = req.body;
  const arr = Array.isArray(respuestas) ? respuestas : Object.values(respuestas);

  if (!idAsesoria || !matriculaRespondente || arr.length === 0) {
    return res.status(400).json({ error: 'Datos o respuestas faltantes.' });
  }

  try {
    // 1) Upsert en Encuesta con tipo 'asesor'
    await db.promise().query(
      `INSERT INTO Encuesta (idAsesoria, tipoEncuesta)
       VALUES (?, 'asesor')
       ON DUPLICATE KEY UPDATE idEncuesta = LAST_INSERT_ID(idEncuesta)`,
      [idAsesoria]
    );

    // 2) Obtener idEncuesta recién insertado o existente
    const [[{ id }]] = await db.promise().query('SELECT LAST_INSERT_ID() AS id');
    const idEncuesta = id;

    // 3) Insertar todas las respuestas
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

    // 4) Marcar encuesta como contestada
    await db.promise().query(
      `UPDATE Encuesta
         SET contestada = 1
       WHERE idEncuesta = ?`,
      [idEncuesta]
    );

    // 5) Éxito
    return res.status(201).json({ message: 'Respuestas guardadas' });

  } catch (error) {
    console.error('Error guardando encuesta del asesor:', error.code, error.sqlMessage || error.message);
    return res.status(500).json({ error: 'Fallo al guardar encuesta del asesor.' });
  }
});


//Datos perfil Asesor
router.get('/asesorias/perfil-asesor', (req, res) => {
    const { matricula } = req.query;
    console.log('Llamada recibida con matrícula:', matricula);

    if (!matricula) {
        return res.status(400).json({ error: 'Matrícula no proporcionada' });
    }

    const sql = `
        SELECT
            asr.nombre AS nombreAsesor,
            asr.email AS correo,
            asr.password AS contraseñaActual,
            asr.fotografia AS foto

        FROM Asesor AS asr
        WHERE asr.matricula = ?;
    `;

    db.query(sql, [matricula], (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        res.json(results);
    });
});

//Finalizar una asesoria
router.post('/asesorias/finalizar-asesoria', (req, res) => {
    const { idAsesoria } = req.body;

    if (!idAsesoria) {
        return res.status(400).json({ error: 'ID de asesoría no proporcionado' });
    }

    const sql = `UPDATE Asesoria SET estado = 4 WHERE idAsesoria = ?`;

    db.query(sql, [idAsesoria], (err, results) => {
        if (err) {
            console.error('Error al finalizar la asesoría:', err);
            return res.status(500).json({ error: 'Error al actualizar la base de datos' });
        }

        res.json({ message: 'Asesoría finalizada correctamente'});
    });
});

//Aceptar o programar una asesoria
router.post('/asesorias/aceptar-asesoria', (req, res) => {
    const { idAsesoria, matriculaAsesor } = req.body;

    if (!idAsesoria || !matriculaAsesor) {
        return res.status(400).json({ error: 'ID de asesoría o matrícula de asesor no proporcionados' });
    }

    const sql = `
        UPDATE Asesoria
        SET estado = 3,
            matriculaAsesor = ?
        WHERE idAsesoria = ?
    `;

    db.query(sql, [matriculaAsesor, idAsesoria], (err, results) => {
        if (err) {
        console.error('Error al aceptar la asesoría:', err);
        return res.status(500).json({ error: 'Error al actualizar la base de datos' });
        }
        res.json({ message: 'Asesoría aceptada y asesor asignado correctamente' });
    });
});

//Router para grafica de asesor
router.get('/graficar-asesorias', (req, res) => {
    const matriculaAsesor = req.query.matricula;
    
    if (!matriculaAsesor) {
        return res.status(400).json({ error: 'Falta parámetro matricula' });
    }
    const sql = `
        SELECT
            YEAR (fecha_creacion) AS anio,
            MONTH (fecha_creacion) AS mes,
            COUNT(*) AS total_asesorias
        FROM Asesoria
        WHERE estado = 4 AND matriculaAsesor = ? 
        GROUP BY anio, mes
        ORDER BY anio, mes
    `;
    db.query(sql, [matriculaAsesor], (err, results) => {
        if (err) {
            console.error('Error al graficar los datos', err);
            return res.status(500).json({ error: 'Error al actualizar la base de datos' });
        }
        res.json(results);
    });

});

//Cambiar contraseña
router.put('/cambiar-contrasena', (req, res) => {
    const { matricula, nuevaContrasena } = req.body;

    if (!matricula || !nuevaContrasena) {
        return res.status(400).json({ error: 'Faltan datos requeridos para realizar la acción' });
    }

    const sql = `UPDATE Asesor SET password = ? WHERE matricula = ?`;

    db.query(sql, [nuevaContrasena, matricula], (err, results) => {
        if (err) {
            console.error('Error al cambiar la contraseña:', err);
            return res.status(500).json({ error: 'Error al actualizar la base de datos' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Asesor no encontrado' });
        }
        res.json({ message: 'Contraseña actualizada correctamente'});
    });
});

//Route para la accion de modificar una Asesoria
router.put('/asesorias/modificar', (req, res) => {
    const { idAsesoria, fecha_acordada, lugar } = req.body;

    if (!idAsesoria || !fecha_acordada || !lugar) {
        return res.status(400).json({ error: 'Faltan datos por introducir' });
    }

    const sql = `
        UPDATE Asesoria
        SET fecha_acordada = ?, lugar = ?
        WHERE idAsesoria = ?
    `;

    db.query(sql, [fecha_acordada, lugar, idAsesoria], (err, results) => {
        if (err) {
            console.error(`Error al modificar la asesoría ${idAsesoria}:`, err);
            return res.status(500).json({ error: `Error al modificar la asesoría ${idAsesoria}` });
        }

        res.json({ message: 'Asesoría actualizada correctamente' });
    });
});

//Obtiene todas las materias
router.get('/materias-disponibles', (req, res) => {
  const sql = `SELECT idMateria, nombreMateria FROM Materia`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener materias:', err);
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
    res.json(results);
  });
});

//Obtiene las materias asignadas a un asesor
router.get('/materias-asignadas', (req, res) => {
  const { matricula } = req.query;
  if (!matricula) {
    return res.status(400).json({ error: 'Matrícula no proporcionada' });
  }

  const sql = `
    SELECT m.idMateria, m.nombreMateria
    FROM Materia m
    JOIN AsesorMateria am ON m.idMateria = am.idMateria
    WHERE am.matriculaAsesor = ?
  `;
  db.query(sql, [matricula], (err, results) => {
    if (err) {
      console.error('Error al obtener materias del asesor:', err);
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
    res.json(results);
  });
});

//Agrega una materia a un asesor
router.post('/agregar-materia-asesor', (req, res) => {
  const { matricula, materias } = req.body;

  if (!matricula || !Array.isArray(materias) || materias.length === 0) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Prepara valores para inserción múltiple
  const values = materias.map(idMateria => [matricula, idMateria]);

  const sql = `
    INSERT IGNORE INTO AsesorMateria (matriculaAsesor, idMateria)
    VALUES ?
  `;

  db.query(sql, [values], (err, results) => {
    if (err) {
      console.error('Error al agregar materias al asesor:', err);
      return res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }
    res.json({ message: 'Materias asignadas correctamente' });
  });
});


//Borrar una materia a un asesor
router.post('/eliminar-materia', (req, res) => {
  const { matricula, idMateria } = req.body;
  if (!matricula || !idMateria) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    DELETE FROM AsesorMateria
    WHERE matriculaAsesor = ? AND idMateria = ?
  `;
  db.query(sql, [matricula, idMateria], (err, results) => {
    if (err) {
      console.error('Error al quitar materia del asesor:', err);
      return res.status(500).json({ error: 'Error al eliminar en la base de datos' });
    }
    res.json({ message: 'Materia desasignada correctamente' });
  });
});
module.exports = router;
