"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Pencil, FileText, RefreshCw, Bell, CalendarIcon, Search, X } from "lucide-react"
import { fetchPeritajesPendientes } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import PeritajeFormCompleto from "./peritaje-form-completo"
import type { PeritajeData } from "@/src/lib/peritajes/peritaje"
import { cn } from "@/src/lib/utils"

export default function PeritajesPendientesView() {
  const { toast } = useToast()
  const [peritajes, setPeritajes] = useState<PeritajeData[]>([])
  const [filteredPeritajes, setFilteredPeritajes] = useState<PeritajeData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeritaje, setSelectedPeritaje] = useState<PeritajeData | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Cargar los peritajes pendientes
  const loadPeritajes = async () => {
    setLoading(true)
    try {
      const data = await fetchPeritajesPendientes()
      setPeritajes(data)
      setFilteredPeritajes(data)
    } catch (error) {
      console.error("Error al cargar peritajes pendientes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los peritajes pendientes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar los peritajes al montar el componente
  useEffect(() => {
    loadPeritajes()
  }, [])

  // Filtrar peritajes cuando cambia el término de búsqueda o la fecha
  useEffect(() => {
    let filtered = [...peritajes]

    // Filtrar por término de búsqueda (nombre, email o teléfono)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (peritaje) =>
          peritaje.nombre_propietario.toLowerCase().includes(searchLower) ||
          peritaje.email_propietario.toLowerCase().includes(searchLower) ||
          peritaje.telefono_propietario.includes(searchTerm)
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

  // Abrir el formulario de edición
  const handleEditPeritaje = (peritaje: PeritajeData) => {
    setSelectedPeritaje(peritaje)
    setIsFormOpen(true)
  }

  const handleRecordatorio = async (peritaje: PeritajeData) => {
    setSelectedPeritaje(peritaje)
    await fetch("/api/recordatorio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clienteEmail: peritaje.email_propietario,
      clienteNombre: peritaje.nombre_propietario,
      fechaPeritaje: peritaje.fecha_turno,
    }),
  })
  }



  // Cerrar el formulario de edición
  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedPeritaje(null)
  }

  // Manejar la actualización exitosa de un peritaje
  const handlePeritajeUpdated = () => {
    loadPeritajes() // Recargar la lista de peritajes
    setIsFormOpen(false)
    setSelectedPeritaje(null)
    toast({
      title: "Peritaje actualizado",
      description: "El peritaje ha sido actualizado correctamente",
    })
  }

  // Formatear la fecha para mostrarla
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: es })
    } catch {
      return dateString
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Peritajes Pendientes</CardTitle>
            <CardDescription>Lista de peritajes pendientes de completar</CardDescription>
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
                placeholder="Buscar por nombre, email o teléfono..."
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
                  ? "No hay peritajes pendientes"
                  : "No se encontraron resultados"}
              </p>
              <p className="text-sm text-muted-foreground">
                {peritajes.length === 0
                  ? "Cuando se agende un nuevo peritaje, aparecerá en esta lista"
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
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Recordatorio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeritajes.map((peritaje) => (
                  <TableRow key={peritaje.id}>
                    <TableCell>{formatDate(peritaje.fecha_turno)}</TableCell>
                    <TableCell>{peritaje.hora_turno}</TableCell>
                    <TableCell>{peritaje.nombre_propietario}</TableCell>
                    <TableCell>{peritaje.telefono_propietario}</TableCell>
                    <TableCell>{peritaje.email_propietario}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        peritaje.estado === "pendiente" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {peritaje.estado === "pendiente" ? "Pendiente" : "En proceso"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => handleRecordatorio(peritaje)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notificar</span>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleEditPeritaje(peritaje)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo con el formulario completo */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Editar Peritaje</DialogTitle>
            <DialogDescription>Formulario para editar los datos del peritaje seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedPeritaje && (
            <PeritajeFormCompleto
              peritaje={selectedPeritaje}
              onClose={handleCloseForm}
              onSuccess={handlePeritajeUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
