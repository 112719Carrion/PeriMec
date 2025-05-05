"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/src/lib/supabase"
import type { SupabaseUser } from "@/src/lib/supabase"

// Tipo para el perfil del usuario
type UserProfile = {
  id: string
  role: "admin" | "perito" | "user"
  full_name?: string
  updated_at?: string
}

// Tipo para el contexto de autenticación
type AuthContextType = {
  user: SupabaseUser | null
  profile: UserProfile | null // Añadido: perfil del usuario
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean // Añadido: verificación de rol admin
  isPerito: boolean // Añadido: verificación de rol perito
  isUser: boolean // Añadido: verificación de rol user
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
  const [profile, setProfile] = useState<UserProfile | null>(null) // Añadido: estado para el perfil
  const [isLoading, setIsLoading] = useState(true)

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, full_name, updated_at")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error al cargar el perfil:", error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error("Error inesperado al cargar el perfil:", error)
      return null
    }
  }

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
          
          // Cargar el perfil del usuario
          const userProfile = await loadUserProfile(session.user.id)
          setProfile(userProfile)
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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = (session?.user as SupabaseUser) || null
      setUser(currentUser)
      
      // Actualizar el perfil cuando cambia el usuario
      if (currentUser) {
        const userProfile = await loadUserProfile(currentUser.id)
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
      
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

      // Cargar el perfil después de iniciar sesión
      if (data?.user) {
        const userProfile = await loadUserProfile(data.user.id)
        setProfile(userProfile)
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

      // Asegurarnos de que el usuario y el perfil se establecen a null
      setUser(null)
      setProfile(null)
      console.log("Sesión cerrada correctamente")
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Verificación de roles basada en el perfil
  const isAdmin = profile?.role === "admin"
  const isPerito = profile?.role === "perito"
  const isUser = profile?.role === "user"


  const value = {
    user,
    profile, // Añadido: perfil del usuario
    isAuthenticated: !!user,
    isLoading,
    isAdmin, // Añadido: verificación de rol admin
    isPerito, // Añadido: verificación de rol perito
    isUser, // Añadido: verificación de rol user
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}