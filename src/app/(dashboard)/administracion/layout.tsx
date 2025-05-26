import type React from "react"
import AppLayout from "@/src/components/app-layout"

export default function AdministracionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Elementos específicos para la sección de Administración
  const adminSidebarItems = [
    { name: "Usuarios", href: "/administracion" },
    { name: "Configuración", href: "/administracion/configuracion" },
    { name: "Reportes", href: "/administracion/reportes" },
    { name: "Pagos", href: "/administracion/pagos" },
  ]

  return <AppLayout sidebarItems={adminSidebarItems}>{children}</AppLayout>
}
