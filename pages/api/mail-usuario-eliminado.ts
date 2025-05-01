import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, nombre } = req.body;

  if (!email || !nombre) {
    return res.status(400).json({ message: 'Faltan datos requeridos (email o nombre)' });
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
      from: `"Moderación del Sistema" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🔒 Tu cuenta ha sido eliminada`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Tu cuenta ha sido eliminada</h2>

          <p>Hola ${nombre},</p>

          <p>Te informamos que tu cuenta ha sido <strong>eliminada permanentemente</strong> debido al incumplimiento reiterado de nuestras normas de uso.</p>

          <p>Esta decisión ha sido tomada tras una revisión exhaustiva de tu actividad en la plataforma.</p>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Motivo:</strong> Incumplimiento de las políticas de la comunidad.</p>
            <p><strong>Acción tomada:</strong> Eliminación permanente del perfil.</p>
          </div>

          <p>Si consideras que esta acción ha sido un error, puedes contactarnos para solicitar una revisión.</p>

          <p style="margin-top: 30px;">Atentamente,<br>
          <strong>Equipo de Moderación</strong></p>
          <br />
          <p style="font-size: 0.9em; color: #888;">Este mensaje es automático, por favor no responder.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo de eliminación enviado con éxito' });

  } catch (error) {
    console.error('Error enviando correo de eliminación:', error);
    res.status(500).json({ message: 'Error al enviar el correo de eliminación' });
  }
}
