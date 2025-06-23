import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Calendar, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { createPeritaje } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { redirectMP } from "@/src/app/actions/peritaje"

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

// Tipos para el estado del pago
type PaymentStatus = "pending" | "processing" | "approved" | "rejected"

export default function PeritajeForm({ appointmentDetails }: PeritajeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, start] = useTransition();
  const pagoEnEfectivo = useRef(false); // Cambia esto según la lógica de tu aplicación

  // **Aquí**: estado local
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormValues | null>(null)
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  // Formateo determinista usando parseISO
  const formattedDate = appointmentDetails.fecha
    ? format(parseISO(appointmentDetails.fecha), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
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
    setFormData(data) // Guardar los datos del formulario
    setShowPaymentConfirmation(true) // Mostrar la confirmación de pago
  }

  const handlePago = () => {
    start(() => {
      // Llama a la Server Action; el mensaje lo pasas aquí:
      redirectMP("Peritaje de auto");
    });
  };

  // Función para crear el pago - AQUÍ ES DONDE SE IMPLEMENTARÁ EL PAGO REAL
  const PaymentCreate = async () => {
    if (!formData) return

    setPaymentStatus("processing")
    setIsSubmitting(true)

    try {
      await processPaymentAndSave();
      
      if (!pagoEnEfectivo.current) {
          handlePago();
        }       

        if (pagoEnEfectivo.current) {
          router.push("/")
        }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setPaymentStatus("rejected")
      toast({
        title: "Error en el pago",
        description: "Ocurrió un error al procesar el pago. Por favor, intente nuevamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Función para procesar el pago y guardar en la base de datos
  const processPaymentAndSave = async () => {
    if (!formData) return

    try {
      // Crear el objeto de peritaje con los datos del formulario y la cita

      const peritajeData = {
        // Datos del propietario del formulario
        ...formData,
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
        // Datos del pago (opcional)
        payment_id: paymentId ?? undefined,        
        payment_status: pagoEnEfectivo.current,//false es MP, true es efectivo
      }

      // Enviar el email de confirmación
      await fetch("/api/confirmado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email_propietario,
          userFirstname: formData.nombre_propietario,
          fecha: appointmentDetails.fecha,
          hora: appointmentDetails.hora,
        }),
      })

      // Llamar a la función para crear el peritaje en la base de datos
      await createPeritaje(peritajeData)

      // Mostrar mensaje de éxito
      toast({
        title: "Peritaje agendado",
        description: "El peritaje ha sido agendado correctamente",
      })
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
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
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

        {/* Alerta de costo del peritaje */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Información de pago</AlertTitle>
          <AlertDescription className="text-blue-700">
            El costo del peritaje es de $1000. El turno será confirmado una vez realizado el pago.
          </AlertDescription>
        </Alert>

        {showPaymentConfirmation ? (
          <div className="space-y-6">
            {paymentStatus === "pending" && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Confirmación de pago</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Para continuar con la reserva del turno, debe realizar el pago de $1000.
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === "processing" && (
              <Alert className="bg-blue-50 border-blue-200">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <AlertTitle className="text-blue-800">Procesando pago</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Su pago está siendo procesado. Por favor espere un momento.
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === "approved" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Pago aprobado</AlertTitle>
                <AlertDescription className="text-green-700">
                  El pago ha sido aprobado. Su turno ha sido reservado correctamente.
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === "rejected" && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Pago rechazado</AlertTitle>
                <AlertDescription className="text-red-700">
                  El pago ha sido rechazado. Por favor, intente nuevamente con otro método de pago.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              {paymentStatus !== "approved" && (
                <Button variant="outline" onClick={() => setShowPaymentConfirmation(false)}>
                  Volver al formulario
                </Button>
              )}

              {paymentStatus === "pending" && (
                <Button
                  type="button"
                  onClick={() => {
                    pagoEnEfectivo.current = true;
                    PaymentCreate(); // Marcamos que se pagará en efectivo
                  }}
                >
                  Abonar en efectivo
                </Button>
              )}

              {paymentStatus === "pending" && (
                <Button
                  type="button"
                  onClick={() => {
                    pagoEnEfectivo.current = false;
                    PaymentCreate(); // Se pagará con MP
                  }}
                >
                  Abonar con Mercado Pago
                </Button>
              )}


              {paymentStatus === "processing" && (
                <Button disabled={true}>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </Button>
              )}

              {paymentStatus === "approved" && (
                <Button onClick={() => router.push("/peritaje/informes")} disabled={isSubmitting}>
                  Ver mis peritajes
                </Button>
              )}

              {paymentStatus === "rejected" && (
                <Button onClick={PaymentCreate} disabled={isSubmitting}>
                  Intentar nuevamente
                </Button>
              )}
            </div>
          </div>
        ) : (
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
                          <Input
                            placeholder="Ej: Juan Pérez"
                            maxLength={50}
                            {...field}
                          />
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
                          <Input placeholder="Ej: 1123456789" maxLength={50} {...field} />
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
                          <Input placeholder="Ej: juan@ejemplo.com" maxLength={50} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Volver
                </Button>
                <Button type="submit">Continuar con el pago</Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
