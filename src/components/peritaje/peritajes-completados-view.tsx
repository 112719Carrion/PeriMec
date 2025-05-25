"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent } from "@/src/components/ui/dialog"
import { Pencil, FileText, RefreshCw, Download, Eye } from "lucide-react"
import { fetchPeritajesCompletados } from "@/src/lib/peritajes/peritaje"
import { generatePeritajePDF } from "@/src/lib/pdf/generate-pdf"
import { useToast } from "@/src/hooks/use-toast"
import type { PeritajeForPDF } from "@/src/lib/pdf/generate-pdf"
import PeritajeCompletoView from "./peritaje-completo-view"

export default function PeritajesCompletadosView() {
  const router = useRouter()
  const { toast } = useToast()
  const [peritajes, setPeritajes] = useState<PeritajeForPDF[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeritaje, setSelectedPeritaje] = useState<PeritajeForPDF | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Establecer isClient a true cuando el componente se monte
  useEffect(() => {
    setIsClient(true) 
  }, [])

  // Cargar los peritajes completados
  const loadPeritajes = async () => {
    setLoading(true)
    try {
      const data = await fetchPeritajesCompletados()
      setPeritajes(data)
    } catch (error) {
      console.error("Error al cargar peritajes completados:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los peritajes completados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar los peritajes al montar el componente
  useEffect(() => {
    if (isClient) {
      loadPeritajes()
    }
  }, [isClient])

  // Abrir la vista detallada del peritaje
  const handleViewPeritaje = (peritaje: PeritajeForPDF) => {
    setSelectedPeritaje(peritaje)
    setIsDetailOpen(true)
  }

  // Cerrar la vista detallada
  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedPeritaje(null)
  }

  // Generar y descargar el PDF del peritaje
  const handleDownloadPDF = async (peritaje: PeritajeForPDF) => {
    try {
      setGeneratingPDF(peritaje.id)
      await generatePeritajePDF(peritaje)
      toast({
        title: "PDF generado",
        description: "El informe de peritaje ha sido generado y descargado correctamente",
      })
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el PDF. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setGeneratingPDF(null)
    }
  }

  // Formatear la fecha para mostrarla
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Si no estamos en el cliente, mostrar un esqueleto
  if (!isClient) {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Peritajes Completados</CardTitle>
            <CardDescription>Cargando...</CardDescription>
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
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Peritajes Completados</CardTitle>
            <CardDescription>Lista de peritajes finalizados</CardDescription>
          </div>
          <Button onClick={loadPeritajes} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          {peritajes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No hay peritajes completados</p>
              <p className="text-sm text-muted-foreground">Cuando se complete un peritaje, aparecerá en esta lista</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Patente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peritajes.map((peritaje) => (
                  <TableRow key={peritaje.id}>
                    <TableCell>{formatDate(peritaje.fecha_turno as string)}</TableCell>
                    <TableCell>{peritaje.hora_turno}</TableCell>
                    <TableCell>{peritaje.nombre_propietario}</TableCell>
                    <TableCell>
                      {peritaje.marca} {peritaje.modelo} ({peritaje.anio})
                    </TableCell>
                    <TableCell>{peritaje.patente}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Completado
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleViewPeritaje(peritaje)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 mr-2"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Descargar informe"
                        onClick={() => handleDownloadPDF(peritaje)}
                        disabled={generatingPDF === peritaje.id}
                      >
                        <Download className={`h-4 w-4 ${generatingPDF === peritaje.id ? "animate-spin" : ""}`} />
                        <span className="sr-only">Descargar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo con la vista detallada */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedPeritaje && <PeritajeCompletoView peritaje={selectedPeritaje} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
