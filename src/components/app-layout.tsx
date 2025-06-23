"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, FileText, Settings } from "lucide-react"

import { Button } from "@/src/components/ui/button"
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
    <div className="flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {currentSidebarItems.length > 0 && (
          <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 h-254">
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
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-hidden">{children}</main>
      </div>
    </div>
  )
}
