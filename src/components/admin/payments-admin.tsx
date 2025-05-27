"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent } from "@/src/components/ui/dialog"
import { FileText, RefreshCw, DollarSign } from "lucide-react"
import { fetchPeritajesPendientes } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import type { PeritajeData } from "@/src/lib/peritajes/peritaje"
import PeritajeFormCompleto from "../peritaje/peritaje-form-completo"
import PaymentEdit from "./payment-edit"

export default function PaymentsAdmin() {
  const router = useRouter()
  const { toast } = useToast()
  const [peritajes, setPeritajes] = useState<PeritajeData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeritaje, setSelectedPeritaje] = useState<PeritajeData | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Cargar los peritajes pendientes
  const loadPeritajes = async () => {
    setLoading(true)
    try {
      const data = await fetchPeritajesPendientes(true)
      setPeritajes(data)
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
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Peritajes con pago pendiente</CardTitle>
            <CardDescription>Lista de peritajes pendientes de completar el pago de la seña</CardDescription>
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
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
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
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pendiente
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleEditPeritaje(peritaje)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span className="sr-only">Impactar pago</span>
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
