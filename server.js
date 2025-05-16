const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Importar rutas
const loginRoutes = require('./routes/login');
const adminRoutes = require('./routes/admin');
// const alumnosRoutes = require('./routes/alumnos');
// const asesoriasRoutes = require('./routes/asesorias');
// const preguntasRoutes = require('./routes/preguntas');

// Usar rutas
app.use('/api', loginRoutes);
app.use('/api/admin', adminRoutes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// app.get('/api/asesorias/activas', (req, res) => {
//     const { matricula } = req.query;

//     if (!matricula) {
//         return res.status(400).json({ error: 'Matrícula no proporcionada' });
//     }

//     const sql = `
//         SELECT 
//             al.nombre AS nombreAlumno,
//             t.nombreTema AS tema,
//             ase.fecha_acordada AS fecha,
//             ase.lugar
//         FROM Asesoria AS ase
//         JOIN Alumno AS al ON ase.matriculaAlumno = al.matricula 
//         JOIN Tema AS t ON ase.idTema = t.idTema
//         WHERE ase.estado = 1 AND ase.matriculaAsesor = ?;
//     `;
//     db.query(sql, [matricula], (err, results) => {
//         if (err) {
//             console.error('Error al obtener asesorías activas:', err);
//             return res.status(500).json({ error: 'Error al consultar la base de datos' });
//         }
//         res.json(results);
//     });
// });
