// app/envios/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Send, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Usuario {
  id: string;
  email: string;
  // Agrega otros campos según tu estructura de profile
  categorias?: { categoria: string }[];
  rubros?: { nombre: string }[];
}

export default function EnvioMails() {
  const [formData, setFormData] = useState({
    asunto: '',
    mensaje: '',
    destinatarios: 'todos'
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [resultado, setResultado] = useState<{tipo: string, mensaje: string} | null>(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const response = await fetch('/api/admin/usuarios');
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
          // Seleccionar todos por defecto
          setUsuariosSeleccionados(data.map((user: Usuario) => user.id));
        } else {
          throw new Error('Error al cargar usuarios');
        }
      } catch (error) {
        console.error('Error:', error);
        setResultado({
          tipo: 'error',
          mensaje: 'Error al cargar la lista de usuarios'
        });
      } finally {
        setCargandoUsuarios(false);
      }
    };

    cargarUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          usuariosIds: formData.destinatarios === 'todos' 
            ? usuarios.map(u => u.id) 
            : usuariosSeleccionados
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResultado({
          tipo: 'exito',
          mensaje: `✅ Correos enviados exitosamente a ${data.enviados} destinatarios`
        });
        setFormData({ asunto: '', mensaje: '', destinatarios: 'todos' });
      } else {
        setResultado({
          tipo: 'error',
          mensaje: `❌ ${data.error || 'Error al enviar los correos'}`
        });
      }
    } catch (error) {
      setResultado({
        tipo: 'error',
        mensaje: '❌ Error de conexión con el servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleUsuario = (usuarioId: string) => {
    setUsuariosSeleccionados(prev => 
      prev.includes(usuarioId)
        ? prev.filter(id => id !== usuarioId)
        : [...prev, usuarioId]
    );
  };

  const seleccionarTodos = () => {
    setUsuariosSeleccionados(usuarios.map(user => user.id));
  };

  const deseleccionarTodos = () => {
    setUsuariosSeleccionados([]);
  };

  const usuariosFiltrados = formData.destinatarios === 'todos' 
    ? usuarios 
    : usuarios.filter(user => usuariosSeleccionados.includes(user.id));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Envío Masivo de Correos
          </h1>
          <p className="text-slate-600">
            Envía correos electrónicos a los usuarios del sistema
          </p>
        </div>

        {/* Alertas de Gmail */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">
                Consideraciones importantes
              </h3>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Límite de Gmail: 500-1000 correos por día</li>
                <li>• Máximo 100 destinatarios por mensaje</li>
                <li>• Los correos masivos pueden ser marcados como spam</li>
                <li>• Se recomienda enviar en lotes pequeños</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de destinatarios */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Destinatarios
              </label>
              <select
                name="destinatarios"
                value={formData.destinatarios}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los usuarios ({usuarios.length})</option>
                <option value="seleccionados">Usuarios seleccionados ({usuariosSeleccionados.length})</option>
              </select>
            </div>

            {/* Lista de usuarios seleccionables */}
            {formData.destinatarios === 'seleccionados' && (
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Seleccionar usuarios ({usuariosSeleccionados.length} de {usuarios.length})
                  </label>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={seleccionarTodos}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={deseleccionarTodos}
                      className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                    >
                      Ninguno
                    </button>
                  </div>
                </div>
                
                {cargandoUsuarios ? (
                  <div className="text-center py-4 text-slate-500">
                    Cargando usuarios...
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded">
                    {usuarios.map((usuario) => (
                      <div
                        key={usuario.id}
                        className={`flex items-center p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 ${
                          usuariosSeleccionados.includes(usuario.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={usuariosSeleccionados.includes(usuario.id)}
                          onChange={() => toggleUsuario(usuario.id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-slate-900">
                            {usuario.email}
                          </div>
                          <div className="text-xs text-slate-500">
                            {usuario.categorias?.[0]?.categoria || 'Sin categoría'} • {usuario.rubros?.[0]?.nombre || 'Sin rubro'}
                          </div>
                        </div>
                        {usuariosSeleccionados.includes(usuario.id) && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Asunto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Asunto del correo
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                placeholder="Ingresa el asunto del correo"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mensaje
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Escribe el contenido del correo electrónico..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>

            {/* Resumen de envío */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-700 mb-2">Resumen del envío:</h4>
              <div className="text-sm text-slate-600">
                <p>• Destinatarios: <strong>{usuariosFiltrados.length} usuarios</strong></p>
                <p>• Lotes necesarios: <strong>{Math.ceil(usuariosFiltrados.length / 50)} lotes de 50</strong></p>
                <p>• Correos disponibles hoy: <strong>{Math.max(0, 500 - usuariosFiltrados.length)} restantes</strong></p>
              </div>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || usuariosFiltrados.length === 0}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Enviando...' : `Enviar a ${usuariosFiltrados.length} usuarios`}
              </button>
            </div>
          </form>

          {/* Resultado */}
          {resultado && (
            <div className={`mt-6 p-4 rounded-md ${
              resultado.tipo === 'exito' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {resultado.mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}