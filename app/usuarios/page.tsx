"use client";

import { useEffect, useState } from "react";
import { getUsuarios } from "@/actions/usuarios-actions";
import UsuariosTable from "@/components/UsuariosTable"; // Import como default
import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await getUsuarios();
      setUsuarios(data);
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <HeaderAdmin />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h1>
          <div className="bg-white shadow rounded-lg p-4">
            <UsuariosTable usuarios={usuarios} setUsuarios={setUsuarios} />
          </div>
        </div>
      </div>
    </div>
  );
}
