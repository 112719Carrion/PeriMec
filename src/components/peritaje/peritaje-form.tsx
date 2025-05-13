"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Calendar, Clock } from "lucide-react"
import { createPeritaje } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import PerimiecConfirmacion from "@/emails"

// Esquema de validación para el formulario
// Solo los campos del propietario son obligatorios
const formSchema = z.object({
  // Campos del propietario - obligatorios
  nombre_propietario: z.string().min(1, "El nombre del propietario es requerido"),
  telefono_propietario: z.string().min(1, "El teléfono del propietario es requerido"),
  email_propietario: z.string().email("Debe ser un email válido"),
})

type FormValues = z.infer<typeof formSchema>

interface PeritajeFormProps {
  appointmentDetails: {
    fecha: string
    hora: string
  }
}

export default function PeritajeForm({ appointmentDetails }: PeritajeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Formatear la fecha para mostrarla
  const formattedDate = appointmentDetails.fecha
    ? format(parse(appointmentDetails.fecha, "yyyy-MM-dd", new Date()), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
    : ""

  // Inicializar el formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_propietario: "",
      telefono_propietario: "",
      email_propietario: "",
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // Crear el objeto de peritaje con los datos del formulario y la cita
      const peritajeData = {
        // Datos del propietario del formulario
        ...data,
        // Valores por defecto para los campos del vehículo
        marca: "Pendiente",
        modelo: "Pendiente",
        anio: "Pendiente",
        patente: "Pendiente",
        kilometraje: "Pendiente",
        color: "Pendiente",
        tipo_combustible: "Pendiente",
        observaciones: "",
        // Datos de la cita
        fecha_turno: appointmentDetails.fecha,
        hora_turno: appointmentDetails.hora,
        estado: "pendiente",
      }

      // Llamar a la función para crear el peritaje en la base de datos
      await createPeritaje(peritajeData)

      // Mostrar mensaje de éxito
      toast({
        title: "Peritaje agendado",
        description: "El peritaje ha sido agendado correctamente",
      })
      // Enviar el email de confirmación
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email_propietario,
          userFirstname: data.nombre_propietario,
          fecha: appointmentDetails.fecha,
          hora: appointmentDetails.hora,
        }),
      })

      // Redirigir a la página de peritajes
      router.push("/peritaje/informes")
    } catch (error) {
      console.error("Error al crear el peritaje:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al agendar el peritaje. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Formulario de Peritaje</CardTitle>
        <CardDescription>
          Complete los datos del propietario para agendar el peritaje. Los datos del vehículo se completarán durante la
          inspección.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mostrar detalles de la cita */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-black">
          <h3 className="text-md font-medium mb-2">Detalles del turno:</h3>
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <p className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formattedDate}
            </p>
            <p className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {appointmentDetails.hora} hs
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Datos del propietario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre_propietario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono_propietario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 1123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email_propietario"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: juan@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar peritaje"}
        </Button>
      </CardFooter>
    </Card>
  )
}
