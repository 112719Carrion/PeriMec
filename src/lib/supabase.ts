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

// Función para crear el cliente de Supabase
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Crear el cliente solo si las variables están definidas
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  // Si las variables no están definidas, devolver un objeto con métodos vacíos
  // para evitar errores en tiempo de ejecución
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  // Crear el cliente solo si las variables están definidas
  if (supabaseUrl && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey)
  }

  // Si las variables no están definidas, devolver null
  return null
}
