import { createServiceClient } from "@/src/lib/supabase"

export interface PeritajesStats {
  pendientes: number
  completados: number
  cancelados: number
  en_proceso: number
  total: number
}

// Función para obtener estadísticas de peritajes en un rango de fechas
export async function fetchPeritajesStats(fechaDesde: string, fechaHasta: string): Promise<PeritajesStats> {
  try {
    console.log(`Obteniendo estadísticas desde ${fechaDesde} hasta ${fechaHasta}...`)

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar todos los peritajes en el rango de fechas
    const { data, error } = await supabase
      .from("peritajes")
      .select("estado")
      .gte("fecha_turno", fechaDesde)
      .lte("fecha_turno", fechaHasta)

    if (error) {
      console.error("Error al consultar estadísticas de peritajes:", error)
      throw new Error(`Error al obtener estadísticas: ${error.message}`)
    }

    // Contar por estado
    const stats: PeritajesStats = {
      pendientes: 0,
      completados: 0,
      cancelados: 0,
      en_proceso: 0,
      total: 0,
    }

    data.forEach((peritaje) => {
      stats.total++
      switch (peritaje.estado.toLowerCase()) {
        case "pendiente":
          stats.pendientes++
          break
        case "completado":
          stats.completados++
          break
        case "cancelado":
          stats.cancelados++
          break
        case "en_proceso":
          stats.en_proceso++
          break
        default:
          // Estados no reconocidos se cuentan como pendientes
          stats.pendientes++
          break
      }
    })

    console.log("Estadísticas obtenidas:", stats)
    return stats
  } catch (error: any) {
    console.error("Error en fetchPeritajesStats:", error)
    throw error
  }
}

// Función para obtener estadísticas por mes (para gráficos de tendencia)
export async function fetchPeritajesStatsByMonth(year: number): Promise<
  Array<{
    month: string
    pendientes: number
    completados: number
    cancelados: number
    en_proceso: number
    total: number
  }>
> {
  try {
    console.log(`Obteniendo estadísticas por mes para el año ${year}...`)

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar todos los peritajes del año
    const { data, error } = await supabase
      .from("peritajes")
      .select("estado, fecha_turno")
      .gte("fecha_turno", `${year}-01-01`)
      .lte("fecha_turno", `${year}-12-31`)

    if (error) {
      console.error("Error al consultar estadísticas por mes:", error)
      throw new Error(`Error al obtener estadísticas por mes: ${error.message}`)
    }

    // Inicializar estadísticas por mes
    const monthlyStats: { [key: string]: any } = {}
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    months.forEach((month, index) => {
      monthlyStats[month] = {
        month,
        pendientes: 0,
        completados: 0,
        cancelados: 0,
        en_proceso: 0,
        total: 0,
      }
    })

    // Procesar los datos
    data.forEach((peritaje) => {
      const date = new Date(peritaje.fecha_turno)
      const monthIndex = date.getMonth()
      const monthName = months[monthIndex]

      monthlyStats[monthName].total++
      switch (peritaje.estado.toLowerCase()) {
        case "pendiente":
          monthlyStats[monthName].pendientes++
          break
        case "completado":
          monthlyStats[monthName].completados++
          break
        case "cancelado":
          monthlyStats[monthName].cancelados++
          break
        case "en_proceso":
          monthlyStats[monthName].en_proceso++
          break
        default:
          monthlyStats[monthName].pendientes++
          break
      }
    })

    const result = Object.values(monthlyStats)
    console.log("Estadísticas por mes obtenidas:", result)
    return result
  } catch (error: any) {
    console.error("Error en fetchPeritajesStatsByMonth:", error)
    throw error
  }
}


// Función para obtener peritajes pendientes
export async function fetchKPIPeritajes(condicion: string) {
  try {
    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes filtrando por estado pendiente
    let count: number | null = null
    let error: any = null

    if (condicion && condicion.trim() !== "") {
      const result = await supabase
      .from("peritajes")
      .select("*", { count: "exact", head: true })
      .eq("estado", condicion)
      count = result.count
      error = result.error
    } else {
      const result = await supabase
      .from("peritajes")
      .select("*", { count: "exact", head: true })
      count = result.count
      error = result.error
    }

    const data = count

    if (error) {
      console.error("Error al consultar peritajes pendientes:", error)
      throw new Error(`Error al obtener peritajes pendientes: ${error.message}`)
    }

    return data || 0
  } catch (error: any) {
    console.error("Error en fetchPeritajesPendientes:", error)
    throw error
  }
}
