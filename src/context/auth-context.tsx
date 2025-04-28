"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/src/lib/supabase"
import type { SupabaseUser } from "@/src/lib/supabase"

// Tipo para el contexto de autenticación
type AuthContextType = {
  user: SupabaseUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

// Creamos el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Proveedor del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Comprobar la sesión actual al cargar
  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true)

      try {
        // Obtener la sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Actualizar el estado con el usuario de la sesión
        if (session?.user) {
          setUser(session.user as SupabaseUser)
        }
      } catch (error) {
        console.error("Error al obtener la sesión:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as SupabaseUser) || null)
      setIsLoading(false)
    })

    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Error al iniciar sesión:", error)
        return { success: false, message: "Credenciales inválidas" }
      }

      return { success: true, user: data?.user || null }
    } catch (error) {
      console.error("Error inesperado al iniciar sesión:", error)
      return { success: false, message: "Error al procesar el inicio de sesión" }
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true)
      console.log("Cerrando sesión...")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error al cerrar sesión:", error)
        throw error
      }

      // Asegurarnos de que el usuario se establece a null
      setUser(null)
      console.log("Sesión cerrada correctamente")
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
