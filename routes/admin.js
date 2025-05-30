const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/asesorias', (req, res) => {
    const sql = `
        SELECT 
            a.idAsesoria,
            al.nombre AS alumno,
            asr.nombre AS asesor,
            t.nombreTema AS tema,
            a.fecha_acordada,
            a.estado,
            a.lugar
        FROM Asesoria a
        JOIN Alumno al ON a.matriculaAlumno = al.matricula
        LEFT JOIN Asesor asr ON a.matriculaAsesor = asr.matricula
        JOIN Tema t ON a.idTema = t.idTema
        ORDER BY a.fecha_creacion DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener asesorías:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
});

router.get('/perfil', (req, res) => {
    db.query('SELECT matricula, nombre, email, password FROM Administrador', (err, results) => {
        if (err) {
            console.error('Error al obtener administradores:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        res.json(results);
    });
});
router.post('/admins', (req, res) => {
    const { matricula, nombre, email, password } = req.body;

    if (!matricula || !nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'INSERT INTO Administrador (matricula, nombre, email, password) VALUES (?, ?, ?, ?)';
    const values = [matricula, nombre, email, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar administrador:', err);
            return res.status(500).json({ error: 'Error al guardar en la base de datos' });
        }

        res.status(201).json({ message: 'Administrador agregado correctamente' });
    });
});
router.get('/perfil/:matricula', (req, res) => {
    const { matricula } = req.params;

    db.query('SELECT matricula, nombre, email, password FROM Administrador WHERE matricula = ?', [matricula], (err, results) => {
        if (err) {
            console.error('Error al obtener perfil del administrador:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        res.json(results[0]); // Devolver solo el objeto, no un arreglo
    });
});

// En routes/admin/perfil.js o similar
router.put('/perfil/:matricula', (req, res) => {
    const { nombre, email, password } = req.body;
    const { matricula } = req.params;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = 'UPDATE Administrador SET nombre = ?, email = ?, password = ? WHERE matricula = ?';
    const values = [nombre, email, password, matricula];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar administrador:', err);
            return res.status(500).json({ error: 'Error al actualizar en la base de datos' });
        }

        res.json({ message: 'Administrador actualizado correctamente' });
    });
});



router.get('/asesores', (req, res) => {
    db.query('SELECT matricula, nombre, email AS correo FROM asesor', (err, results) => {
        if (err) {
            console.error('Error al obtener asesores:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        const asesoresConExtras = results.map((asesor) => ({
            ...asesor,
            horas:0,            // Math.floor(Math.random() * 100), // Ejemplo temporal
            calificacion: 0     //Math.floor(Math.random() * 4) + 7 // entre 7 y 10
        }));

        res.json(asesoresConExtras);
    });
});
router.post('/asesores', (req, res) => {
    const { matricula, nombre, email, password } = req.body;

    if (!matricula || !nombre || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const sql = 'INSERT INTO Asesor (matricula, nombre, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [matricula, nombre, email, password], (err, result) => {
        if (err) {
            console.error('Error al insertar asesor:', err);
            return res.status(500).json({ error: 'Error al insertar el asesor' });
        }
    
        res.status(201).json({ message: 'Pregunta insertada correctamente', idPregunta: result.insertId });
    });
});
router.get('/alumnos', (req, res) => {
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
router.get('/asesorias/finalizadas', (req, res) => {
    const sql = `
        SELECT
        m.nombreMateria AS material,
        a.nombre AS nombre_asesor,
        al.nombre AS nombre_alumno,
        ase.fecha_acordada,
        ase.idAsesoria
        FROM Asesoria AS ase
        JOIN Asesor AS a ON ase.matriculaAsesor = a.matricula
        JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula
        JOIN Tema AS t ON ase.idTema = t.idTema
        JOIN Materia AS m ON t.idMateria = m.idMateria
        WHERE ase.estado = 4;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener asesorias:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
});
router.get('/encuestas/:idAsesoria', (req, res) => {
    const { idAsesoria } = req.params;
  
    db.query(
      `SELECT idEncuesta FROM Encuesta WHERE idAsesoria = ? AND tipoEncuesta = 'alumno'`,
      [idAsesoria],
      (err, resultsAlumno) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al obtener encuesta alumno' });
        }
        const encuestaAlumno = resultsAlumno[0];
  
        let respuestasAlumno = [];
  
        const continuarConAsesor = () => {
          db.query(
            `SELECT idEncuesta FROM Encuesta WHERE idAsesoria = ? AND tipoEncuesta = 'asesor'`,
            [idAsesoria],
            (err3, resultsAsesor) => {
              if (err3) {
                console.error(err3);
                return res.status(500).json({ message: 'Error al obtener encuesta asesor' });
              }
              const encuestaAsesor = resultsAsesor[0];
  
              if (!encuestaAsesor) {
                return res.json({ alumno: respuestasAlumno, asesor: [] });
              }
  
              db.query(
                `SELECT p.enunciado, r.respuesta
                 FROM PreguntaEncuesta p
                 LEFT JOIN RespuestaEncuesta r 
                   ON p.idPregunta = r.idPregunta AND r.idEncuesta = ?
                 WHERE p.tipoEncuesta = 'asesor'
                 ORDER BY p.idPregunta`,
                [encuestaAsesor.idEncuesta],
                (err4, respuestasAsesor) => {
                  if (err4) {
                    console.error(err4);
                    return res.status(500).json({ message: 'Error al obtener respuestas asesor' });
                  }
  
                  return res.json({
                    alumno: respuestasAlumno,
                    asesor: respuestasAsesor,
                  });
                }
              );
            }
          );
        };
  
        if (!encuestaAlumno) {
          respuestasAlumno = [];
          return continuarConAsesor();
        }
  
        db.query(
          `SELECT p.enunciado, r.respuesta
           FROM PreguntaEncuesta p
           LEFT JOIN RespuestaEncuesta r 
             ON p.idPregunta = r.idPregunta AND r.idEncuesta = ?
           WHERE p.tipoEncuesta = 'alumno'
           ORDER BY p.idPregunta`,
          [encuestaAlumno.idEncuesta],
          (err2, resultAlumnoFinal) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ message: 'Error al obtener preguntas/respuestas alumno' });
            }
  
            respuestasAlumno = resultAlumnoFinal;
            continuarConAsesor();
          }
        );
      }
    );
  });
  
  
  
  
