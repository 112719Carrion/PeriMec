"use server"
import { supabase } from "@/src/lib/supabase"

// Tipo para los datos del formulario de registro
type RegisterFormData = {
  fullName: string
  phone: string
  email: string
  password: string
}

// Función para registrar un nuevo usuario con Supabase
export async function registerUser(formData: RegisterFormData) {
  try {
    // Validaciones básicas
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      return { success: false, message: "Todos los campos son obligatorios" }
    }

    if (formData.password.length < 8) {
      return { success: false, message: "La contraseña debe tener al menos 8 caracteres" }
    }

    // Registrar usuario con Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
        // Configuramos la URL de confirmación
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/confirmar-cuenta`,
      },
    })

    if (error) {
      console.error("Error al registrar usuario:", error)

      // Manejar errores específicos
      if (error.message.includes("already registered")) {
        return { success: false, message: "Este correo electrónico ya está registrado" }
      }

      return { success: false, message: error.message }
    }

    // Si llegamos aquí, el registro fue exitoso
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al registrar usuario:", error)
    return { success: false, message: "Error al procesar el registro" }
  }
}

// Función para verificar el token de confirmación
export async function verifyConfirmationToken(token: string) {
  try {
    // Supabase maneja automáticamente la verificación del token
    // cuando el usuario hace clic en el enlace de confirmación
    // Solo necesitamos verificar si el token es válido
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    })

    if (error) {
      console.error("Error al verificar token:", error)
      return { success: false, message: error.message }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Error inesperado al verificar token:", error)
    return { success: false, message: "Error al verificar el token" }
  }
}

// Función para iniciar sesión con Supabase
export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error al iniciar sesión:", error)
      return { success: false, message: "Credenciales inválidas" }
    }

    return { success: true, user: data!.user }
  } catch (error) {
    console.error("Error inesperado al iniciar sesión:", error)
    return { success: false, message: "Error al procesar el inicio de sesión" }
  }
}

// Función para cerrar sesión
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error al cerrar sesión:", error)
      return { success: false, message: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error inesperado al cerrar sesión:", error)
    return { success: false, message: "Error al cerrar sesión" }
  }
}
