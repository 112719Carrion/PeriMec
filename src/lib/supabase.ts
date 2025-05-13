import { createClient } from "@supabase/supabase-js"

// Tipos para el usuario de Supabase
export type SupabaseUser = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    phone?: string
  }
}

// Variable para almacenar la instancia única del cliente
let supabaseInstance: ReturnType<typeof createClient> | null = null
let serviceClientInstance: ReturnType<typeof createClient> | null = null

// Función para crear el cliente de Supabase (patrón singleton)
const createSupabaseClient = () => {
  // Si ya existe una instancia, la devolvemos
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Crear el cliente solo si las variables están definidas
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "supabase-auth", // Clave única para el almacenamiento
      },
    })
    return supabaseInstance
  }

  // Si las variables no están definidas, devolver un objeto con métodos vacíos
  // para evitar errores en tiempo de ejecución
  console.warn("Variables de entorno de Supabase no configuradas correctamente")
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: null, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      verifyOtp: async () => ({ data: { user: null }, error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ error: null }),
    },
  }
}

// Exportar el cliente de Supabase
export const supabase = createSupabaseClient()

// Cliente para el servidor con la clave de servicio (para operaciones privilegiadas)
export const createServiceClient = () => {
  // Si ya existe una instancia, la devolvemos (solo en el servidor)
  if (typeof window === "undefined" && serviceClientInstance) {
    return serviceClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ""

  // Verificar y mostrar información de depuración
  console.log("Supabase URL:", supabaseUrl ? "Definido" : "No definido")
  console.log("Supabase Service Key:", supabaseServiceKey ? "Definido" : "No definido")

  // Crear el cliente solo si las variables están definidas
  if (supabaseUrl && supabaseServiceKey) {
    // En el servidor, podemos almacenar la instancia
    if (typeof window === "undefined") {
      serviceClientInstance = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false, // No necesitamos persistir la sesión para el cliente de servicio
        },
      })
      return serviceClientInstance
    }

    // En el cliente, creamos una nueva instancia cada vez (no debería ocurrir)
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  // Si las variables no están definidas, mostrar un error más descriptivo
  console.error("Error: Variables de entorno para el cliente de servicio no definidas correctamente")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Definido" : "No definido")
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "Definido" : "No definido")

  // Devolver null para que el código que llama a esta función pueda manejar el error
  return null
}
