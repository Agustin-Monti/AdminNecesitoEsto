"use client";

import { useState } from "react";

interface Demanda {
  id: number;
  detalle: string;
  fecha_inicio: string;
  estado: string;
}

interface ModalDemandaProps {
  isOpen: boolean;
  demanda: Demanda | null;
  onClose: () => void;
  onAceptar: (id: number) => void;
  onEliminar: (id: number) => void;
  isDeleting?: boolean; // Nueva prop
}

export default function ModalDemanda({
  isOpen,
  demanda,
  onClose,
  onAceptar,
  onEliminar,
  isDeleting = false,
}: ModalDemandaProps) {
  if (!isOpen || !demanda) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-bold">Detalles de la Demanda</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-500 font-medium"><strong className="text-black">ID:</strong> {demanda.id}</p>
          <p className="text-gray-500 font-medium"><strong className="text-black">Descripción:</strong> {demanda.detalle}</p>
          <p className="text-gray-500 font-medium"><strong className="text-black">Fecha de Creación:</strong> {demanda.fecha_inicio}</p>
          <p className="text-gray-500 font-medium"><strong className="text-black">Estado:</strong > {demanda.estado}</p>
        </div>
        <div className="bg-gray-50 px-4 py-3 flex justify-between sm:px-6 rounded-b-xl">
          <div className="space-x-2">
            <button
              onClick={() => onAceptar(demanda.id)}
              disabled={isDeleting}
              className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Aceptar
            </button>
            <button
              onClick={() => onEliminar(demanda.id)}
              disabled={isDeleting}
              className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={isDeleting}
          className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 ${
            isDeleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
