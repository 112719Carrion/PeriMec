import { createServiceClient } from "@/src/lib/supabase"
import { supabase } from "@/src/lib/supabase" // Agregar importación del cliente de autenticación

// Tipo para los datos del peritaje
export interface PeritajeData {
  id?: string
  marca: string
  modelo: string
  anio: string
  patente: string
  kilometraje: string
  color: string
  tipo_combustible: string
  observaciones?: string
  nombre_propietario: string
  telefono_propietario: string
  email_propietario: string
  fecha_turno: string
  hora_turno: string
  estado: string
  payment_id?: string
  payment_status?: boolean
  created_at?: string
  updated_at?: string
  user_id?: string // ID del usuario que crea/modifica el peritaje
  // Campos de evaluación del vehículo
  estado_general?: string
  carroceria?: string
  pintura?: string
  motor?: string
  transmision?: string
  frenos?: string
  suspension?: string
  sistema_electrico?: string
  interior?: string
  neumaticos?: string
  conclusion?: string
}

// Función para crear un nuevo peritaje
export async function createPeritaje(peritajeData: Omit<PeritajeData, "id" | "created_at" | "updated_at">) {
  try {
    console.log("Iniciando creación de peritaje...")

    // Crear el cliente de servicio
    const supabaseService = createServiceClient()

    if (!supabaseService) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    console.log("Cliente de servicio creado correctamente")

    // Obtener el usuario actual usando el cliente de autenticación
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    if (!userId) {
      throw new Error("No hay usuario autenticado")
    }
    console.log("userId", userId)

    // Insertar el peritaje en la tabla de peritajes
    const { data, error } = await supabaseService
      .from("peritajes")
      .insert([
        {
          marca: peritajeData.marca,
          modelo: peritajeData.modelo,
          anio: peritajeData.anio,
          patente: peritajeData.patente,
          kilometraje: peritajeData.kilometraje,
          color: peritajeData.color,
          tipo_combustible: peritajeData.tipo_combustible,
          observaciones: peritajeData.observaciones || "",
          nombre_propietario: peritajeData.nombre_propietario,
          telefono_propietario: peritajeData.telefono_propietario,
          email_propietario: peritajeData.email_propietario,
          fecha_turno: peritajeData.fecha_turno,
          hora_turno: peritajeData.hora_turno,
          estado: peritajeData.estado,
          senaPendiente: peritajeData.payment_status,
          user_id: userId, // Agregar el ID del usuario
        },
      ])
      .select()

    if (error) {
      console.error("Error al crear peritaje:", error)
      throw new Error(`Error al crear peritaje: ${error.message}`)
    }

    console.log("Peritaje creado correctamente:", data)
    return data[0]
  } catch (error: any) {
    console.error("Error en createPeritaje:", error)
    throw error
  }
}

// Función para obtener todos los peritajes
export async function fetchPeritajes() {
  try {
    console.log("Iniciando fetchPeritajes...")

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    console.log("Cliente de servicio creado correctamente")

    // Consultar la tabla de peritajes
    const { data, error } = await supabase.from("peritajes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error al consultar peritajes:", error)
      throw new Error(`Error al obtener peritajes: ${error.message}`)
    }

    console.log(`Peritajes obtenidos: ${data?.length || 0}`)
    return data || []
  } catch (error: any) {
    console.error("Error en fetchPeritajes:", error)
    throw error
  }
}

// Función para obtener peritajes pendientes
export async function fetchPeritajesPendientes(señado:boolean = false) {
  try {
    console.log("Iniciando fetchPeritajesPendientes...")

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes filtrando por estado pendiente y en_proceso
    const { data, error } = await supabase
      .from("peritajes")
      .select("*")
      .in("estado", ["pendiente", "en_proceso"])
      .eq("senaPendiente", señado)
      .order("fecha_turno", { ascending: true })

    if (error) {
      console.error("Error al consultar peritajes pendientes:", error)
      throw new Error(`Error al obtener peritajes pendientes: ${error.message}`)
    }

    console.log(`Peritajes pendientes obtenidos: ${data?.length || 0}`)
    return data || []
  } catch (error: any) {
    console.error("Error en fetchPeritajesPendientes:", error)
    throw error
  }
}

