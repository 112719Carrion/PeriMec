import { createServiceClient } from "@/src/lib/supabase"

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
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    console.log("Cliente de servicio creado correctamente")

    // Insertar el peritaje en la tabla de peritajes
    const { data, error } = await supabase
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
          // El usuario que crea el peritaje (se puede obtener del contexto de autenticación)
          // user_id: auth.currentUser.id,
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
    console.log("Iniciando fetchPeritajesPendiente222s...")

    // Crear el cliente de servicio
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Consultar la tabla de peritajes filtrando por estado pendiente
    const { data, error } = await supabase
      .from("peritajes")
      .select("*")
      .eq("estado", "pendiente")
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
    const supabase = createServiceClient()

    if (!supabase) {
      console.error("Error: No se pudo crear el cliente de servicio de Supabase")
      throw new Error("Error de configuración de Supabase")
    }

    // Obtener el peritaje anterior para verificar si el estado ha cambiado
    const { data: prevPeritaje, error: fetchError } = await supabase
      .from("peritajes")
      .select("estado")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error(`Error al obtener estado anterior del peritaje con ID ${id}:`, fetchError)
    }

    // Actualizar el peritaje
    const { data, error } = await supabase
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

    // Consultar la tabla de peritajes filtrando por estado completado
    const { data, error } = await supabase
      .from("peritajes")
      .select("*")
      .eq("estado", "completado")
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