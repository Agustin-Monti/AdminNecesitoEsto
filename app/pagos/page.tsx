"use client";

import { useEffect, useState } from "react";
import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";
import PagosDetalles from "@/components/PagosDetalles";
import { getPagosConsolidados } from "@/actions/pago-actions";

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

export default function PagosPage() {
  const [pagos, setPagos] = useState<PagoConsolidado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPagosConsolidados();
        setPagos(data);
      } catch (error) {
        console.error("Error fetching pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <HeaderAdmin />
        
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Pagos por Demanda</h1>
          <PagosDetalles pagos={pagos} loading={loading} />
        </div>
      </div>
    </div>
  );
}
