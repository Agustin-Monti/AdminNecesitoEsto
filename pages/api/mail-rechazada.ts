import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface RechazoData {
  email_contacto: string;
  responsable_solicitud: string;
  demanda_id: number;
  demanda_detalle: string;
  motivo_rechazo: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { 
    email_contacto, 
    responsable_solicitud, 
    demanda_id, 
    demanda_detalle,
    motivo_rechazo 
  } = req.body;

  // Validación de campos
  if (!email_contacto || !responsable_solicitud || !demanda_id || !demanda_detalle || !motivo_rechazo) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
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
      from: `"Portal de Demandas" <${process.env.GMAIL_USER}>`,
      to: email_contacto,
      subject: `❌ Demanda rechazada - #${demanda_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Notificación de demanda rechazada</h2>
          
          <p>Hola ${responsable_solicitud},</p>
          
          <p>Lamentamos informarte que tu demanda ha sido rechazada por no cumplir con nuestros requisitos de publicación.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>ID de Demanda:</strong> #${demanda_id}</p>
            <p><strong>Descripción:</strong> ${demanda_detalle}</p>
            <p><strong>Motivo de rechazo:</strong> ${motivo_rechazo}</p>
          </div>
          
          <p>Puedes revisar nuestros términos y condiciones y volver a enviar la demanda si lo consideras apropiado.</p>
          
          <p style="margin-top: 30px;">Atentamente,<br>
          <strong>Equipo de Moderación</strong></p>
          <br />
          <p><strong>No reenviar este email.</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo de rechazo enviado con éxito' });
    
  } catch (error) {
    console.error('Error enviando correo de rechazo:', error);
    res.status(500).json({ message: 'Error al enviar el correo de rechazo' });
  }
}