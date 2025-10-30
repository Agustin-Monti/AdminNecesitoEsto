"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/actions/auth-actions/actions";
import { LogOut, User, Shield } from "lucide-react";

export default function HeaderAdmin() {
  const supabase = createClient();
  const router = useRouter();
  const [userData, setUserData] = useState<{ nombre: string; apellido: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profile")
        .select("nombre, apellido, email, admin")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        router.push("/");
        return;
      }

      if (!profile.admin) {
        router.push("/");
        return;
      }

      setUserData(profile);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await signOutAction();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <p className="text-sm font-medium text-slate-300">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-6 py-4">
      {/* Título y breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
        </div>
        
        {/* Separador sutil */}
        <div className="w-px h-6 bg-slate-700"></div>
        
        {/* Breadcrumb o información contextual */}
        <div className="text-sm text-slate-400">
          Panel de administración
        </div>

        {/* Separador sutil */}
        <div className="w-px h-6 bg-slate-700"></div>

        {/* Breadcrumb o información contextual */}
        <div className="text-sm text-slate-400">
          Necesito Esto!
        </div>
      </div>

      {/* Información del usuario con dropdown */}
      <div className="flex items-center space-x-4 relative">
        {/* Información del usuario - Versión compacta */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium text-white">
            {userData ? `${userData.nombre} ${userData.apellido}` : "Usuario"}
          </span>
          <span className="text-xs text-slate-400">
            {userData?.email}
          </span>
        </div>

        {/* Avatar con dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src="/default.png"
                alt="Perfil"
                className="w-8 h-8 rounded-full border-2 border-slate-600 group-hover:border-slate-500 transition-colors"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            
            {/* Flecha del dropdown */}
            <svg 
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-sm z-50 overflow-hidden">
              {/* Header del dropdown */}
              <div className="p-4 border-b border-slate-700 bg-slate-800/80">
                <div className="flex items-center space-x-3">
                  <img
                    src="/default.png"
                    alt="Perfil"
                    className="w-10 h-10 rounded-full border-2 border-slate-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {userData ? `${userData.nombre} ${userData.apellido}` : "Usuario"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {userData?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items del dropdown */}
              <div className="p-2">               
                <div className="flex items-center space-x-3 p-3 text-sm text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer mt-1"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </div>
              </div>

              {/* Footer del dropdown */}
              <div className="px-4 py-3 border-t border-slate-700 bg-slate-900/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Rol:</span>
                  <span className="text-blue-400 font-medium">Administrador</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para cerrar dropdown al hacer click fuera */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}
