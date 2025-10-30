"use client";

import { useEffect, useState } from "react";

interface PagoDetalle {
  id: number;
  monto: number;
  fecha_pago: string;
  nombre_pagador: string;
  correo_pagador: string;
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

interface PagosDetallesProps {
  pagos: PagoConsolidado[];
  loading: boolean;
}

export default function PagosDetalles({ pagos, loading }: PagosDetallesProps) {
  const [expandedDemanda, setExpandedDemanda] = useState<number | null>(null);
  const [ordenPagos, setOrdenPagos] = useState<'asc' | 'desc'>('desc');

  const toggleOrdenPagos = () => {
    setOrdenPagos(ordenPagos === 'asc' ? 'desc' : 'asc');
  };

  const pagosOrdenados = [...pagos].sort((a, b) => {
    return ordenPagos === 'asc' 
      ? a.cantidad_pagos - b.cantidad_pagos 
      : b.cantidad_pagos - a.cantidad_pagos;
  });

  const toggleExpand = (demandaId: number) => {
    setExpandedDemanda(expandedDemanda === demandaId ? null : demandaId);
  };

  if (loading) {
    return <p className="text-center py-4">Cargando pagos...</p>;
  }

  if (!loading && pagos.length === 0) {
    return <p className="text-center py-4">No se encontraron pagos registrados</p>;
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-3">ID Demanda</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Creador</th>
            <th 
              className="px-4 py-3 cursor-pointer hover:bg-gray-700"
              onClick={toggleOrdenPagos}
            >
              Pagos {ordenPagos === 'asc' ? '↑' : '↓'}
            </th>
            <th className="px-4 py-3">Total Pagado</th>
            <th className="px-4 py-3">Último Pago</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagosOrdenados.map((pago) => [
            // Usamos un array para renderizar múltiples elementos
            <tr key={`main-${pago.demanda_id}`} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{pago.demanda_id}</td>
              <td className="border px-4 py-2">{pago.titulo_demanda}</td>
              <td className="border px-4 py-2">
                <div>
                  <p>{pago.creador}</p>
                  <p className="text-sm text-gray-600">{pago.email_contacto}</p>
                </div>
              </td>
              <td className="border px-4 py-2 text-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                  {pago.cantidad_pagos}
                </span>
              </td>
              <td className="border px-4 py-2 font-medium">
                ${pago.total_pagado.toFixed(2)}
              </td>
              <td className="border px-4 py-2">
                {new Date(pago.ultimo_pago).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-medium 
                  ${pago.estado_demanda === 'activa' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {pago.estado_demanda}
                </span>
              </td>
              <td className="border px-4 py-2 text-center">
                <button 
                  onClick={() => toggleExpand(pago.demanda_id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  {expandedDemanda === pago.demanda_id ? 'Ocultar' : 'Detalle'}
                </button>
              </td>
            </tr>,
            expandedDemanda === pago.demanda_id && (
              <tr key={`detail-${pago.demanda_id}`} className="bg-gray-50">
                <td colSpan={8} className="px-4 py-2">
                  <div className="ml-8 my-2">
                    <h4 className="font-semibold mb-2">Detalle de Pagos:</h4>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-3 py-1 text-left">ID Pago</th>
                          <th className="px-3 py-1 text-left">Monto</th>
                          <th className="px-3 py-1 text-left">Pagador</th>
                          <th className="px-3 py-1 text-left">Fecha de Pago</th>
                          <th className="px-3 py-1 text-left">Método</th>
                          <th className="px-3 py-1 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pago.pagos_detalle.map((detalle) => (
                          <tr key={detalle.id} className="border-b border-gray-200">
                            <td className="px-3 py-1">{detalle.id}</td>
                            <td className="px-3 py-1">${detalle.monto.toFixed(2)}</td>
                            <td className="px-3 py-1">
                              <div>
                                <p>{detalle.nombre_pagador}</p>
                                <p className="text-sm text-gray-600">{detalle.correo_pagador}</p>
                              </div>
                            </td>
                            <td className="px-3 py-1">
                              {new Date(detalle.fecha_pago).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-1">{detalle.metodo_pago}</td>
                            <td className="px-3 py-1">
                              <span className={`text-xs px-2 py-0.5 rounded 
                                ${detalle.estado_pago === 'completado' ? 'bg-green-100 text-green-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {detalle.estado_pago}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )
          ])}
        </tbody>
      </table>
    </div>
  );
}
