const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/asesores', (req, res) => {
    db.query('SELECT matricula, nombre, email AS correo FROM asesor', (err, results) => {
        if (err) {
            console.error('Error al obtener asesores:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        // Puedes agregar campos simulados de horas y calificación si aún no están en la tabla
        const asesoresConExtras = results.map((asesor) => ({
            ...asesor,
            horas: Math.floor(Math.random() * 100), // Ejemplo temporal
            calificacion: Math.floor(Math.random() * 4) + 7 // entre 7 y 10
        }));

        res.json(asesoresConExtras);
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
        ase.fecha_acordada
        FROM Asesoria AS ase
        JOIN Asesor AS a ON ase.matriculaAsesor = a.matricula
        JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula
        JOIN Tema AS t ON ase.idTema = t.idTema
        JOIN Materia AS m ON t.idMateria = m.idMateria
        WHERE ase.estado = 3;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener asesorias:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
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