router.get('/preguntas', (req, res) => {
    const sql = `SELECT * FROM PreguntaEncuesta`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener preguntas:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        const agrupadas = {
            alumno: results.filter(p => p.tipoEncuesta === 'alumno'),
            asesor: results.filter(p => p.tipoEncuesta === 'asesor'),
        };
        res.json(agrupadas);
    });
});
router.post('/preguntas', (req, res) => {
    const { tipoEncuesta, enunciado } = req.body;

    if (!tipoEncuesta || !enunciado) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    } 
    const sql = 'INSERT INTO PreguntaEncuesta (tipoEncuesta, enunciado) VALUES (?, ?)';
    db.query(sql, [tipoEncuesta, enunciado], (err, result) => {
        if (err) {
            console.error('Error al insertar pregunta:', err);
            return res.status(500).json({ error: 'Error al insertar la pregunta' });
        }
    
        res.status(201).json({ message: 'Pregunta insertada correctamente', idPregunta: result.insertId });
    });
});
router.delete('/preguntas/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM PreguntaEncuesta WHERE idPregunta = ?`;

    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error al eliminar la pregunta:', err);
            return res.status(500).json({ error: 'Error al eliminar' });
        }
        res.json({ success: true });
    });
});
router.get('/materias', (req, res) => {
    db.query('SELECT idMateria, nombreMateria FROM Materia', (err, results) => {
        if (err) {
            console.error('Error al obtener materias:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
        });
    });
router.post('/materiales', (req, res) => {
        const { titulo, contenido, descripcion, idMateria } = req.body;
        const sql = `
            INSERT INTO MaterialApoyo (titulo, contenido, descripcion, idMateria)
            VALUES (?, ?, ?, ?)
        `;
        db.query(sql, [titulo, contenido, descripcion, idMateria], (err, result) => {
            if (err) {
                console.error('Error al insertar material:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }
            res.json({ success: true, message: 'Material insertado correctamente' });
        });
});
router.get('/materiales', (req, res) => {
    const sql = 'SELECT * FROM MaterialApoyo';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener materiales:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        res.json(results);
        });
    });
router.delete('/materiales/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM MaterialApoyo WHERE idMaterial = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
        console.error('Error al eliminar material:', err);
        return res.status(500).json({ error: 'Error al eliminar' });
        }
        res.json({ success: true });
    });
});
// Obtener todas las materias con sus temas
router.get('/materia', (req, res) => {
    const query = 'SELECT * FROM Materia';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener materias:', err);
            return res.status(500).json({ error: 'Error al obtener materias' });
        }
        res.json(results);
    });
});

// Obtener temas de una materia específica
router.get('/:idMateria/temas', (req, res) => {
    const { idMateria } = req.params;
    const query = 'SELECT * FROM Tema WHERE idMateria = ?';
    db.query(query, [idMateria], (err, results) => {
        if (err) {
        console.error('Error al obtener temas:', err);
        return res.status(500).json({ error: 'Error al obtener temas' });
        }
        res.json(results);
});
});

// Crear una nueva materia
router.post('/materia', (req, res) => {
    const { nombreMateria } = req.body;
    if (!nombreMateria) {
        return res.status(400).json({ error: 'El nombre de la materia es obligatorio' });
    }

    const query = 'INSERT INTO Materia (nombreMateria) VALUES (?)';
    db.query(query, [nombreMateria], (err, result) => {
        if (err) {
        console.error('Error al crear la materia:', err);
        return res.status(500).json({ error: 'Error al crear la materia' });
        }
        res.status(201).json({ idMateria: result.insertId, nombreMateria });
    });
});

// Crear un nuevo tema para una materia existente
router.post('/:idMateria/temas', (req, res) => {
    const { idMateria } = req.params;
    const { nombreTema, descripcion } = req.body;

    if (!nombreTema) {
        return res.status(400).json({ error: 'El nombre del tema es obligatorio' });
    }

    const query = 'INSERT INTO Tema (idMateria, nombreTema, descripcion) VALUES (?, ?, ?)';
    db.query(query, [idMateria, nombreTema, descripcion || null], (err, result) => {
        if (err) {
        console.error('Error al crear el tema:', err);
        return res.status(500).json({ error: 'Error al crear el tema' });
        }
        res.status(201).json({ idTema: result.insertId, nombreTema, descripcion });
});
});
router.delete('/materia/:id', (req, res) => {
    const idMateria = req.params.id;
    
    db.query('DELETE FROM Materia WHERE idMateria = ?', [idMateria], (err, result) => {
        if (err) {
            console.error('Error al eliminar la materia:', err);
            return res.status(500).json({ error: 'Error al eliminar la materia' });
        }
    
        res.json({ message: 'Materia eliminada correctamente' });
        });
    });

module.exports = router;
