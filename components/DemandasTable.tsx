"use client";

import { useState } from "react";
import ModalDemanda from "@/components/ModalDemanda";
import { actualizarDemanda, eliminarDemanda } from "@/actions/demanda-actions";
import LoadingModal from "@/components/LoadingModal";

interface Demanda {
  id: number;
  detalle: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  estado: string;
  email_contacto: string;
  responsable_solicitud: string;
  empresa:string;
}

interface DemandasTableProps {
  demandas: Demanda[];
  setDemandas: React.Dispatch<React.SetStateAction<Demanda[]>>;
}

export default function DemandasTable({ demandas, setDemandas  }: DemandasTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null);
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  // Función para cambiar el orden
  const toggleOrden = () => {
    setOrden(orden === 'asc' ? 'desc' : 'asc');
  };

  // Ordenar las demandas
  const demandasOrdenadas = [...demandas].sort((a, b) => {
    return orden === 'asc' ? a.id - b.id : b.id - a.id;
  });

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
    
    try {
      // 1. Primero actualizamos el estado de la demanda
      const updatedDemanda = await actualizarDemanda(id);
      
      if (!updatedDemanda) {
        throw new Error("Error al actualizar la demanda");
      }
      
      // 2. Buscamos los datos de la demanda para el correo
      const demanda = demandas.find(d => d.id === id);
      if (!demanda) {
        throw new Error("No se encontró la demanda");
      }
      
      // 3. Enviamos el correo de aceptación
      const mailResponse = await fetch('/api/mail-aceptada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_contacto: demanda.email_contacto,
          responsable_solicitud: demanda.responsable_solicitud,
          demanda_id: demanda.id,
          demanda_detalle: demanda.detalle,
        }),
      });
      
      const mailResult = await mailResponse.json();
      
      if (!mailResponse.ok) {
        console.error("Error en el envío de correo:", mailResult.message);
        alert("✅ Demanda aceptada, pero hubo un error al enviar el correo de notificación");
      } else {
        alert("✅ Demanda aceptada y notificación enviada correctamente");
      }
      
      // 4. Actualizamos el estado local o recargamos
      setDemandas(demandas.filter(d => d.id !== id)); // Eliminamos la demanda aceptada de la lista
      // O si prefieres recargar:
      // window.location.reload();
      
    } catch (error) {
      console.error("Error en el proceso de aceptación:", error);
      alert("❌ Hubo un error al aceptar la demanda");
    }
    
    handleCerrarModal();
  };
  
  const handleEliminarDemanda = async (id: number) => {
    console.log("Eliminando demanda con ID:", id);

    setIsDeleting(true);
    setDeleteMessage("Eliminando demanda...");
    
    try {
      // 1. Primero eliminamos la demanda
      const eliminado = await eliminarDemanda(id);
      
      if (!eliminado) {
        throw new Error("Error al eliminar la demanda");
      }
      
      // 2. Buscamos los datos de la demanda para el correo
      setDeleteMessage("Enviando notificación...");
      const demanda = demandas.find(d => d.id === id);
      if (!demanda) {
        throw new Error("No se encontró la demanda");
      }
      
      // 3. Enviamos el correo de rechazo/eliminación
      const mailResponse = await fetch('/api/mail-rechazada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_contacto: demanda.email_contacto,
          responsable_solicitud: demanda.responsable_solicitud,
          demanda_id: demanda.id,
          demanda_detalle: demanda.detalle,
          motivo_rechazo: "La demanda no cumple con nuestros términos y condiciones para ser publicada."
        }),
      });
      
      if (!mailResponse.ok) {
        const mailResult = await mailResponse.json();
        throw new Error(mailResult.message || "Error al enviar correo");
      }
      
      // 4. Actualizar estado
      setDemandas(demandas.filter(d => d.id !== id));

      // Feedback final
      setDeleteMessage("¡Demanda eliminada con éxito!");
      await new Promise(resolve => setTimeout(resolve, 1000)); // Muestra el mensaje de éxito brevemente
      
    } catch (error) {
      setDeleteMessage("❌ Error: " + (error instanceof Error ? error.message : "Error desconocido"));
      await new Promise(resolve => setTimeout(resolve, 3000)); // Muestra el error por más tiempo
    } finally {
      setIsDeleting(false);
      handleCerrarModal();
    }
  };
  
  
  return (
    <div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                onClick={toggleOrden}
              >
                ID {orden === 'asc' ? '↑' : '↓'}
              </th>
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
                <td className="border-b px-4 py-2">{demanda.detalle}</td>
                <td className="border-b px-4 py-2">{demanda.fecha_vencimiento}</td>
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

      <LoadingModal 
        isOpen={isDeleting} 
        message={deleteMessage} 
      />

    </div>
  );
}
