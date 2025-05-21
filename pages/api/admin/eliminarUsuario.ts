// pages/api/admin/eliminarUsuario.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import supabaseAdmin from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'Falta el ID del usuario' })
  }

  try {
    // 0. Obtener demandas asociadas al perfil
    const { data: demandas, error: demandasError } = await supabaseAdmin
      .from('demandas')
      .select('id')
      .eq('profile_id', userId)

    if (demandasError) {
      return res.status(500).json({ error: 'Error al obtener demandas', detail: demandasError.message })
    }

    // 1. Eliminar pagos asociados a cada demanda
    for (const demanda of demandas) {
      const { error: deletePagosError } = await supabaseAdmin
        .from('pagos')
        .delete()
        .eq('demanda_id', demanda.id)

      if (deletePagosError) {
        return res.status(500).json({ error: 'Error al eliminar pagos asociados', detail: deletePagosError.message })
      }
    }

    // 2. Eliminar demandas asociadas al perfil
    const { error: deleteDemandasError } = await supabaseAdmin
      .from('demandas')
      .delete()
      .eq('profile_id', userId)

    if (deleteDemandasError) {
      return res.status(500).json({ error: 'Error al eliminar las demandas asociadas', detail: deleteDemandasError.message })
    }

    // 3. Eliminar perfil
    const { error: deleteProfileError } = await supabaseAdmin
      .from('profile')
      .delete()
      .eq('id', userId)

    if (deleteProfileError) {
      return res.status(500).json({ error: 'Error al eliminar del perfil', detail: deleteProfileError.message })
    }

    // 4. Eliminar usuario del sistema de auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      return res.status(500).json({ error: 'Error al eliminar de auth', detail: deleteUserError.message })
    }

    return res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}
