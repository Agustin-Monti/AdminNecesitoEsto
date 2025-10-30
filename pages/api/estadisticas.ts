// pages/api/estadisticas.ts (VERSIÓN CORREGIDA)
import { NextApiRequest, NextApiResponse } from 'next';
import  supabaseAdmin  from '@/lib/supabaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Consultas principales en paralelo
    const [
      // Totales básicos
      { count: totalDemandas },
      { count: totalCategorias },
      { count: totalRubros },
      { count: totalUsuarios },
      
      // Usuarios por mes del año actual
      usuariosPorMesData,
      
      // Categorías más usadas (CORREGIDA)
      categoriasMasUsadasData,
      
      // Rubros más usados (CORREGIDA)
      rubrosMasUsadosData,
      
      // Pagos por mes
      pagosPorMesData,
      
      // Estado de demandas
      { data: demandasPorEstado }
    ] = await Promise.all([
      // Totales básicos
      supabaseAdmin.from('demandas').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('categorias').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('rubros').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('profile').select('*', { count: 'exact', head: true }),

      // Usuarios registrados por mes (año actual)
      (async () => {
        const currentYear = new Date().getFullYear();
        const { data, error } = await supabaseAdmin
          .from('profile')
          .select('created_at')
          .gte('created_at', `${currentYear}-01-01`)
          .lt('created_at', `${currentYear + 1}-01-01`);

        if (error) throw error;

        const usuariosPorMes = Array.from({ length: 12 }, (_, i) => ({
          mes: i + 1,
          cantidad: 0
        }));

        data?.forEach(usuario => {
          const mes = new Date(usuario.created_at).getMonth();
          usuariosPorMes[mes].cantidad++;
        });

        return { data: usuariosPorMes };
      })(),

      // Categorías más usadas en demandas (CORREGIDA)
      (async () => {
        try {
          console.log('🔍 Obteniendo categorías más usadas...');
          
          // Primero obtener todas las demandas con IDs de categorías
          const { data: demandas, error } = await supabaseAdmin
            .from('demandas')
            .select('id_categoria')
            .not('id_categoria', 'is', null);

          if (error) {
            console.error('Error obteniendo demandas:', error);
            throw error;
          }

          console.log(`📊 Demandas con categorías: ${demandas?.length}`);

          if (!demandas || demandas.length === 0) {
            return { data: [] };
          }

          // Obtener los IDs únicos de categorías
          const categoriaIds = [...new Set(demandas?.map(d => d.id_categoria).filter(Boolean))];
          console.log(`🎯 IDs de categorías únicas:`, categoriaIds);

          if (categoriaIds.length === 0) {
            return { data: [] };
          }

          // Obtener los nombres de las categorías
          const { data: categorias, error: catError } = await supabaseAdmin
            .from('categorias')
            .select('id, categoria')
            .in('id', categoriaIds);

          if (catError) {
            console.error('Error obteniendo categorías:', catError);
            throw catError;
          }

          console.log(`📋 Categorías encontradas:`, categorias);

          // Crear un mapa de ID a nombre de categoría
          const categoriaMap = new Map();
          categorias?.forEach(cat => {
            console.log(`📍 Categoría ID ${cat.id}:`, cat.categoria);
            categoriaMap.set(cat.id, cat.categoria || `Categoría ${cat.id}`);
          });

          // Contar las categorías
          const categoriasCount = demandas?.reduce((acc: any, demanda) => {
            const categoriaNombre = categoriaMap.get(demanda.id_categoria) || `Categoría ${demanda.id_categoria}`;
            acc[categoriaNombre] = (acc[categoriaNombre] || 0) + 1;
            return acc;
          }, {});

          console.log(`📈 Conteo de categorías:`, categoriasCount);

          const categoriasMasUsadas = Object.entries(categoriasCount || {})
            .map(([categoria, cantidad]) => ({ 
              categoria,
              cantidad: cantidad as number 
            }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 10);

          console.log(`🏆 Categorías más usadas:`, categoriasMasUsadas);
          return { data: categoriasMasUsadas };
        } catch (error) {
          console.error('❌ Error en categorías:', error);
          return { data: [] };
        }
      })(),

      // Rubros más usados en demandas (CORREGIDA)
      (async () => {
        try {
          console.log('🔍 Obteniendo rubros más usados...');
          
          // Primero obtener todas las demandas con IDs de rubros
          const { data: demandas, error } = await supabaseAdmin
            .from('demandas')
            .select('rubro_id')
            .not('rubro_id', 'is', null);

          if (error) {
            console.error('Error obteniendo demandas:', error);
            throw error;
          }

          console.log(`📊 Demandas con rubros: ${demandas?.length}`);

          if (!demandas || demandas.length === 0) {
            return { data: [] };
          }

          // Obtener los IDs únicos de rubros
          const rubroIds = [...new Set(demandas?.map(d => d.rubro_id).filter(Boolean))];
          console.log(`🎯 IDs de rubros únicos:`, rubroIds);

          if (rubroIds.length === 0) {
            return { data: [] };
          }

          // Obtener los nombres de los rubros
          const { data: rubros, error: rubError } = await supabaseAdmin
            .from('rubros')
            .select('id, nombre')
            .in('id', rubroIds);

          if (rubError) {
            console.error('Error obteniendo rubros:', rubError);
            throw rubError;
          }

          console.log(`📋 Rubros encontrados:`, rubros);

          // Crear un mapa de ID a nombre de rubro
          const rubroMap = new Map();
          rubros?.forEach(rub => {
            console.log(`📍 Rubro ID ${rub.id}:`, rub.nombre);
            rubroMap.set(rub.id, rub.nombre || `Rubro ${rub.id}`);
          });

          // Contar los rubros
          const rubrosCount = demandas?.reduce((acc: any, demanda) => {
            const rubroNombre = rubroMap.get(demanda.rubro_id) || `Rubro ${demanda.rubro_id}`;
            acc[rubroNombre] = (acc[rubroNombre] || 0) + 1;
            return acc;
          }, {});

          console.log(`📈 Conteo de rubros:`, rubrosCount);

          const rubrosMasUsados = Object.entries(rubrosCount || {})
            .map(([rubro, cantidad]) => ({ 
              rubro,
              cantidad: cantidad as number 
            }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 10);

          console.log(`🏆 Rubros más usados:`, rubrosMasUsados);
          return { data: rubrosMasUsados };
        } catch (error) {
          console.error('❌ Error en rubros:', error);
          return { data: [] };
        }
      })(),

      // Pagos por mes (año actual)
      (async () => {
        const currentYear = new Date().getFullYear();
        const { data, error } = await supabaseAdmin
          .from('pagos')
          .select('monto, fecha_pago')
          .gte('fecha_pago', `${currentYear}-01-01`)
          .lt('fecha_pago', `${currentYear + 1}-01-01`)
          .eq('estado_pago', 'completado');

        if (error) throw error;

        const pagosPorMes = Array.from({ length: 12 }, (_, i) => ({
          mes: i + 1,
          total: 0,
          cantidad: 0
        }));

        data?.forEach(pago => {
          const mes = new Date(pago.fecha_pago).getMonth();
          pagosPorMes[mes].total += pago.monto;
          pagosPorMes[mes].cantidad++;
        });

        return { data: pagosPorMes };
      })(),

      // Estado de demandas
      supabaseAdmin
        .from('demandas')
        .select('estado')
        .then(({ data, error }) => {
          if (error) throw error;
          const agrupado = data?.reduce((acc: any, item) => {
            acc[item.estado] = (acc[item.estado] || 0) + 1;
            return acc;
          }, {});
          return { data: agrupado };
        })
    ]);

    const estadisticas = {
      // Totales básicos
      totalDemandas: totalDemandas || 0,
      totalCategorias: totalCategorias || 0,
      totalRubros: totalRubros || 0,
      totalUsuarios: totalUsuarios || 0,
      
      // Nuevas métricas
      usuariosPorMes: usuariosPorMesData.data || [],
      categoriasMasUsadas: categoriasMasUsadasData.data || [],
      rubrosMasUsados: rubrosMasUsadosData.data || [],
      pagosPorMes: pagosPorMesData.data || [],
      demandasPorEstado: demandasPorEstado || {},
      
      timestamp: new Date().toISOString()
    };

    console.log('✅ Estadísticas finales:', estadisticas);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(estadisticas);

  } catch (error) {
    console.error('❌ Error en API de estadísticas:', error);
    
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}