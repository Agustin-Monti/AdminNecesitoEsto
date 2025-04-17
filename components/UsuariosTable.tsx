"use client";

import { useState } from "react";
import ModalUsuario from "@/components/ModalUsuario";
import { actualizarUsuario, eliminarUsuario } from "@/actions/profile-actions";
import LoadingModal from "@/components/LoadingModal";
import { Check, X } from "lucide-react";

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  admin: boolean; // Cambiamos de 'role' a 'admin' (boolean)
  demanda_gratis: boolean; // Nueva propiedad
  created_at: string;
  updated_at: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

export default function UsuariosTable({ usuarios, setUsuarios }: UsuariosTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [ordenColumna, setOrdenColumna] = useState<'email' | 'created_at'>('created_at');

  // Función para cambiar el orden
  const toggleOrden = () => {
    setOrden(orden === 'asc' ? 'desc' : 'asc');
  };

  // Función para cambiar la columna de ordenamiento
  const cambiarOrdenColumna = (columna: 'email' | 'created_at') => {
    if (ordenColumna === columna) {
      toggleOrden();
    } else {
      setOrdenColumna(columna);
      setOrden('desc');
    }
  };

  // Ordenar los usuarios
  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    if (ordenColumna === 'email') {
      return orden === 'asc' 
        ? a.email.localeCompare(b.email) 
        : b.email.localeCompare(a.email);
    } else {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return orden === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const handleViewUsuario = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  // En tu página o componente donde está UsuariosTable
  const handleActualizarRol = async (id: string, nuevoAdmin: boolean, nuevaDemandaGratis: boolean) => {
    try {
      const updatedUsuario = await actualizarUsuario(id, { 
        admin: nuevoAdmin,
        demanda_gratis: nuevaDemandaGratis
      });
      
      if (!updatedUsuario) {
        throw new Error("No se recibió respuesta del servidor");
      }
      
      // Actualizar el estado local
      setUsuarios(usuarios.map(u => 
        u.id === id ? { 
          ...u, 
          admin: nuevoAdmin,
          demanda_gratis: nuevaDemandaGratis 
        } : u
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
      
      if (!eliminado) {
        throw new Error("Error al eliminar el usuario");
      }
      
      setDeleteMessage("Enviando notificación...");
      
      // Enviar correo de notificación (opcional)
      const usuario = usuarios.find(u => u.id === id);
      if (usuario) {
        const mailResponse = await fetch('/api/mail-usuario-eliminado', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: usuario.email,
            nombre: usuario.nombre,
          }),
        });
        
        if (!mailResponse.ok) {
          const mailResult = await mailResponse.json();
          throw new Error(mailResult.message || "Error al enviar correo");
        }
      }
      
      // Actualizar estado
      setUsuarios(usuarios.filter(u => u.id !== id));

      // Feedback final
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
                onClick={() => cambiarOrdenColumna('email')}
              >
                Email {ordenColumna === 'email' ? (orden === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="border-b px-4 py-2 text-left">Nombre</th>
              <th className="border-b px-4 py-2 text-left">Apellido</th>
              <th className="border-b px-4 py-2 text-left">Rol</th>
              <th className="border-b px-4 py-2 text-left">Demanda Gratis</th>
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                onClick={() => cambiarOrdenColumna('created_at')}
              >
                Fecha Registro {ordenColumna === 'created_at' ? (orden === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="border-b px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosOrdenados.map((usuario) => (
              <tr
                key={usuario.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="border-b px-4 py-2">{usuario.email}</td>
                <td className="border-b px-4 py-2">{usuario.nombre}</td>
                <td className="border-b px-4 py-2">{usuario.apellido}</td>
                <td className="border-b px-4 py-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    usuario.admin 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
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
                <td className="border-b px-4 py-2">
                  {new Date(usuario.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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

      {/* Modal */}
      {isModalOpen && selectedUsuario && (
        <ModalUsuario
            isOpen={isModalOpen}
            usuario={selectedUsuario}
            onClose={handleCerrarModal}
            onActualizar={(id, nuevoAdmin, nuevaDemandaGratis) => {
            // Aquí debes implementar la lógica para actualizar ambos campos
            handleActualizarRol(id, nuevoAdmin, nuevaDemandaGratis);
            }}
            onEliminar={handleEliminarUsuario}
        />
      )}

      <LoadingModal 
        isOpen={isDeleting} 
        message={deleteMessage} 
      />
    </div>
  );
}