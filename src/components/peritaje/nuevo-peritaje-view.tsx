"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, CalendarIcon, CheckCircle } from "lucide-react"
import { getAvailableTimes } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"

export default function NuevoPeritajeView() {
  const router = useRouter()
  const { toast } = useToast()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleAgendarTurno = () => {
    setIsCalendarOpen(true)
  }

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined) // Reset selected time when date changes
    
    if (date) {
      setLoading(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const times = await getAvailableTimes(formattedDate)
        setAvailableTimes(times)
        
        if (times.length === 0) {
          toast({
            title: "Sin horarios disponibles",
            description: "No hay horarios disponibles para la fecha seleccionada. Por favor, seleccione otra fecha.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error al obtener horarios disponibles:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los horarios disponibles. Intente nuevamente.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleConfirmAppointment = () => {
    setIsCalendarOpen(false)
    setIsConfirmationOpen(true)
  }

  const handleContinueToForm = () => {
    // Convertir la fecha y hora seleccionadas a un formato que podamos pasar en la URL
    const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    const timeString = selectedTime || ""

    // Redirigir al formulario de peritaje con la fecha y hora como parámetros
    router.push(`/peritaje/formulario?fecha=${dateString}&hora=${timeString}`)
  }

  // Función para deshabilitar días pasados y fines de semana
  const disabledDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Deshabilitar días pasados
    if (date < today) return true

    // Deshabilitar fines de semana (0 = domingo, 6 = sábado)
    const day = date.getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Nuevo Peritaje</CardTitle>
          <CardDescription>Agenda un turno para realizar el peritaje de un vehículo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-black">
              <h3 className="text-lg font-medium mb-4">Información importante</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>El peritaje tiene una duración aproximada de 1 hora</li>
                <li>Debe presentarse con el vehículo limpio para una mejor evaluación</li>
                <li>Traiga toda la documentación del vehículo</li>
                <li>En caso de no poder asistir, cancele el turno con 24 horas de anticipación</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleAgendarTurno}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Agendar turno
          </Button>
        </CardFooter>
      </Card>

      {/* Diálogo para seleccionar fecha y hora */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agendar turno para peritaje</DialogTitle>
            <DialogDescription>Seleccione la fecha y hora para realizar el peritaje</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 items-center justify-items-center">
              <label className="text-sm font-medium">Fecha</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                initialFocus
              />
            </div>

            {selectedDate && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Hora</label>
                <Select onValueChange={handleTimeSelect} value={selectedTime} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Cargando horarios..." : "Seleccione un horario"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalendarOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmAppointment} 
              disabled={!selectedDate || !selectedTime || loading}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Turno agendado</DialogTitle>
            <DialogDescription>Su turno ha sido agendado correctamente</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Detalles del turno:</p>
              <p className="flex items-center justify-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate && format(selectedDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              <p className="flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4" />
                {selectedTime} hs
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleContinueToForm}>Continuar al formulario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
