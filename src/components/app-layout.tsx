"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Settings } from "lucide-react"
import { cn } from "@/src/lib/utils"

// Tipo para los elementos del menú lateral
type SidebarItem = {
  name: string
  href: string
  icon?: React.ReactNode
}

// Props para el componente AppLayout
interface AppLayoutProps {
  children: React.ReactNode
  sidebarItems?: SidebarItem[] // Opcional: elementos del menú lateral que pueden cambiar según la ruta
}

export default function AppLayout({ children, sidebarItems }: AppLayoutProps) {
  const pathname = usePathname()

  // Elementos de la barra de navegación superior
  const navItems = [
    { name: "Inicio", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Peritaje", href: "/peritaje", icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: "Administración", href: "/administracion", icon: <Settings className="h-4 w-4 mr-2" /> },
  ]

  // Usar los elementos proporcionados o un array vacío
  const currentSidebarItems = sidebarItems || []

  return (
    <div className="h-full flex">
      {currentSidebarItems.length > 0 && (
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 flex-shrink-0 h-full">
          <div className="flex flex-col p-4 space-y-2 flex-1 overflow-y-auto">
            {currentSidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted flex items-center",
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            ))}
          </div>
        </aside>
      )}
      <main className="flex-1 h-full overflow-y-auto">
        <div className="p-4 md:p-6 min-h-full">{children}</div>
      </main>
    </div>
  )
}
