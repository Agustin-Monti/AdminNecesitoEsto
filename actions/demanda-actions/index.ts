"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDemandasPendientes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("demandas")
    .select("*")
    .eq("estado", "pendiente");

  if (error) {
    console.error("Error al obtener demandas pendientes:", error);
    return [];
  }

  return data || [];
}

export async function getDemandasAprobadas() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("demandas")
    .select("*")
    .eq("estado", "aprobada");

  if (error) {
    console.error("Error al obtener demandas pendientes:", error);
    return [];
  }

  return data || [];
}

export async function actualizarDemanda(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("demandas")
    .update({ estado: "aprobada" })
    .eq("id", id)
    .select("*"); // Esto devuelve la demanda actualizada

  if (error) {
    console.error("Error al actualizar demanda:", error);
    return null;
  }

  console.log("Demanda actualizada correctamente:", data);
  return data.length > 0 ? data[0] : null; // Retorna la primera demanda actualizada
}



// Función para eliminar una demanda
export async function eliminarDemanda(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("demandas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar demanda:", error);
    return false;
  }

  console.log("Demanda eliminada correctamente.");
  return true;
}

