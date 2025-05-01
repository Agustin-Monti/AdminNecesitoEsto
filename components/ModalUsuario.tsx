"use client";

import { useState, useEffect } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { obtenerNombrePais } from "@/actions/usuarios-actions";

interface ModalUsuarioProps {
  isOpen: boolean;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    empresa?: string;
    pais_id?: string;
    telefono?: string;
    admin: boolean;
    demanda_gratis: boolean;
    provincia?: string;
    municipio?: string;
    localidad?: string;
    direccion?: string;
    codigo_postal?: string;
    created_at: string;
  };
  onClose: () => void;
  onActualizar: (id: string, nuevoAdmin: boolean, nuevaDemandaGratis: boolean) => void;
}

export default function ModalUsuario({
    isOpen,
    usuario,
    onClose,
    onActualizar,
  }: ModalUsuarioProps) {
    const [nuevoAdmin, setNuevoAdmin] = useState(usuario.admin);
    const [nuevaDemandaGratis, setNuevaDemandaGratis] = useState(usuario.demanda_gratis);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDatosAdicionales, setShowDatosAdicionales] = useState(false);
    const [nombrePais, setNombrePais] = useState<string>("Cargando...");
  
    if (!isOpen) return null;
  
    useEffect(() => {
      if (isOpen && nombrePais === "Cargando...") {
        obtenerNombrePais(usuario.pais_id || "").then(setNombrePais);
      }
    }, [isOpen, nombrePais, usuario.pais_id]);
    
  
    const handleGuardar = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await onActualizar(usuario.id, nuevoAdmin, nuevaDemandaGratis);
      } catch (err) {
        setError("Error al guardar los cambios");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-4xl min-h-[70vh] max-h-[90vh] overflow-y-auto">
        {/* Aumenté el ancho máximo */}
          <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
  
          {/* Sección principal con grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda - Información Básica */}
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"> {/* Email ocupa 2 columnas */}
                <p className="font-semibold mb-1">Email:</p>
                <p className="p-3 bg-gray-50 rounded border min-h-[3rem] break-words">
                  {usuario.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-1">Nombre:</p>
                <p className="p-3 bg-gray-50 rounded border min-h-[3rem]">
                  {usuario.nombre}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Apellido:</p>
                <p className="p-3 bg-gray-50 rounded border min-h-[3rem]">
                  {usuario.apellido}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-1">Empresa:</p>
                <p className="p-3 bg-gray-50 rounded border min-h-[3rem]">
                  {usuario.empresa || "No especificado"}
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Teléfono:</p>
                <p className="p-3 bg-gray-50 rounded border min-h-[3rem]">
                  {usuario.telefono || "No especificado"}
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-1">País:</p>
              <p className="p-3 bg-gray-50 rounded border min-h-[3rem]">
                {nombrePais}
              </p>
            </div>
            </div>
  
            {/* Columna Derecha - Configuraciones Editables */}
            <div className="space-y-6">
              <div>
                <label className="font-semibold block mb-2">Rol:</label>
                <select
                  value={nuevoAdmin ? "admin" : "user"}
                  onChange={(e) => setNuevoAdmin(e.target.value === "admin")}
                  className="border rounded-lg p-3 w-full"
                  disabled={isLoading}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <div>
                <label className="font-semibold block mb-2">Demanda Gratis:</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setNuevaDemandaGratis(true)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                      nuevaDemandaGratis 
                        ? "bg-green-50 border-green-500 text-green-800" 
                        : "bg-gray-50 border-gray-300 text-gray-800"
                    }`}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => setNuevaDemandaGratis(false)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                      !nuevaDemandaGratis 
                        ? "bg-red-50 border-red-500 text-red-800" 
                        : "bg-gray-50 border-gray-300 text-gray-800"
                    }`}
                  >
                    <X className="h-5 w-5 mr-2" />
                    No
                  </button>
                </div>
              </div>
  
              {/* Sección de datos adicionales con acordeón */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowDatosAdicionales(!showDatosAdicionales)}
                  className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold">Datos Adicionales</span>
                  {showDatosAdicionales ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                
                {showDatosAdicionales && (
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold mb-1">Provincia:</p>
                      <p className="p-2 bg-gray-50 rounded border">
                        {usuario.provincia || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Municipio:</p>
                      <p className="p-2 bg-gray-50 rounded border">
                        {usuario.municipio || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Localidad:</p>
                      <p className="p-2 bg-gray-50 rounded border">
                        {usuario.localidad || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Código Postal:</p>
                      <p className="p-2 bg-gray-50 rounded border">
                        {usuario.codigo_postal || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Fecha de Registro:</p>
                      <p className="p-3 bg-gray-50 rounded border min-h-[3rem]">
                        {new Date(usuario.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
  
          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleGuardar}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    );
  }
