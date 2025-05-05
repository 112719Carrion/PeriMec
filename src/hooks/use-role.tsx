// hooks/use-role.tsx
'use client'

import { useSession } from 'next-auth/react'

export function useRole() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'guest'

  return {
    role: userRole,
    isAdmin: userRole === 'admin',
    isPerito: userRole === 'perito',
    isUser: userRole === 'user',
    // Función auxiliar para verificar si el usuario tiene alguno de los roles proporcionados
    hasAnyRole: (roles: string[]) => roles.includes(userRole)
  }
}