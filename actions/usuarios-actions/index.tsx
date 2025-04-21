"use server";


import { createClient } from "@/utils/supabase/server";


export const getUsuarios = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/admin/usuarios`);
    const data = await res.json();
    console.log('Usuarios obtenidos:', data); 
    return data;
  } catch (err) {
    console.error('Error en getUsuarios:', err);
    return [];
  }
};



  
export async function actualizarUsuario(
    id: string, 
    updates: { 
      admin?: boolean;
      demanda_gratis?: boolean;
    }
  ) {
    const supabase = await createClient();
    
    // Preparar los datos para Supabase - USANDO EL NOMBRE CORRECTO DE COLUMNA (admin)
    const updatesToSend: any = {};
    
    if (updates.admin !== undefined) {
      updatesToSend.admin = updates.admin; // Usamos 'admin' directamente
    }
    
    if (updates.demanda_gratis !== undefined) {
      updatesToSend.demanda_gratis = updates.demanda_gratis;
    }
    
    console.log("Enviando a Supabase:", updatesToSend);
  
    const { data, error } = await supabase
      .from("profile")
      .update(updatesToSend)
      .eq("id", id)
      .select()
      .single();
  
    if (error) {
      console.error("Error de Supabase:", error);
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  
    return data;
}
  
export async function eliminarUsuario(id: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("profile")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  
    return true;
}
  
export async function obtenerNombrePais(paisId: string) {
    if (!paisId) return "No especificado";
  
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase
        .from("pais")
        .select("nombre")
        .eq("id", paisId)
        .single();
  
      if (error) throw error;
      return data?.nombre || "No encontrado";
    } catch (error) {
      console.error("Error al obtener país:", error);
      return "Error al cargar";
    }
}
