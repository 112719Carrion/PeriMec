"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

// Tipo para el contexto de autenticación
type AuthContextType = {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
}

// Crear el contexto
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
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Comprobar si hay una sesión activa al cargar
  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true)

      // Obtener la sesión actual
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      // Configurar el listener para cambios en la autenticación
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
      })

      setIsLoading(false)

      // Limpiar el listener al desmontar
      return () => {
        subscription.unsubscribe()
      }
    }

    getInitialSession()
  }, [])

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Iniciando sesión con:", email, password)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
        console.error("Error al iniciar sesión:", error)  
      }
      console.log("Sesión iniciada con éxito")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para registrarse
  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
