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
const asesorRoutes = require('./routes/asesor');
// const preguntasRoutes = require('./routes/preguntas');

// Usar rutas
app.use('/api', loginRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/asesor', asesorRoutes);


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});