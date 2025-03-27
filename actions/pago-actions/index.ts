"use server";

import { createClient } from "@/utils/supabase/server";

interface PagoDetalle {
  id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado_pago: string;
}

interface PagoConsolidado {
  demanda_id: number;
  titulo_demanda: string;
  creador: string;
  email_contacto: string;
  cantidad_pagos: number;
  total_pagado: number;
  ultimo_pago: string;
  estado_demanda: string;
  pagos_detalle: PagoDetalle[];
}

export async function getPagosConsolidados(): Promise<PagoConsolidado[]> {
    const supabase = await createClient();
  
    const { data: demandasConPagos, error } = await supabase
      .from("demandas")
      .select(`
        id,
        detalle,
        responsable_solicitud,
        email_contacto,
        estado,
        pagos: pagos(
          id,
          monto,
          fecha_pago,
          metodo_pago,
          estado_pago
        )
      `)
      .not('pagos.id', 'is', null);
  
    if (error) {
      console.error("Error al obtener demandas con pagos:", error);
      return [];
    }
  
    // Añade esta validación por seguridad
    if (!demandasConPagos) return [];
  
    return demandasConPagos.map(demanda => ({
      demanda_id: demanda.id,
      titulo_demanda: demanda.detalle,
      creador: demanda.responsable_solicitud,
      email_contacto: demanda.email_contacto,
      cantidad_pagos: demanda.pagos?.length || 0,
      total_pagado: demanda.pagos?.reduce((sum, pago) => sum + pago.monto, 0) || 0,
      ultimo_pago: demanda.pagos?.reduce((latest, pago) => 
        new Date(pago.fecha_pago) > new Date(latest) ? pago.fecha_pago : latest, 
        demanda.pagos?.[0]?.fecha_pago || new Date().toISOString()
      ) || new Date().toISOString(),
      estado_demanda: demanda.estado,
      pagos_detalle: (demanda.pagos as PagoDetalle[]) || []
    }));
  }

export async function getPagosByDemandaId(demandaId: number): Promise<PagoDetalle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pagos")
    .select(`
      id,
      monto,
      fecha_pago,
      metodo_pago,
      estado_pago
    `)
    .eq("demanda_id", demandaId)
    .order("fecha_pago", { ascending: false });

  if (error) {
    console.error(`Error al obtener pagos para demanda ${demandaId}:`, error);
    return [];
  }

  return data as PagoDetalle[];
}

export async function getDemandaById(demandaId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("demandas")
    .select("*")
    .eq("id", demandaId)
    .single();

  if (error) {
    console.error(`Error al obtener demanda ${demandaId}:`, error);
    return null;
  }

  return data;
}


 
