"use client";

import { useEffect, useState } from "react";
import { getDemandasPendientes } from "@/actions/demanda-actions"; // Importa la función
import DemandasTable from "@/components/DemandasTable"; // Importa el componente de la tabla
import HeaderAdmin from "@/components/HeaderAdmin";


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

    <div>
      {/* Incluye el HeaderAdmin en la parte superior */}
      <HeaderAdmin />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Demandas Pendientes</h1>
        {/* Pasar demandas y setDemandas al componente DemandasTable */}
        <DemandasTable demandas={demandas} setDemandas={setDemandas} />
      </div>
    </div>
  );
}
