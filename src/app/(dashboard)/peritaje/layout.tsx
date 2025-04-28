import type React from "react"
import AppLayout from "@/src/components/app-layout"

export default function PeritajeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Elementos específicos para la sección de Peritaje
  const peritajeSidebarItems = [
    { name: "Lista de Peritajes", href: "/peritaje" },
    { name: "Nuevo Peritaje", href: "/peritaje/nuevo" },
    { name: "Informes", href: "/peritaje/informes" },
  ]

  return <AppLayout sidebarItems={peritajeSidebarItems}>{children}</AppLayout>
}
