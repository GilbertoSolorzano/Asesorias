// routes/auth.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');

function generarToken(len = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let t = ''; for (let i = 0; i < len; i++) t += chars.charAt(Math.floor(Math.random() * chars.length));
  return t + Date.now();
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ message: 'Correo es requerido' });
  try {
    const [users] = await db.promise().query('SELECT * FROM Alumno WHERE email = ?', [correo]);
    if (!users.length) return res.status(404).json({ message: 'Correo no registrado' });

    const token = generarToken();
    const expiresAt = new Date(Date.now() + 3600000);
    await db.promise().query(
      'INSERT INTO ResetToken (correo, token, expires_at) VALUES (?, ?, ?)',
      [correo, token, expiresAt]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"Soporte ITE" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: 'Restablecer contraseña',
      text: `Para cambiar tu contraseña, haz clic en:\n${resetLink}`
    });

    res.json({ message: 'Enlace enviado. Revisa tu correo.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// POST /api/auth/reset-password (igual que antes)
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
  try {
    const [rows] = await db.promise().query('SELECT * FROM ResetToken WHERE token = ?', [token]);
    if (!rows.length) return res.status(400).json({ message: 'Token inválido' });
    const rec = rows[0];
    if (new Date(rec.expires_at) < new Date()) return res.status(400).json({ message: 'Token expirado' });

    await db.promise().query('UPDATE Alumno SET password = ? WHERE email = ?', [password, rec.correo]);
    await db.promise().query('DELETE FROM ResetToken WHERE id = ?', [rec.id]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
