const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MariaDB
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'luchas1.',
    database: 'sistemaasesoria' 
});


// Ruta para el login
app.post('/api/login', (req, res) => {
    const { matricula, password } = req.body;

    const queries = [
        { table: 'administrador', type: 'administrador' },
        { table: 'asesor', type: 'asesor' },
        { table: 'alumno', type: 'alumno' }
    ];

    const tryLogin = (index) => {
        if (index >= queries.length) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const { table, type } = queries[index];
        db.query(
            `SELECT * FROM ${table} WHERE matricula = ? AND password = ?`,
            [matricula, password],
            (err, results) => {
                if (err) return res.status(500).json({ error: 'Error en el servidor' });

                if (results.length > 0) {
                    return res.json({ tipoUsuario: type, data: results[0] });
                } else {
                    tryLogin(index + 1);
                }
            }
        );
    };

    tryLogin(0);
});
app.get('/api/asesores', (req, res) => {
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
app.get('/api/alumnos', (req, res) => {
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
app.get('/api/asesorias/finalizadas', (req, res) => {
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
app.get('/api/asesorias/activas', (req, res) => {
    const { matricula } = req.query;

    if (!matricula) {
        return res.status(400).json({ error: 'Matrícula no proporcionada' });
    }

    const sql = `
        SELECT 
            al.nombre AS nombreAlumno,
            t.nombreTema AS tema,
            ase.fecha_acordada AS fecha,
            ase.lugar
        FROM Asesoria AS ase
        JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula 
        JOIN Tema AS t ON ase.idTema = t.idTema
        WHERE ase.estado = 1 AND ase.matriculaAsesor = ?;
    `;
    db.query(sql, [matricula], (err, results) => {
        if (err) {
            console.error('Error al obtener asesorías activas:', err);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
});
// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
