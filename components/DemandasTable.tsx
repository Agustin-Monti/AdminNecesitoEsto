"use client";

import { useState } from "react";
import ModalDemanda from "@/components/ModalDemanda";
import { actualizarDemanda, eliminarDemanda } from "@/actions/demanda-actions";

interface Demanda {
  id: number;
  detalle: string;
  fecha_inicio: string;
  estado: string;
}

interface DemandasTableProps {
  demandas: Demanda[];
  setDemandas: React.Dispatch<React.SetStateAction<Demanda[]>>;
}

export default function DemandasTable({ demandas, setDemandas  }: DemandasTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);

  const handleViewDemanda = (demanda: Demanda) => {
    setSelectedDemanda(demanda);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setSelectedDemanda(null);
  };

  

  const handleAceptarDemanda = async (id: number) => {
    console.log("Aceptando demanda con ID:", id);
  
    const updatedDemanda = await actualizarDemanda(id);
  
    if (updatedDemanda) {
      alert("✅ Demanda aceptada correctamente");
      window.location.reload(); // Recarga la página para actualizar la tabla
    } else {
      alert("❌ Hubo un error al aceptar la demanda");
    }
  
    handleCerrarModal();
  };
  
  const handleEliminarDemanda = async (id: number) => {
    console.log("Eliminando demanda con ID:", id);
  
    const eliminado = await eliminarDemanda(id);
  
    if (eliminado) {
      alert("✅ Demanda eliminada correctamente");
      window.location.reload(); // Recarga la página para actualizar la tabla
    } else {
      alert("❌ Hubo un error al eliminar la demanda");
    }
  
    handleCerrarModal();
  };
  
  
  return (
    <div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border-b px-4 py-2 text-left">ID</th>
              <th className="border-b px-4 py-2 text-left">Descripción</th>
              <th className="border-b px-4 py-2 text-left">Fecha de Creación</th>
              <th className="border-b px-4 py-2 text-left">Estado</th>
              <th className="border-b px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {demandas.map((demanda) => (
              <tr
                key={demanda.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="border-b px-4 py-2">{demanda.id}</td>
                <td className="border-b px-4 py-2">{demanda.detalle}</td>
                <td className="border-b px-4 py-2">{demanda.fecha_inicio}</td>
                <td className="border-b px-4 py-2">{demanda.estado}</td>
                <td className="border-b px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDemanda(demanda)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Ver Demanda
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDemanda && (
        <ModalDemanda
            isOpen={isModalOpen}       
            demanda={selectedDemanda}
            onClose={handleCerrarModal}
            onAceptar={handleAceptarDemanda}
            onEliminar={handleEliminarDemanda}
        />
        )}

    </div>
  );
}
