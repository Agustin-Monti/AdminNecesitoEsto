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
}

export default function ModalDemanda({
  isOpen,
  demanda,
  onClose,
  onAceptar,
  onEliminar,
}: ModalDemandaProps) {
  if (!isOpen || !demanda) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Detalles de la Demanda</h2>
        <div className="mb-4">
          <p><strong>ID:</strong> {demanda.id}</p>
          <p><strong>Descripción:</strong> {demanda.detalle}</p>
          <p><strong>Fecha de Creación:</strong> {demanda.fecha_inicio}</p>
          <p><strong>Estado:</strong> {demanda.estado}</p>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onAceptar(demanda.id)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Aceptar
          </button>
          <button
            onClick={() => onEliminar(demanda.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
