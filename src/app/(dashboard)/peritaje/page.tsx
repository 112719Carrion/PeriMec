import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import Link from "next/link"

export default function PeritajePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Peritajes</h1>
        <Button asChild>
          <Link href="/peritaje/nuevo">Nuevo Peritaje</Link>
        </Button>
      </div>
      <div className="border-b pb-2">
        <p className="text-muted-foreground">Gestión de peritajes y evaluaciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peritajes Pendientes</CardTitle>
            <CardDescription>Peritajes agendados pendientes de realización</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/peritaje/pendientes">Ver pendientes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peritajes Completados</CardTitle>
            <CardDescription>Peritajes realizados y finalizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/peritaje/completados">Ver completados</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informes Generados</CardTitle>
            <CardDescription>Informes de peritajes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/peritaje/informes">Ver informes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Peritajes Recientes</CardTitle>
            <CardDescription>Últimos peritajes registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">No hay peritajes recientes para mostrar</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
