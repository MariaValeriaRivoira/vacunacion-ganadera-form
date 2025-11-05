/**
 * Backend: Node.js + Express + Multer + Nodemailer
 * Env vars (configurar en .env):
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL, FROM_EMAIL
 */
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Static frontend
app.use(express.static(__dirname));

// API endpoint
app.post('/api/enviar', upload.single('documento'), async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;
    if (!nombre || !telefono || !req.file){
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    const to = process.env.TO_EMAIL || 'mariavaleriarivoira@gmail.com';
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: !!(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const subject = `Acta de vacunacion de ${nombre}`;
    const text = `Nombre: ${nombre}\nTeléfono: ${telefono}\nCorreo: ${correo || '-'}\n`;

    const info = await transporter.sendMail({
      to,
      from,
      subject,
      text,
      html: `<p><strong>Nombre:</strong> ${nombre}</p>
             <p><strong>Teléfono:</strong> ${telefono}</p>
             <p><strong>Correo:</strong> ${correo || '-'}</p>`,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer
        }
      ],
      ...(correo ? { replyTo: correo } : {})
    });

    res.json({ ok: true, message: 'Enviado', id: info.messageId });
  } catch (err){
    console.error(err);
    res.status(500).json({ message: 'Error al enviar el correo.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
