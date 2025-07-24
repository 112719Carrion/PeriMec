"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { FileText, RefreshCw, DollarSign } from "lucide-react"
import { fetchPeritajesPendientes } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import type { PeritajeData } from "@/src/lib/peritajes/peritaje"
import PaymentEdit from "./payment-edit"
import { DateRange } from "react-day-picker"
import { addDays, isAfter, isBefore } from "date-fns"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { cn } from "@/src/lib/utils"
import { format as formatDateFns } from "date-fns"

export default function PaymentsAdmin() {
  const router = useRouter()
  const { toast } = useToast()
  const [peritajes, setPeritajes] = useState<PeritajeData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeritaje, setSelectedPeritaje] = useState<PeritajeData | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [tipoPago, setTipoPago] = useState<"efectivo" | "mercado_pago">("efectivo")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined })

  // Cargar los peritajes pendientes o por tipo de pago
  const loadPeritajes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPeritajesPendientes(tipoPago === "efectivo")
      // Filtrar por rango de fechas si está definido
      const filtrados = data.filter(p => {
        if (!dateRange?.from && !dateRange?.to) return true
        const fecha = parseISO(p.fecha_turno)
        const afterFrom = dateRange.from ? !isBefore(fecha, dateRange.from) : true
        const beforeTo = dateRange.to ? !isAfter(fecha, dateRange.to) : true
        return afterFrom && beforeTo
      })
      setPeritajes(filtrados)
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
  }, [tipoPago, dateRange, toast])

  // Cargar los peritajes al montar el componente
  useEffect(() => {
    loadPeritajes()
  }, [loadPeritajes])

  // Abrir el formulario de edición
  const handleEditPeritaje = (peritaje: PeritajeData) => {
    setSelectedPeritaje(peritaje)
    setIsFormOpen(true)
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
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="container mx-auto py-6">
      {/* Filtros dentro de una tarjeta */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra los pagos por tipo y rango de fechas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de pago</label>
              <select
                className="border rounded px-2 py-1"
                value={tipoPago}
                onChange={e => setTipoPago(e.target.value as any)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="mercado_pago">Mercado Pago</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rango de fechas</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "w-[260px] justify-start text-left font-normal border rounded px-2 py-1",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    {dateRange?.from ?
                      dateRange.to
                        ? `${formatDateFns(dateRange.from, "dd/MM/yyyy")} - ${formatDateFns(dateRange.to, "dd/MM/yyyy")}`
                        : formatDateFns(dateRange.from, "dd/MM/yyyy")
                      : "Seleccionar rango"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={loadPeritajes} disabled={loading} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Fin filtros */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Pagos registrados</CardTitle>
            <CardDescription>Lista de pagos en {tipoPago === "efectivo" ? "efectivo" : "Mercado pago"}.</CardDescription>
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
              <p className="text-lg font-medium">No hay peritajes pendientes</p>
              <p className="text-sm text-muted-foreground">
                Cuando se agende un nuevo peritaje, aparecerá en esta lista
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
                  {tipoPago === "efectivo" && (
                  <TableHead>Estado</TableHead>
                  )}
                  {tipoPago === "efectivo" && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {peritajes.map((peritaje) => (
                  <TableRow key={peritaje.id}>
                    <TableCell>{formatDate(peritaje.fecha_turno)}</TableCell>
                    <TableCell>{peritaje.hora_turno}</TableCell>
                    <TableCell>{peritaje.nombre_propietario}</TableCell>
                    <TableCell>{peritaje.telefono_propietario}</TableCell>
                    <TableCell>{peritaje.email_propietario}</TableCell>
                    <TableCell>
                      {tipoPago === "efectivo" && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pendiente
                      </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tipoPago === "efectivo" && (
                        <Button
                          onClick={() => handleEditPeritaje(peritaje)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <DollarSign className="h-4 w-4" />
                          <span className="sr-only">Impactar pago</span>
                        </Button>
                      )}
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
            <DialogTitle>Impactar Pago</DialogTitle>
            <DialogDescription>Formulario para registrar el pago del peritaje seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedPeritaje && (
            <PaymentEdit
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
