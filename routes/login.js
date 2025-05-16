const express = require('express');
const router = express.Router();
const db = require('../db');
router.post('/login', (req, res) => {
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
module.exports = router;