// Función para obtener un peritaje por ID
export async function fetchPeritajeById(id: string) {
  try {
    console.log(`Iniciando fetchPeritajeById para ID: ${id}...`)

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes
    const { data, error } = await supabase.from("peritajes").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error al consultar peritaje con ID ${id}:`, error)
      throw new Error(`Error al obtener peritaje: ${error.message}`)
    }

    console.log(`Peritaje obtenido:`, data)
    return data
  } catch (error: any) {
    console.error("Error en fetchPeritajeById:", error)
    throw error
  }
}

// Función para actualizar un peritaje
export async function updatePeritaje(id: string, peritajeData: Partial<PeritajeData>) {
  try {
    console.log(`Iniciando updatePeritaje para ID: ${id}...`)

    // Crear el cliente de servicio
    const supabaseService = createServiceClient()

    if (!supabaseService) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Obtener el usuario actual usando el cliente de autenticación
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id
    console.log("userId", userId)

    if (!userId) {
      throw new Error("No hay usuario autenticado")
    }

    // Obtener el peritaje anterior para verificar si el estado ha cambiado
    const { data: prevPeritaje, error: fetchError } = await supabaseService
      .from("peritajes")
      .select("estado")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error(`Error al obtener estado anterior del peritaje con ID ${id}:`, fetchError)
    }

    // Actualizar el peritaje usando el cliente de servicio
    const { data, error } = await supabaseService
      .from("peritajes")
      .update({
        marca: peritajeData.marca,
        modelo: peritajeData.modelo,
        anio: peritajeData.anio,
        patente: peritajeData.patente,
        kilometraje: peritajeData.kilometraje,
        color: peritajeData.color,
        tipo_combustible: peritajeData.tipo_combustible,
        observaciones: peritajeData.observaciones,
        nombre_propietario: peritajeData.nombre_propietario,
        telefono_propietario: peritajeData.telefono_propietario,
        email_propietario: peritajeData.email_propietario,
        estado: peritajeData.estado,
        senaPendiente: peritajeData.payment_status,
        user_id: userId, // Agregar el ID del usuario
        // Campos de evaluación del vehículo
        estado_general: peritajeData.estado_general,
        carroceria: peritajeData.carroceria,
        pintura: peritajeData.pintura,
        motor: peritajeData.motor,
        transmision: peritajeData.transmision,
        frenos: peritajeData.frenos,
        suspension: peritajeData.suspension,
        sistema_electrico: peritajeData.sistema_electrico,
        interior: peritajeData.interior,
        neumaticos: peritajeData.neumaticos,
        conclusion: peritajeData.conclusion,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error(`Error al actualizar peritaje con ID ${id}:`, error)
      throw new Error(`Error al actualizar peritaje: ${error.message}`)
    }

    console.log(`Peritaje actualizado:`, data)

    // Verificar si el estado cambió a "completado"
    const updatedPeritaje = data[0]
    const estadoAnterior = prevPeritaje?.estado

    if (updatedPeritaje && updatedPeritaje.estado === "completado" && estadoAnterior !== "completado") {
      try {
        // Enviar correo de notificación
        await fetch("/api/completado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: updatedPeritaje.email_propietario,
            peritaje: updatedPeritaje,
          }),
        })
        console.log(`Correo de notificación enviado a ${updatedPeritaje.email_propietario}`)
      } catch (emailError) {
        console.error("Error al enviar correo de notificación:", emailError)
        // No interrumpimos el flujo principal si hay error en el envío del correo
      }
    }

    return data[0]
  } catch (error: any) {
    console.error("Error en updatePeritaje:", error)
    throw error
  }
}

// Función para actualizar el estado de un peritaje
export async function updatePeritajeStatus(id: string, estado: string) {
  try {
    console.log(`Iniciando updatePeritajeStatus para ID: ${id} con estado: ${estado}...`)

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Actualizar el estado del peritaje
    const { data, error } = await supabase.from("peritajes").update({ estado }).eq("id", id).select()

    if (error) {
      console.error(`Error al actualizar estado del peritaje con ID ${id}:`, error)
      throw new Error(`Error al actualizar estado: ${error.message}`)
    }

    console.log(`Estado del peritaje actualizado:`, data)
    return data[0]
  } catch (error: any) {
    console.error("Error en updatePeritajeStatus:", error)
    throw error
  }
}

// Función para obtener peritajes completados
export async function fetchPeritajesCompletados() {
  try {
    console.log("Iniciando fetchPeritajesCompletados...")

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes filtrando por estado completado y cancelado
    const { data, error } = await supabase
      .from("peritajes")
      .select("*")
      .in("estado", ["completado", "cancelado"])
      .order("fecha_turno", { ascending: false })

    if (error) {
      console.error("Error al consultar peritajes completados:", error)
      throw new Error(`Error al obtener peritajes completados: ${error.message}`)
    }

    console.log(`Peritajes completados obtenidos: ${data?.length || 0}`)
    return data || []
  } catch (error: any) {
    console.error("Error en fetchPeritajesCompletados:", error)
    throw error
  }

}

// Función para verificar si un horario está disponible
export async function checkAppointmentAvailability(fecha: string, hora: string): Promise<boolean> {
  try {
    console.log(`Verificando disponibilidad para ${fecha} ${hora}...`)

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes para verificar si ya existe una cita en ese horario
    const { data, error } = await supabase
      .from("peritajes")
      .select("id")
      .eq("fecha_turno", fecha)
      .eq("hora_turno", hora)
      .eq("estado", "pendiente")

    if (error) {
      console.error("Error al verificar disponibilidad:", error)
      throw new Error(`Error al verificar disponibilidad: ${error.message}`)
    }

    // Si hay datos, significa que el horario está ocupado
    return data.length === 0
  } catch (error: any) {
    console.error("Error en checkAppointmentAvailability:", error)
    throw error
  }
}

// Función para obtener los horarios disponibles para una fecha específica
export async function getAvailableTimes(fecha: string): Promise<string[]> {
  try {
    console.log(`Obteniendo horarios disponibles para ${fecha}...`)

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes para obtener los horarios ocupados
    const { data, error } = await supabase
      .from("peritajes")
      .select("hora_turno")
      .eq("fecha_turno", fecha)
      .eq("estado", "pendiente")

    if (error) {
      console.error("Error al obtener horarios ocupados:", error)
      throw new Error(`Error al obtener horarios ocupados: ${error.message}`)
    }

    // Lista de todos los horarios posibles
    const allTimes = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ]

    // Obtener los horarios ocupados
    const occupiedTimes = data.map(peritaje => peritaje.hora_turno)

    // Filtrar los horarios disponibles
    const availableTimes = allTimes.filter(time => !occupiedTimes.includes(time))

    return availableTimes
  } catch (error: any) {
    console.error("Error en getAvailableTimes:", error)
    throw error
  }
}