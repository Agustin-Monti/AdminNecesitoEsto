// pages/api/admin/send-bulk-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import supabaseAdmin from '@/lib/supabaseAdmin';

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

// Función optimizada para envío rápido
async function enviarCorreosRapido(usuarios: any[], asunto: string, mensaje: string) {
  const lote = usuarios.slice(0, 10); // Solo 10 usuarios máximo
  
  const promesas = lote.map(async (usuario) => {
    try {
      const mailOptions = {
        from: `"Sistema Admin" <${process.env.GMAIL_USER}>`,
        to: usuario.email,
        subject: asunto,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">Notificación del Sistema</h1>
            </div>
            <div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              ${mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
        `,
        text: mensaje,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, email: usuario.email };
    } catch (error) {
      return { 
        success: false, 
        email: usuario.email, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  });

  // Ejecutar todos en paralelo con timeout
  const resultados = await Promise.allSettled(promesas);
  
  let enviados = 0;
  const errores: Array<{email: string, error: string}> = [];

  resultados.forEach((resultado) => {
    if (resultado.status === 'fulfilled') {
      if (resultado.value.success) {
        enviados++;
      } else {
        errores.push({ email: resultado.value.email, error: resultado.value.error! });
      }
    } else {
      errores.push({ email: 'unknown', error: 'Promise rejected' });
    }
  });

  return { enviados, errores };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Verificar credenciales
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    return res.status(500).json({ 
      error: 'Configuración de email incompleta' 
    });
  }

  try {
    const { asunto, mensaje, usuariosIds }: EmailRequest = req.body;

    if (!asunto || !mensaje || !usuariosIds || usuariosIds.length === 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Obtener solo los primeros 10 usuarios para respuesta inmediata
    const usuariosLimitados = usuariosIds.slice(0, 10);
    
    const { data: usuarios, error: usersError } = await supabaseAdmin
      .from('profile')
      .select('email, id')
      .in('id', usuariosLimitados);

    if (usersError) {
      console.error('Error al obtener usuarios:', usersError);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }

    if (!usuarios || usuarios.length === 0) {
      return res.status(400).json({ error: 'No se encontraron usuarios' });
    }

    console.log(`📧 Enviando a ${usuarios.length} usuarios inmediatamente`);

    // Enviar de forma ultra rápida
    const resultado = await enviarCorreosRapido(usuarios, asunto, mensaje);

    // Si hay más usuarios, sugerir envío por lotes
    const usuariosRestantes = usuariosIds.length - usuarios.length;
    const mensajeAdicional = usuariosRestantes > 0 
      ? ` ${usuariosRestantes} usuarios restantes. Envía por lotes más pequeños.`
      : '';

    return res.status(200).json({
      enviados: resultado.enviados,
      totalEnviados: resultado.enviados,
      totalUsuarios: usuariosIds.length,
      errores: resultado.errores.length,
      mensaje: `Enviados: ${resultado.enviados}, Errores: ${resultado.errores.length}.${mensajeAdicional}`,
      detallesErrores: resultado.errores,
      sugerencia: usuariosRestantes > 0 ? 
        `Divide en lotes de 10 usuarios. Quedan ${usuariosRestantes} usuarios por enviar.` : ''
    });

  } catch (error) {
    console.error('Error en API:', error);
    
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
