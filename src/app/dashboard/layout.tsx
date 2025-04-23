"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import AppLayout from "@/components/app-layout"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // No mostrar nada si no está autenticado (mientras se redirige)
  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayout userName={user?.name} onLogout={logout}>
      {children}
    </AppLayout>
  )
}
