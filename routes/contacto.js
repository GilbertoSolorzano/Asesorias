const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { nombre, correo, capacitacion, contrasena } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,   
      pass: process.env.EMAIL_PASS     
    }

  });

  const mailOptions = {
    from: correo,
    to: 'asesorias2025ite@gmail.com',
    subject: 'Nueva solicitud de cuenta',
    html: `
      <h3>Datos del nuevo usuario</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Capacitación:</strong> ${capacitacion.join(', ')}</p>
      <p><strong>Contraseña:</strong> ${contrasena}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado al administrador' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

module.exports = router;
