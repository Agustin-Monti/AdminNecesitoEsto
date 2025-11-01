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

// Función para enviar correos (se puede llamar de forma asíncrona)
async function enviarCorreosLote(usuarios: any[], asunto: string, mensaje: string) {
  let enviados = 0;
  const errores: Array<{email: string, error: string}> = [];

  for (let i = 0; i < usuarios.length; i += 20) { // Lotes más pequeños
    const lote = usuarios.slice(i, i + 20);
    
    const promesas = lote.map(async (usuario) => {
      try {
        await transporter.sendMail({
          from: `"Sistema Admin" <${process.env.GMAIL_USER}>`,
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
              </div>
            </div>
          `,
          text: mensaje,
        });
        return { success: true, email: usuario.email };
      } catch (error) {
        return { 
          success: false, 
          email: usuario.email, 
          error: error instanceof Error ? error.message : 'Error desconocido' 
        };
      }
    });

    // Esperar a que termine el lote actual
    const resultados = await Promise.all(promesas);
    
    resultados.forEach(resultado => {
      if (resultado.success) {
        enviados++;
      } else {
        errores.push({ email: resultado.email, error: resultado.error! });
      }
    });

    // Pausa entre lotes
    if (i + 20 < usuarios.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return { enviados, errores };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Verificar credenciales
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ 
      error: 'Configuración de email incompleta' 
    });
  }

  try {
    const { asunto, mensaje, usuariosIds }: EmailRequest = req.body;

    if (!asunto || !mensaje || !usuariosIds || usuariosIds.length === 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Obtener usuarios (limitar a 50 para pruebas)
    const usuariosLimitados = usuariosIds.slice(0, 50);
    
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

    console.log(`📧 Enviando a ${usuarios.length} usuarios`);

    // Enviar correos (con timeout controlado)
    const resultado = await Promise.race([
      enviarCorreosLote(usuarios, asunto, mensaje),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000) // 8 segundos timeout
      )
    ]) as { enviados: number, errores: Array<{email: string, error: string}> };

    return res.status(200).json({
      enviados: resultado.enviados,
      total: usuarios.length,
      errores: resultado.errores.length,
      detallesErrores: resultado.errores,
      mensaje: resultado.errores.length > 0 ? 
        `Enviados: ${resultado.enviados}, Errores: ${resultado.errores.length}` :
        'Todos los correos enviados exitosamente'
    });

  } catch (error) {
    console.error('Error en API:', error);
    
    if (error instanceof Error && error.message === 'Timeout') {
      return res.status(408).json({ 
        error: 'El envío está tomando demasiado tiempo. Intenta con menos usuarios.' 
      });
    }

    return res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
