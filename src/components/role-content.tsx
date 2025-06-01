// components/role-content.tsx
"use client"

import { useAuth } from '@/src/context/auth-context'
import { ReactNode } from 'react'

type RoleContentProps = {
  children: ReactNode
  allowedRoles: Array<"admin" | "perito" | "user">
}

export function RoleContent({ children, allowedRoles }: RoleContentProps) {
  const { isAdmin, isPerito, isUser, isLoading } = useAuth()
  
  // Si está cargando, no mostrar nada
  if (isLoading) {
    return null
  }
  
  // Verificar si el usuario tiene alguno de los roles permitidos
  const hasAccess = (
    (isAdmin && allowedRoles.includes("admin")) ||
    (isPerito && allowedRoles.includes("perito")) ||
    (isUser && allowedRoles.includes("user"))
  )
  
  // Si tiene acceso, mostrar el contenido
  if (hasAccess) {
    return <>{children}</>
  }
  
  // Si no tiene acceso, no mostrar nada
  return null
}