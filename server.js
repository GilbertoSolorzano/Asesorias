const express = require('express');
const cors = require('cors');
const http = require('http');  
const bodyParser = require('body-parser');
require('dotenv').config();
const io = require('socket.io')(http, { cors: { origin: '*' } });

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Importar rutas
const loginRoutes = require('./routes/login');
const adminRoutes = require('./routes/admin');
const alumnosRoutes = require('./routes/alumno');
const asesorRoutes = require('./routes/asesor');
const authRoutes = require('./routes/auth');
// const preguntasRoutes = require('./routes/preguntas');

// Usar rutas
app.use('/api', loginRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/asesor', asesorRoutes);
app.use('/api/alumno', alumnosRoutes);
app.use('/api/auth', authRoutes);

//chat asesor-alumno
io.on('connection', socket => {
  socket.on('join', room => socket.join(room));
  socket.on('message', async ({ room, remitente, texto }) => {
    // Persistir en la DB
    await db.promise().query(
      'INSERT INTO Mensaje (idAsesoria, matriculaRemitente, mensaje, horaMensaje) VALUES (?, ?, ?, ?)',
      [room, remitente, texto, new Date()]
    );
    // Reenviar a la sala
    io.to(room).emit('message', { remitente, texto, timestamp: Date.now() });
  });
});


// Iniciar servidor
app.listen(port, () => {
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db'); 

// Inicializar Express
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Crear servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Importar rutas
const loginRoutes   = require('./routes/login');
const adminRoutes   = require('./routes/admin');
const alumnosRoutes = require('./routes/alumno');
const asesorRoutes  = require('./routes/asesor');
const authRoutes    = require('./routes/auth');

// Montar rutas
app.use('/api', loginRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/asesor', asesorRoutes);
app.use('/api/alumno', alumnosRoutes);
app.use('/api/auth', authRoutes);

// Socket.IO: Chat entre alumno y asesor
io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join', room => {
    socket.join(room);
    console.log(`Socket ${socket.id} se unió a sala ${room}`);
  });

  socket.on('message', async ({ room, remitente, texto }) => {
    try {
      const hora = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // Persistir en la DB
      await db.promise().query(
        'INSERT INTO Mensaje (idAsesoria, matriculaRemitente, mensaje, horaMensaje) VALUES (?, ?, ?, ?)',
        [room, remitente, texto, hora]
      );
      // Reenviar a la sala
      io.to(room).emit('message', { remitente, texto, timestamp: Date.now() });
    } catch (err) {
      console.error('Error al guardar/retransmitir mensaje:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor HTTP con Socket.IO
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

    console.log(`Servidor corriendo en http://localhost:${port}`);
});