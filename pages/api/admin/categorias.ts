// pages/api/admin/categorias.ts
import { NextApiRequest, NextApiResponse } from 'next';
import supabaseAdmin from '@/lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseAdmin.from('categorias').select('id, categoria');

  if (error) return res.status(500).json({ message: 'Error al obtener categorías', error });
  return res.status(200).json(data);
}
