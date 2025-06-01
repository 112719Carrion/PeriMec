import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { RoleContent } from "../components/role-content"
import { Img } from "@react-email/components"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Bienvenido a PeriMec</h1>
        <p className="text-xl text-muted-foreground mb-8">Sistema de gestión de peritajes y administración</p>

        <div className="grid gap-4 md:grid-cols-3 max-w-lg mx-auto">
          <Link href="/peritaje" className="w-full">
            <Button variant="outline" className="w-full">
              Peritajes
            </Button>
          </Link>
          
          <RoleContent allowedRoles={["admin"]}>
            <Link href="/administracion" className="w-full">
              <Button variant="outline" className="w-full">
                Administración
              </Button>
            </Link>
          </RoleContent>
          
          <Link href="/login" className="w-full">
            <Button className="w-full">Iniciar Sesión</Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Gestión de Peritajes</h3>
            <p className="text-muted-foreground">Administra todos los peritajes de manera eficiente y organizada.</p>
          </div>

            <div className="bg-card rounded-lg p-6 shadow-sm" >
              <h3 className="text-lg font-medium mb-2">Administración</h3>
              <p className="text-muted-foreground">Configura usuarios, permisos y parámetros del sistema.</p>
            </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-2">Reportes</h3>
            <p className="text-muted-foreground">Genera informes detallados y estadísticas de los peritajes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
