// components/Inicio.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Folder, 
  Tag, 
  Users, 
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";

interface Estadisticas {
  totalDemandas: number;
  totalCategorias: number;
  totalRubros: number;
  totalUsuarios: number;
  usuariosPorMes: { mes: number; cantidad: number }[];
  categoriasMasUsadas: { categoria: string; cantidad: number }[]; // Cambiado: categoria en lugar de nombre
  rubrosMasUsados: { rubro: string; cantidad: number }[]; // Cambiado: rubro en lugar de nombre
  pagosPorMes: { mes: number; total: number; cantidad: number }[];
  demandasPorEstado: { [key: string]: number };
}

export default function Inicio() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/estadisticas');
        
        if (!response.ok) {
          throw new Error('Error al cargar las estadísticas');
        }
        
        const data = await response.json();
        setEstadisticas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  // Nombres de meses
  const nombresMeses = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  // Función para gráfico de barras simple
  const GraficoBarras = ({ datos, titulo, color = "bg-blue-500" }: { 
    datos: { label: string; value: number }[]; 
    titulo: string;
    color?: string;
  }) => {
    const maxValue = Math.max(...datos.map(d => d.value), 1);
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
          {titulo}
        </h3>
        <div className="space-y-2">
          {datos.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-sm text-slate-600 w-20 truncate">{item.label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                <div 
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-slate-800 w-8 text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Función para gráfico de progreso circular
  const GraficoProgreso = ({ valor, max, titulo, color = "text-blue-500" }: {
    valor: number;
    max: number;
    titulo: string;
    color?: string;
  }) => {
    const porcentaje = (valor / max) * 100;
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
        <h3 className="font-semibold text-slate-800 mb-4">{titulo}</h3>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-200"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={220}
              strokeDashoffset={220 - (220 * porcentaje) / 100}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute">
            <span className="text-2xl font-bold text-slate-800">{valor}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">de {max} total</p>
      </div>
    );
  };

  const tarjetas = [
    {
      titulo: "Total Demandas",
      valor: estadisticas?.totalDemandas || 0,
      icono: <ClipboardList className="h-6 w-6" />,
      color: "bg-blue-500",
      descripcion: "Demandas registradas"
    },
    {
      titulo: "Categorías",
      valor: estadisticas?.totalCategorias || 0,
      icono: <Folder className="h-6 w-6" />,
      color: "bg-green-500",
      descripcion: "Categorías activas"
    },
    {
      titulo: "Rubros",
      valor: estadisticas?.totalRubros || 0,
      icono: <Tag className="h-6 w-6" />,
      color: "bg-purple-500",
      descripcion: "Rubros disponibles"
    },
    {
      titulo: "Usuarios",
      valor: estadisticas?.totalUsuarios || 0,
      icono: <Users className="h-6 w-6" />,
      color: "bg-orange-500",
      descripcion: "Usuarios registrados"
    }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error al cargar estadísticas</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tarjetas.map((tarjeta, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {tarjeta.titulo}
              </h3>
              <div className={`p-2 rounded-lg ${tarjeta.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                {tarjeta.icono}
              </div>
            </div>
            
            <div className="mb-2">
              <p className="text-3xl font-bold text-slate-900">
                {tarjeta.valor.toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <p className="text-sm text-slate-500">
                {tarjeta.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos y Métricas Avanzadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usuarios por Mes */}
        <GraficoBarras
          titulo="Usuarios Registrados por Mes"
          color="bg-green-500"
          datos={estadisticas?.usuariosPorMes.map(item => ({
            label: nombresMeses[item.mes - 1],
            value: item.cantidad
          })) || []}
        />

        {/* Categorías Más Usadas */}
        <GraficoBarras
            titulo="Categorías Más Populares"
            color="bg-purple-500"
            datos={estadisticas?.categoriasMasUsadas.slice(0, 8).map(item => ({
                label: item.categoria, // Cambiado: item.categoria en lugar de item.nombre
                value: item.cantidad
            })) || []}
        />

        {/* Rubros Más Usados */}
        <GraficoBarras
            titulo="Rubros Más Utilizados"
            color="bg-orange-500"
            datos={estadisticas?.rubrosMasUsados.slice(0, 8).map(item => ({
                label: item.rubro, // Cambiado: item.rubro en lugar de item.nombre
                value: item.cantidad
            })) || []}
        />

        {/* Pagos por Mes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-slate-600" />
            Ingresos por Mes
          </h3>
          <div className="space-y-3">
            {estadisticas?.pagosPorMes.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{nombresMeses[item.mes - 1]}</span>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    ${item.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.cantidad} pagos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estado de Demandas */}
      {estadisticas?.demandasPorEstado && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(estadisticas.demandasPorEstado).map(([estado, cantidad], index) => (
            <GraficoProgreso
              key={estado}
              valor={cantidad}
              max={estadisticas.totalDemandas}
              titulo={`Demandas ${estado}`}
              color={index === 0 ? "text-blue-500" : 
                     index === 1 ? "text-green-500" : 
                     index === 2 ? "text-purple-500" : "text-orange-500"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="h-8 w-16 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="animate-pulse">
              <div className="h-5 w-40 bg-slate-200 rounded mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 mb-3">
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                  <div className="flex-1 h-6 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-8 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}