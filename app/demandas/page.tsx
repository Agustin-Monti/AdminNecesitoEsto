"use client";

import { useEffect, useState } from "react";
import { getDemandasPendientes, getDemandasAprobadas } from "@/actions/demanda-actions";
import DemandasTable from "@/components/DemandasTable";
import DemandasTableAprobadas from "@/components/DemandasTableAprobadas";
import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";

export default function DemandasPage() {
  const [tab, setTab] = useState<'pendientes' | 'aprobadas'>('pendientes');
  const [demandasPendientes, setDemandasPendientes] = useState<any[]>([]);
  const [demandasAprobadas, setDemandasAprobadas] = useState<any[]>([]);

  useEffect(() => {
    const fetchDemandas = async () => {
      const pendientes = await getDemandasPendientes();
      const aprobadas = await getDemandasAprobadas();
      setDemandasPendientes(pendientes);
      setDemandasAprobadas(aprobadas);
    };
    fetchDemandas();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        <HeaderAdmin />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Demandas</h1>

          {/* Pestañas */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-gray-100 rounded-lg shadow overflow-hidden">
              <button
                onClick={() => setTab("pendientes")}
                className={`px-6 py-3 text-lg font-medium transition-all ${
                  tab === "pendientes"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setTab("aprobadas")}
                className={`px-6 py-3 text-lg font-medium transition-all ${
                  tab === "aprobadas"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Aprobadas
              </button>
            </div>
          </div>


          {/* Tab Content */}
          {tab === 'pendientes' ? (
            <DemandasTable demandas={demandasPendientes} setDemandas={setDemandasPendientes} />
          ) : (
            <DemandasTableAprobadas demandas={demandasAprobadas} />
          )}
        </div>
      </div>
    </div>
  );
}
