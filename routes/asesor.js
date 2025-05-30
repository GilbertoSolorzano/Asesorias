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

    if (!matricula) {
        return res.status(400).json({ error: 'Matrícula no proporcionada' });
    }

    const sql = `
        SELECT
            ase.idAsesoria AS id,
            t.nombreTema AS tema,
            al.nombre AS nombreAlumno,
            t.descripcion as notas,
            ase.estado AS status

        FROM Asesoria AS ase
        JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula 
        JOIN Tema AS t ON ase.idTema = t.idTema
        WHERE ase.estado = 0 AND ase.matriculaAsesor = ?;
    `;

    db.query(sql, [matricula], (err, results) => {
        if (err) {
            console.error('Error al obtener solicitud de asesoría:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

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
    const { idAsesoria } = req.body;

    if (!idAsesoria) {
        return res.status(400).json({ error: 'ID de asesoría no proporcionado' });
    }

    const sql = `UPDATE Asesoria SET estado = 3 WHERE idAsesoria = ?`;

    db.query(sql, [idAsesoria], (err, results) => {
        if (err) {
            console.error('Error al aceptar la asesoría:', err);
            return res.status(500).json({ error: 'Error al actualizar la base de datos' });
        }

        res.json({ message: 'Asesoría aceptada correctamente', results });
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

module.exports = router;
