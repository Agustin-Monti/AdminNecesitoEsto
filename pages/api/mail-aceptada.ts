import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface MailData {
  email_contacto: string;
  responsable_solicitud: string;
  demanda_id: number;
  demanda_detalle: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email_contacto, responsable_solicitud, demanda_id, demanda_detalle }: MailData = req.body;

  if (!email_contacto || !responsable_solicitud || !demanda_id || !demanda_detalle) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  // Validar formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email_contacto)) {
    return res.status(400).json({ message: 'Correo electrónico inválido' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email_contacto,
      subject: `✅ Tu demanda ha sido aceptada - Detalle: ${demanda_detalle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Buena noticia, ${responsable_solicitud}!</h2>
          <p>Tu demanda ha sido revisada y aceptada por nuestro equipo.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>ID de Demanda:</strong> ${demanda_id}</p>
            <p><strong>Detalle:</strong> ${demanda_detalle}</p>
          </div>
          
          <p>Ahora está disponible en nuestro portal de demandas para que los proveedores interesados puedan contactarte.</p>
          
          <p style="margin-top: 30px;">Atentamente,</p>
          <p><strong>Equipo de Administración</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo de aceptación enviado con éxito' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ message: 'Error enviando el correo de aceptación' });
  }
}