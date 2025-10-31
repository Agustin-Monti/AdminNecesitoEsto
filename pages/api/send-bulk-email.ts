// pages/api/admin/send-bulk-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import supabaseAdmin from '@/lib/supabaseAdmin';

// Configuración del transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

interface EmailRequest {
  asunto: string;
  mensaje: string;
  usuariosIds: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { asunto, mensaje, usuariosIds }: EmailRequest = req.body;

    // Validar campos requeridos
    if (!asunto || !mensaje || !usuariosIds || usuariosIds.length === 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Obtener los usuarios seleccionados
    const { data: usuarios, error } = await supabaseAdmin
      .from('profile')
      .select('email, id')
      .in('id', usuariosIds);

    if (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }

    if (!usuarios || usuarios.length === 0) {
      return res.status(400).json({ error: 'No se encontraron usuarios' });
    }

    let enviados = 0;
    const errores: Array<{email: string, error: string}> = [];

    // Enviar correos en lotes de 50
    for (let i = 0; i < usuarios.length; i += 50) {
      const lote = usuarios.slice(i, i + 50);
      
      for (const usuario of lote) {
        try {
          await transporter.sendMail({
            from: `"Sistema" <${process.env.GMAIL_USER}>`,
            to: usuario.email,
            subject: asunto,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">Notificación del Sistema</h1>
                </div>
                <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                  ${mensaje.replace(/\n/g, '<br>')}
                </div>
                <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0;">
                  <p>Este es un correo automático. Por favor no respondas a este mensaje.</p>
                  <p>Si tienes alguna pregunta, contacta al administrador del sistema.</p>
                </div>
              </div>
            `,
            text: mensaje, // Versión en texto plano
          });
          enviados++;
          
          // Pequeña pausa entre correos
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error enviando a ${usuario.email}:`, error);
          errores.push({ 
            email: usuario.email, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
          });
        }
      }

      // Pausa más larga entre lotes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return res.status(200).json({
      enviados,
      total: usuarios.length,
      errores: errores.length,
      detallesErrores: errores
    });

  } catch (error) {
    console.error('Error general enviando correos:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}