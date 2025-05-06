"use client";

import { useState } from "react";
import ModalUsuario from "@/components/ModalUsuario";
import { actualizarUsuario, eliminarUsuario } from "@/actions/usuarios-actions";
import LoadingModal from "@/components/LoadingModal";
import { Check, X } from "lucide-react";

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  empresa?: string;
  admin: boolean;
  demanda_gratis: boolean;
  created_at: string;
  updated_at: string;
  categorias?: {
    categoria: string;
  };
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

export default function UsuariosTable({ usuarios, setUsuarios }: UsuariosTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc');
  const [ordenColumna, setOrdenColumna] = useState<'empresa'>('empresa');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const toggleOrden = () => {
    setOrden(orden === 'asc' ? 'desc' : 'asc');
  };

  const cambiarOrdenColumna = (columna: 'empresa') => {
    toggleOrden();
  };

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    const empresaA = a.empresa?.toLowerCase() || '';
    const empresaB = b.empresa?.toLowerCase() || '';

    return orden === 'asc'
      ? empresaA.localeCompare(empresaB)
      : empresaB.localeCompare(empresaA);
  });

  const handleViewUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleActualizarRol = async (id: string, nuevoAdmin: boolean, nuevaDemandaGratis: boolean) => {
    try {
      const updatedUsuario = await actualizarUsuario(id, {
        admin: nuevoAdmin,
        demanda_gratis: nuevaDemandaGratis,
      });

      if (!updatedUsuario) throw new Error("No se recibió respuesta del servidor");

      setUsuarios(usuarios.map(u =>
        u.id === id
          ? { ...u, admin: nuevoAdmin, demanda_gratis: nuevaDemandaGratis }
          : u
      ));

      alert("✅ Cambios guardados correctamente");
    } catch (error) {
      console.error("Error completo:", error);
      alert(`❌ ${error instanceof Error ? error.message : "Error al guardar cambios"}`);
    }

    handleCerrarModal();
  };

  const handleEliminarUsuario = async (id: string) => {
    console.log("Eliminando usuario con ID:", id);
    setIsDeleting(true);
    setDeleteMessage("Eliminando usuario...");

    try {
      const eliminado = await eliminarUsuario(id);
      if (!eliminado) throw new Error("Error al eliminar el usuario");

      setDeleteMessage("Enviando notificación...");

      const usuario = usuarios.find(u => u.id === id);
      if (usuario) {
        const mailResponse = await fetch('/api/mail-usuario-eliminado', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: usuario.email, nombre: usuario.nombre }),
        });

        if (!mailResponse.ok) {
          const mailResult = await mailResponse.json();
          throw new Error(mailResult.message || "Error al enviar correo");
        }
      }

      setUsuarios(usuarios.filter(u => u.id !== id));
      setDeleteMessage("¡Usuario eliminado con éxito!");
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setDeleteMessage("❌ Error: " + (error instanceof Error ? error.message : "Error desconocido"));
      await new Promise(resolve => setTimeout(resolve, 3000));
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
                onClick={() => cambiarOrdenColumna('empresa')}
              >
                Empresa {orden === 'asc' ? '↑' : '↓'}
              </th>
              <th className="border-b px-4 py-2 text-left">Nombre</th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Categoria</th>
              <th className="border-b px-4 py-2 text-left">Rol</th>
              <th className="border-b px-4 py-2 text-left">Demanda Gratis</th>
              <th className="border-b px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosOrdenados.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="border-b px-4 py-2">{usuario.empresa}</td>
                <td className="border-b px-4 py-2">{usuario.nombre}</td>
                <td className="border-b px-4 py-2">{usuario.email}</td>
                <td className="border-b px-4 py-2">{usuario.categorias?.categoria || 'Sin categoría'}</td>
                <td className="border-b px-4 py-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    usuario.admin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {usuario.admin ? 'Admin' : 'Usuario'}
                  </span>
                </td>
                <td className="border-b px-4 py-2">
                  {usuario.demanda_gratis ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </td>
                <td className="border-b px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => handleViewUsuario(usuario)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition-all text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarUsuario(usuario.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {isModalOpen && selectedUsuario && (
        <ModalUsuario
          isOpen={isModalOpen}
          usuario={selectedUsuario}
          onClose={handleCerrarModal}
          onActualizar={handleActualizarRol}
        />
      )}

      {/* Modal de carga/eliminación */}
      <LoadingModal isOpen={isDeleting} message={deleteMessage} />
    </div>
  );
}
