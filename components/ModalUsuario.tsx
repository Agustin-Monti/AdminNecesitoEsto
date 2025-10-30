"use client";

import { useState, useEffect } from "react";
import { Check, X, ChevronDown, ChevronUp, User, Mail, Building, Phone, MapPin, Calendar } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Editar Usuario</h2>
                <p className="text-slate-300 text-sm">{usuario.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda - Información Básica */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-1">
                <div className="flex items-center space-x-3 p-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 mb-1">Email</p>
                    <p className="text-slate-900 break-words">{usuario.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-1">
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Nombre</p>
                    <p className="text-slate-900">{usuario.nombre}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-1">
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Apellido</p>
                    <p className="text-slate-900">{usuario.apellido}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-1">
                  <div className="flex items-center space-x-3 p-3">
                    <Building className="h-4 w-4 text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 mb-1">Empresa</p>
                      <p className="text-slate-900">{usuario.empresa || "No especificado"}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-1">
                  <div className="flex items-center space-x-3 p-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 mb-1">Teléfono</p>
                      <p className="text-slate-900">{usuario.telefono || "No especificado"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-1">
                <div className="flex items-center space-x-3 p-3">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 mb-1">País</p>
                    <p className="text-slate-900">{nombrePais}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Configuraciones */}
            <div className="space-y-6">
              {/* Rol */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-800 mb-3">Rol de Usuario</label>
                <select
                  value={nuevoAdmin ? "admin" : "user"}
                  onChange={(e) => setNuevoAdmin(e.target.value === "admin")}
                  disabled={isLoading}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="user">Usuario Regular</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* Demanda Gratis */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <label className="block text-sm font-semibold text-slate-800 mb-3">Demanda Gratuita</label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setNuevaDemandaGratis(true)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      nuevaDemandaGratis 
                        ? "bg-green-50 border-green-500 text-green-700 shadow-sm" 
                        : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Habilitada
                  </button>
                  <button
                    type="button"
                    onClick={() => setNuevaDemandaGratis(false)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      !nuevaDemandaGratis 
                        ? "bg-red-50 border-red-500 text-red-700 shadow-sm" 
                        : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Deshabilitada
                  </button>
                </div>
              </div>

              {/* Datos Adicionales */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowDatosAdicionales(!showDatosAdicionales)}
                  className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800">Datos Adicionales</span>
                  {showDatosAdicionales ? (
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  )}
                </button>
                
                {showDatosAdicionales && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Provincia</p>
                        <p className="text-sm text-slate-800 p-2 bg-slate-50 rounded-lg">
                          {usuario.provincia || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Municipio</p>
                        <p className="text-sm text-slate-800 p-2 bg-slate-50 rounded-lg">
                          {usuario.municipio || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Localidad</p>
                        <p className="text-sm text-slate-800 p-2 bg-slate-50 rounded-lg">
                          {usuario.localidad || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">Código Postal</p>
                        <p className="text-sm text-slate-800 p-2 bg-slate-50 rounded-lg">
                          {usuario.codigo_postal || "No especificado"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-1">Fecha de Registro</p>
                          <p className="text-sm text-slate-800">
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={isLoading}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
