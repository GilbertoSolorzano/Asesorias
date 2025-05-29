// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const alumnosRoutes = require("./routes/alumno");



const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api',       require('./routes/login'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/asesor',require('./routes/asesor'));
app.use('/api/alumno',require('./routes/alumno'));
app.use('/api/auth',  require('./routes/auth'));


// Creamos el servidor HTTP y lo conectamos a Express
const server = http.createServer(app);

// Inicializamos Socket.IO sobre ese mismo servidor
const io = new Server(server, { cors: { origin: '*' } });

// Lógica de chat
io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join', room => {
    socket.join(room);
  });

  socket.on('message', async ({ room, remitente, texto }) => {
    const hora = new Date().toISOString().slice(0,19).replace('T',' ');
    await db.promise().query(
      'INSERT INTO Mensaje (idAsesoria, matriculaRemitente, mensaje, horaMensaje) VALUES (?, ?, ?, ?)',
      [room, remitente, texto, hora]
    );
    io.to(room).emit('message', { remitente, texto, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// **ÚNICAMENTE** arrancamos el servidor HTTP (Express + Socket.IO)
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
