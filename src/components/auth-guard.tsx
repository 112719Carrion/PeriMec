"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login"]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // No hacer nada mientras se está cargando
    if (isLoading) return

    // Si la ruta es pública, permitir acceso
    if (publicRoutes.includes(pathname)) {
      // Si el usuario ya está autenticado y trata de acceder a login, redirigir al dashboard
      if (isAuthenticated && pathname === "/login") {
        router.push("/")
      }
      return
    }

    // Si no está autenticado y la ruta no es pública, redirigir a login
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Mostrar nada mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si es una ruta pública o el usuario está autenticado, mostrar los hijos
  if (publicRoutes.includes(pathname) || isAuthenticated) {
    return <>{children}</>
  }

  // No mostrar nada mientras se redirige
  return null
}
