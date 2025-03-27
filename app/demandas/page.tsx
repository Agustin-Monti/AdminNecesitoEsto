"use client";

import { useEffect, useState } from "react";
import { getDemandasPendientes } from "@/actions/demanda-actions"; // Importa la función
import DemandasTable from "@/components/DemandasTable"; // Importa el componente de la tabla
import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";


export default function DemandasPage() {
  const [demandas, setDemandas] = useState<any[]>([]); // Estado de demandas

  useEffect(() => {
    // Llamada a la función para obtener las demandas pendientes desde el servidor
    const fetchDemandas = async () => {
      const data = await getDemandasPendientes(); // Obtiene las demandas pendientes
      setDemandas(data); // Actualiza el estado
    };

    fetchDemandas();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      
      {/* Contenido principal que se desplazará */}
      <div className="flex-1 ml-64"> {/* ml-64 para compensar el ancho del sidebar */}
        <HeaderAdmin />
        
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Demandas Pendientes</h1>
          <DemandasTable demandas={demandas} setDemandas={setDemandas} />
        </div>
      </div>
    </div>
  );
}
