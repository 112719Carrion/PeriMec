"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Pencil, FileText, RefreshCw, Download, Eye, CalendarIcon, Search, X } from "lucide-react"
import { fetchPeritajesCompletados } from "@/src/lib/peritajes/peritaje"
import { generatePeritajePDF } from "@/src/lib/pdf/generate-pdf"
import { useToast } from "@/src/hooks/use-toast"
import type { PeritajeForPDF } from "@/src/lib/pdf/generate-pdf"
import PeritajeCompletoView from "./peritaje-completo-view"
import { cn } from "@/src/lib/utils"

export default function PeritajesCompletadosView() {
  const router = useRouter()
  const { toast } = useToast()
  const [peritajes, setPeritajes] = useState<PeritajeForPDF[]>([])
  const [filteredPeritajes, setFilteredPeritajes] = useState<PeritajeForPDF[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeritaje, setSelectedPeritaje] = useState<PeritajeForPDF | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Establecer isClient a true cuando el componente se monte
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Cargar los peritajes completados
  const loadPeritajes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPeritajesCompletados()
      setPeritajes(data)
      setFilteredPeritajes(data)
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
  }, [toast])

  // Cargar los peritajes al montar el componente
  useEffect(() => {
    if (isClient) {
      loadPeritajes()
    }
  }, [isClient, loadPeritajes])

  // Filtrar peritajes cuando cambia el término de búsqueda o la fecha
  useEffect(() => {
    let filtered = [...peritajes]

    // Filtrar por término de búsqueda (nombre, email, teléfono o patente)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (peritaje) =>
          peritaje.nombre_propietario.toLowerCase().includes(searchLower) ||
          peritaje.email_propietario.toLowerCase().includes(searchLower) ||
          peritaje.telefono_propietario.includes(searchTerm) ||
          peritaje.patente.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por fecha
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
      filtered = filtered.filter((peritaje) => peritaje.fecha_turno === selectedDateStr)
    }

    setFilteredPeritajes(filtered)
  }, [searchTerm, selectedDate, peritajes])

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDate(undefined)
  }

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
            <CardDescription>Lista de peritajes finalizados y cancelados</CardDescription>
          </div>
          <Button onClick={loadPeritajes} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, teléfono o patente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {(searchTerm || selectedDate) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </div>

          {filteredPeritajes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">
                {peritajes.length === 0
                  ? "No hay peritajes completados o cancelados"
                  : "No se encontraron resultados"}
              </p>
              <p className="text-sm text-muted-foreground">
                {peritajes.length === 0
                  ? "Cuando se complete o cancele un peritaje, aparecerá en esta lista"
                  : "Intenta con otros criterios de búsqueda"}
              </p>
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
                {filteredPeritajes.map((peritaje) => (
                  <TableRow key={peritaje.id}>
                    <TableCell>{formatDate(peritaje.fecha_turno as string)}</TableCell>
                    <TableCell>{peritaje.hora_turno}</TableCell>
                    <TableCell>{peritaje.nombre_propietario}</TableCell>
                    <TableCell>
                      {peritaje.marca} {peritaje.modelo} ({peritaje.anio})
                    </TableCell>
                    <TableCell>{peritaje.patente}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        peritaje.estado === "completado" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {peritaje.estado === "completado" ? "Completado" : "Cancelado"}
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
