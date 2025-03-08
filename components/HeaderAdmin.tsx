"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/actions/auth-actions/actions";

export default function HeaderAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const [userData, setUserData] = useState<{ nombre: string; apellido: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/"); // Redirigir al login si no hay sesión
        return;
      }

      // Obtener los datos del perfil del usuario
      const { data: profile, error } = await supabase
        .from("profile")
        .select("nombre, apellido, email, admin")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        router.push("/"); // Redirigir si hay error o no se encuentra el perfil
        return;
      }

      // Verificar si el usuario es administrador
      if (!profile.admin) {
        router.push("/"); // Redirigir si no es administrador
        return;
      }

      // Actualizar el estado con los datos del usuario
      setUserData(profile);
      setLoading(false); // Deja de cargar cuando se obtienen los datos
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await signOutAction();  // Llamamos a la función de cerrar sesión
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between bg-gray-200 p-4 shadow-md">
      {/* Título */}
      <h1 className="text-lg font-bold text-gray-700">Admin Dashboard</h1>

      {/* Información del usuario */}
      <div className="flex items-center space-x-4">
        <img
          src="/default.png"
          alt="Perfil"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <span className="text-gray-600">
          {userData ? `${userData.nombre} ${userData.apellido} (${userData.email})` : "Cargando..."}
        </span>
        {/* Botón de cerrar sesión */}
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
