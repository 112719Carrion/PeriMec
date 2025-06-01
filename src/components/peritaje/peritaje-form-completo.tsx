"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/src/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { updatePeritaje } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import type { PeritajeData } from "@/src/lib/peritajes/peritaje"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"

// Esquema de validación para el formulario completo
// Todos los campos son obligatorios
const formSchema = z.object({
  // Campos del vehículo
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  anio: z
    .string()
    .min(1, "El año es requerido")
    .regex(/^\d{4}$/, "Debe ser un año válido"),
  patente: z.string().min(1, "La patente es requerida"),
  kilometraje: z.string().min(1, "El kilometraje es requerido").regex(/^\d+$/, "Debe ser un número"),
  color: z.string().min(1, "El color es requerido"),
  tipo_combustible: z.string().min(1, "El tipo de combustible es requerido"),
  observaciones: z.string().optional(),

  // Campos del propietario
  nombre_propietario: z.string().min(1, "El nombre del propietario es requerido"),
  telefono_propietario: z.string().min(1, "El teléfono del propietario es requerido"),
  email_propietario: z.string().email("Debe ser un email válido"),

  // Estado del peritaje
  estado: z.string().min(1, "El estado es requerido"),

  // Campos de evaluación del vehículo
  estado_general: z.string().min(1, "El estado general es requerido"),
  carroceria: z.string().min(1, "La evaluación de la carrocería es requerida"),
  pintura: z.string().min(1, "La evaluación de la pintura es requerida"),
  motor: z.string().min(1, "La evaluación del motor es requerida"),
  transmision: z.string().min(1, "La evaluación de la transmisión es requerida"),
  frenos: z.string().min(1, "La evaluación de los frenos es requerida"),
  suspension: z.string().min(1, "La evaluación de la suspensión es requerida"),
  sistema_electrico: z.string().min(1, "La evaluación del sistema eléctrico es requerida"),
  interior: z.string().min(1, "La evaluación del interior es requerida"),
  neumaticos: z.string().min(1, "La evaluación de los neumáticos es requerida"),

  // Campo opcional para la conclusión
  conclusion: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PeritajeFormCompletoProps {
  peritaje: PeritajeData
  onClose: () => void
  onSuccess: () => void
}

export default function PeritajeFormCompleto({ peritaje, onClose, onSuccess }: PeritajeFormCompletoProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar el formulario con los datos del peritaje
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marca: peritaje.marca,
      modelo: peritaje.modelo,
      anio: peritaje.anio,
      patente: peritaje.patente,
      kilometraje: peritaje.kilometraje,
      color: peritaje.color,
      tipo_combustible: peritaje.tipo_combustible,
      observaciones: peritaje.observaciones || "",
      nombre_propietario: peritaje.nombre_propietario,
      telefono_propietario: peritaje.telefono_propietario,
      email_propietario: peritaje.email_propietario,
      estado: peritaje.estado,
      // Campos de evaluación con valores por defecto si no existen
      estado_general: peritaje.estado_general || "bueno",
      carroceria: peritaje.carroceria || "bueno",
      pintura: peritaje.pintura || "bueno",
      motor: peritaje.motor || "bueno",
      transmision: peritaje.transmision || "bueno",
      frenos: peritaje.frenos || "bueno",
      suspension: peritaje.suspension || "bueno",
      sistema_electrico: peritaje.sistema_electrico || "bueno",
      interior: peritaje.interior || "bueno",
      neumaticos: peritaje.neumaticos || "bueno",
      conclusion: peritaje.conclusion || "",
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // Actualizar el peritaje en la base de datos
      await updatePeritaje(peritaje.id!, data)

      // Notificar éxito
      toast({
        title: "Peritaje actualizado",
        description: "El peritaje ha sido actualizado correctamente.",
      })

      // Cerrar el formulario y notificar éxito
      onClose()
      onSuccess()
    } catch (error) {
      console.error("Error al actualizar peritaje:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el peritaje. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Opciones para los selectores de estado
  const estadoOptions = ["excelente", "bueno", "regular", "malo", "crítico"]

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4">Editar Peritaje</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <Tabs defaultValue="vehiculo" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="vehiculo">Vehículo</TabsTrigger>
                <TabsTrigger value="propietario">Propietario</TabsTrigger>
                <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
              </TabsList>

              <TabsContent value="vehiculo" className="space-y-4">
                <h3 className="text-lg font-medium">Datos del vehículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Toyota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Corolla" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="anio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 2020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kilometraje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilometraje</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Blanco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipo_combustible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de combustible</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el tipo de combustible" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nafta">Nafta</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="gnc">GNC</SelectItem>
                            <SelectItem value="electrico">Eléctrico</SelectItem>
                            <SelectItem value="hibrido">Híbrido</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado del peritaje</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="en_proceso">En proceso</SelectItem>
                            <SelectItem value="completado">Completado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese cualquier observación relevante sobre el vehículo"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="propietario" className="space-y-4">
                <h3 className="text-lg font-medium">Datos del propietario</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: juan@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="evaluacion" className="space-y-4">
                <h3 className="text-lg font-medium">Evaluación del vehículo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="estado_general"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado general</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carroceria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carrocería</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pintura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pintura</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transmision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmisión</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frenos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frenos</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="suspension"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suspensión</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sistema_electrico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sistema eléctrico</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interior</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="neumaticos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Neumáticos</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadoOptions.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="conclusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conclusión</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese una conclusión general sobre el estado del vehículo"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
