"use client";

import { useState, useEffect } from "react";
import ModalUsuario from "@/components/ModalUsuario";
import { actualizarUsuario, eliminarUsuario, getCategorias, getRubros } from "@/actions/usuarios-actions";
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
  rubros?: {
    nombre: string;
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
  const [ordenFecha, setOrdenFecha] = useState<'' | 'asc' | 'desc'>('');
  const [ordenColumna, setOrdenColumna] = useState<'empresa'>('empresa');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [categorias, setCategorias] = useState<{ id: string; categoria: string }[]>([]);
  const [rubros, setRubros] = useState<{ id: string; nombre: string }[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [rubroSeleccionado, setRubroSeleccionado] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    getCategorias().then(setCategorias).catch(console.error);
    getRubros().then(setRubros).catch(console.error);
  }, []);

  const toggleOrden = () => {
    setOrden(orden === 'asc' ? 'desc' : 'asc');
  };

  

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    if (ordenFecha) {
      const fechaA = new Date(a.created_at).getTime();
      const fechaB = new Date(b.created_at).getTime();
      return ordenFecha === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    } else {
      const empresaA = a.empresa?.toLowerCase() || '';
      const empresaB = b.empresa?.toLowerCase() || '';
      return orden === 'asc'
        ? empresaA.localeCompare(empresaB)
        : empresaB.localeCompare(empresaA);
    }
  });


  const usuariosFiltrados = usuariosOrdenados.filter((usuario) => {
    const busquedaLower = busqueda.toLowerCase();

    const coincideBusqueda =
      busqueda.trim() === "" ||
      usuario.nombre?.toLowerCase().includes(busquedaLower) ||
      usuario.apellido?.toLowerCase().includes(busquedaLower) ||
      usuario.email?.toLowerCase().includes(busquedaLower) ||
      usuario.empresa?.toLowerCase().includes(busquedaLower);

    const coincideCategoria =
      categoriaSeleccionada === "" ||
      usuario.categorias?.categoria === categoriaSeleccionada;

    const coincideRubro =
      rubroSeleccionado === "" ||
      usuario.rubros?.nombre === rubroSeleccionado;

    return coincideBusqueda && coincideCategoria && coincideRubro;
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
      console.log('Usuario eliminado:', eliminado);
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
      console.error("Error al eliminar el usuario:", error);
      setDeleteMessage("❌ Error: " + (error instanceof Error ? error.message : "Error desconocido"));
    } finally {
      setIsDeleting(false);
      handleCerrarModal();
    }
  };

  return (
    <div>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold">Buscar:</label>
            <input
              type="text"
              placeholder="Buscar por nombre, empresa, email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Filtrar por categoría:</label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.categoria}>{cat.categoria}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Filtrar por rubro:</label>
            <select
              value={rubroSeleccionado}
              onChange={(e) => setRubroSeleccionado(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">Todos</option>
              {rubros.map((r) => (
                <option key={r.id} value={r.nombre}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ordenar por fecha:</label>
              <select
                value={ordenFecha}
                onChange={(e) => setOrdenFecha(e.target.value as 'asc' | 'desc' | '')}
                className="p-2 border rounded w-full"
              >
                <option value="">(Sin orden por fecha)</option>
                <option value="desc">Más reciente primero</option>
                <option value="asc">Más antiguo primero</option>
              </select>
          </div>


          <div className="mt-1 md:mt-0">
            <button
              onClick={() => {
                setBusqueda("");
                setCategoriaSeleccionada("");
                setRubroSeleccionado("");
                setOrden('desc');
                setOrdenFecha('');
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition-all text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>


        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-700"
                onClick={toggleOrden}
              >
                Empresa {orden === 'asc' ? '↑' : '↓'}
              </th>
              <th className="border-b px-4 py-2 text-left">Nombre</th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Categoría</th>
              <th className="border-b px-4 py-2 text-left">Rubro</th>
              <th className="border-b px-4 py-2 text-left">Rol</th>
              <th className="border-b px-4 py-2 text-left">Demanda Gratis</th>
              <th className="border-b px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="border-b px-4 py-2">{usuario.empresa}</td>
                  <td className="border-b px-4 py-2">{usuario.nombre}</td>
                  <td className="border-b px-4 py-2">{usuario.email}</td>
                  <td className="border-b px-4 py-2">{usuario.categorias?.categoria || 'Sin categoría'}</td>
                  <td className="border-b px-4 py-2">{usuario.rubros?.nombre || 'Sin rubros'}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-6">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {isModalOpen && selectedUsuario && (
        <ModalUsuario
          isOpen={isModalOpen}
          usuario={selectedUsuario}
          onClose={handleCerrarModal}
          onActualizar={handleActualizarRol}
        />
      )}

      <LoadingModal isOpen={isDeleting} message={deleteMessage} />
    </div>
    
  );
}
