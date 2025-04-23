"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, FileText, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Elementos de la barra de navegación superior
  const navItems = [
    { name: "Inicio", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Peritaje", href: "/peritaje", icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: "Administración", href: "/administracion", icon: <Settings className="h-4 w-4 mr-2" /> },
  ]

  // Elementos predeterminados para la barra lateral
  const defaultSidebarItems: SidebarItem[] = [
    { name: "e1", href: "/e1" },
    { name: "e2", href: "/e2" },
    { name: "e3", href: "/e3" },
  ]

  // Usar los elementos proporcionados o los predeterminados
  const currentSidebarItems = sidebarItems || defaultSidebarItems

  // Cerrar menús móviles al cambiar de ruta
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex flex-1">
      {/* Barra lateral (escritorio) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex flex-col p-4 space-y-2">
          {currentSidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.name}
            </Link>
          ))}
        </div>
      </aside>

      {/* Botón para mostrar/ocultar la barra lateral en móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-40 md:hidden"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir barra lateral</span>
      </Button>

      {/* Barra lateral móvil */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Fondo oscuro */}
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileSidebarOpen(false)} aria-hidden="true" />

          {/* Barra lateral */}
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Menú</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col p-4 space-y-2">
              {currentSidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                    pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
