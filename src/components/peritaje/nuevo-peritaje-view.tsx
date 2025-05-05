"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Avatar } from "@/src/components/ui/avatar"

// Tipos de peritaje disponibles
const tiposPeritaje = [
  {
    id: "basico",
    titulo: "Peritaje básico",
    icono: "A",
    indicaciones: "Indicaciones del sevicio",
    descripcion: "en este servicio se busca ver motor",
    detalles: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    imagen: "/car-tire-check.png",
  },
  {
    id: "medio",
    titulo: "Peritaje medio",
    icono: "A",
    indicaciones: "Indicaciones del sevicio",
    descripcion: "en este servicio se busca ver motor e exterior",
    detalles: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    imagen: "/laboratory-analysis.png",
  },
  {
    id: "detallado",
    titulo: "Peritaje detallado",
    icono: "A",
    indicaciones: "Indicaciones del sevicio",
    descripcion: "en este servicio se busca ver todo los que tiene el auto",
    detalles: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    imagen: "/vintage-clockwork-mechanism.png",
  },
]

// Horarios disponibles para agendar
const horariosDisponibles = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

export default function NuevoPeritajeView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPeritaje, setSelectedPeritaje] = useState<string | null>(null)
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  // Función para abrir el diálogo de calendario
  const handleAgendarTurno = (peritajeId: string) => {
    setSelectedPeritaje(peritajeId)
    setDialogOpen(true)
  }

  // Función para confirmar la reserva
  const handleConfirmarReserva = () => {
    if (selectedDate && selectedTime) {
      setDialogOpen(false)
      setConfirmationOpen(true)
      // Aquí se podría implementar la lógica para guardar la reserva en la base de datos
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Peritaje</h1>
      </div>
      <div className="border-b pb-2">
        <p className="text-muted-foreground">Seleccione el tipo de peritaje que desea realizar y agende un turno.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiposPeritaje.map((peritaje) => (
          <Card key={peritaje.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 flex flex-row items-center gap-3 pb-2">
              <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                <span>{peritaje.icono}</span>
              </Avatar>
              <CardTitle className="text-lg">{peritaje.titulo}</CardTitle>
            </CardHeader>
            <div className="aspect-video bg-muted/50 flex items-center justify-center">
              <img
                src={peritaje.imagen || "/placeholder.svg"}
                alt={peritaje.titulo}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-medium">{peritaje.indicaciones}</h3>
              <p className="text-sm text-muted-foreground">{peritaje.descripcion}</p>
              <p className="mt-2 text-sm">{peritaje.detalles}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAgendarTurno(peritaje.id)}>
                Agendar turno
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Diálogo para seleccionar fecha y hora */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar turno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => {
                  // Deshabilitar fechas pasadas y fines de semana
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const day = date.getDay()
                  return date < today || day === 0 || day === 6
                }}
              />
              <div className="w-full space-y-2">
                <label className="text-sm font-medium">Seleccione un horario:</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horario" />
                  </SelectTrigger>
                  <SelectContent>
                    {horariosDisponibles.map((horario) => (
                      <SelectItem key={horario} value={horario}>
                        {horario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarReserva} disabled={!selectedDate || !selectedTime}>
              Confirmar reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserva confirmada</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Su peritaje ha sido agendado correctamente para:</p>
            <div className="mt-2 p-4 bg-muted rounded-md">
              <p className="font-medium">
                {selectedDate?.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>Hora: {selectedTime}</p>
              <p className="mt-2">Tipo: {tiposPeritaje.find((p) => p.id === selectedPeritaje)?.titulo}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setConfirmationOpen(false)}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
