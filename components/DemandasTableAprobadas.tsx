"use client";

import { useState } from "react";
import ModalDemandaAprobadas from "@/components/ModalDemandaAprobadas";

interface Demanda {
  id: number;
  detalle: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  estado: string;
  email_contacto: string;
  responsable_solicitud: string;
  empresa: string;
}

interface Props {
  demandas: Demanda[];
}

export default function DemandasTableAprobadas({ demandas }: Props) {
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);

  const [orden, setOrden] = useState<'asc' | 'desc'>('desc');

    const toggleOrden = () => {
    setOrden(orden === 'asc' ? 'desc' : 'asc');
    };

    const demandasOrdenadas = [...demandas].sort((a, b) =>
    orden === 'asc' ? a.id - b.id : b.id - a.id
    );

  return (
    <div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="border-b px-4 py-2 text-left cursor-pointer hover:bg-green-700" onClick={toggleOrden}>ID {orden === 'asc' ? '↑' : '↓'}</th>
              <th className="border-b px-4 py-2 text-left">Descripción</th>
              <th className="border-b px-4 py-2 text-left">Fecha Vencimiento</th>
              <th className="border-b px-4 py-2 text-left">Estado</th>
              <th className="border-b px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {demandasOrdenadas.map((demanda) => (
              <tr
                key={demanda.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="border-b px-4 py-2">{demanda.id}</td>
                <td className="border-b px-4 py-2 max-w-xs truncate" title={demanda.detalle}>
                    {demanda.detalle}
                </td>
                <td className="border-b px-4 py-2">{demanda.fecha_vencimiento}</td>
                <td className="border-b px-4 py-2">{demanda.estado}</td>
                <td className="border-b px-4 py-2">
                  <button
                    onClick={() => setSelectedDemanda(demanda)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDemanda && (
        <ModalDemandaAprobadas
          isOpen={!!selectedDemanda}
          demanda={selectedDemanda}
          onClose={() => setSelectedDemanda(null)}
        />
      )}
    </div>
  );
}
