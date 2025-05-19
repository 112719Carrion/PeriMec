"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, ArrowLeft, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import PDFPreview from "./pdf-preview"
import { generatePeritajePDF, type PeritajeForPDF } from "@/src/lib/pdf/generate-pdf"

interface PeritajeCompletoViewProps {
  peritaje: PeritajeForPDF
}

export default function PeritajeCompletoView({ peritaje }: PeritajeCompletoViewProps) {
  const router = useRouter()
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [formattedDate, setFormattedDate] = useState<string>("")

  // Establecer isClient a true cuando el componente se monte en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Formatear la fecha solo cuando el componente esté montado y peritaje exista
  useEffect(() => {
    if (isClient && peritaje && peritaje.fecha_turno) {
      try {
        const date = typeof peritaje.fecha_turno === "string" ? new Date(peritaje.fecha_turno) : peritaje.fecha_turno
        setFormattedDate(format(date, "dd 'de' MMMM 'de' yyyy", { locale: es }))
      } catch (error) {
        console.error("Error al formatear la fecha:", error)
        setFormattedDate("Fecha inválida")
      }
    } else {
      setFormattedDate("Fecha no disponible")
    }
  }, [isClient, peritaje])

  // Manejar la generación del PDF
  const handleGeneratePDF = async () => {
    if (!peritaje) return

    try {
      setIsGeneratingPDF(true)
      await generatePeritajePDF(peritaje)
    } catch (error) {
      console.error("Error al generar PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Manejar la vista previa del PDF
  const handlePreviewPDF = () => {
    setIsPDFPreviewOpen(true)
  }

  // Si no estamos en el cliente o no hay peritaje, mostrar un esqueleto
  if (!isClient || !peritaje) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              Vista previa
            </Button>
            <Button disabled>
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Cargando peritaje...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Vista previa
          </Button>
          <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
            <Download className={`mr-2 h-4 w-4 ${isGeneratingPDF ? "animate-spin" : ""}`} />
            {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Peritaje #{peritaje.id.substring(0, 8)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fecha del peritaje</h3>
              <p>{formattedDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Hora</h3>
              <p>{peritaje.hora_turno}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
              <p className="capitalize">{peritaje.estado}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vehiculo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehiculo">Datos del vehículo</TabsTrigger>
          <TabsTrigger value="propietario">Datos del propietario</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="vehiculo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Marca</h3>
                  <p>{peritaje.marca}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Modelo</h3>
                  <p>{peritaje.modelo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Año</h3>
                  <p>{peritaje.anio}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Patente</h3>
                  <p>{peritaje.patente}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Color</h3>
                  <p>{peritaje.color}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Kilometraje</h3>
                  <p>{peritaje.kilometraje} km</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de combustible</h3>
                  <p className="capitalize">{peritaje.tipo_combustible}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propietario" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del propietario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p>{peritaje.nombre_propietario}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                  <p>{peritaje.telefono_propietario}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{peritaje.email_propietario}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados del peritaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {peritaje.estado_general && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Estado general</h3>
                    <p className="capitalize">{peritaje.estado_general}</p>
                  </div>
                )}
                {peritaje.carroceria && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Carrocería</h3>
                    <p className="capitalize">{peritaje.carroceria}</p>
                  </div>
                )}
                {peritaje.pintura && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Pintura</h3>
                    <p className="capitalize">{peritaje.pintura}</p>
                  </div>
                )}
                {peritaje.motor && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Motor</h3>
                    <p className="capitalize">{peritaje.motor}</p>
                  </div>
                )}
                {peritaje.transmision && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Transmisión</h3>
                    <p className="capitalize">{peritaje.transmision}</p>
                  </div>
                )}
                {peritaje.frenos && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Frenos</h3>
                    <p className="capitalize">{peritaje.frenos}</p>
                  </div>
                )}
                {peritaje.suspension && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Suspensión</h3>
                    <p className="capitalize">{peritaje.suspension}</p>
                  </div>
                )}
                {peritaje.sistema_electrico && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Sistema eléctrico</h3>
                    <p className="capitalize">{peritaje.sistema_electrico}</p>
                  </div>
                )}
                {peritaje.interior && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Interior</h3>
                    <p className="capitalize">{peritaje.interior}</p>
                  </div>
                )}
                {peritaje.neumaticos && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Neumáticos</h3>
                    <p className="capitalize">{peritaje.neumaticos}</p>
                  </div>
                )}
              </div>

              {peritaje.observaciones && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Observaciones</h3>
                  <p className="whitespace-pre-line">{peritaje.observaciones}</p>
                </div>
              )}

              {peritaje.conclusion && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Conclusión</h3>
                  <p className="whitespace-pre-line">{peritaje.conclusion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de vista previa del PDF */}
      {isClient && peritaje && (
        <PDFPreview peritaje={peritaje} open={isPDFPreviewOpen} onClose={() => setIsPDFPreviewOpen(false)} />
      )}
    </div>
  )
}
