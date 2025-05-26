"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/src/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { updatePeritaje } from "@/src/lib/peritajes/peritaje"
import { useToast } from "@/src/hooks/use-toast"
import type { PeritajeData } from "@/src/lib/peritajes/peritaje"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  senaPendiente: z.boolean(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senaPendiente: peritaje.payment_status = false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await updatePeritaje(peritaje.id!, {
        payment_status: !data.senaPendiente ? true : false
      })
      toast({
        title: "Peritaje actualizado",
        description: "El peritaje ha sido actualizado correctamente.",
      })
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

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4">Estado de la seña</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="senaPendiente"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Estado de la seña</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={value => field.onChange(value === "senado")}
                    defaultValue={field.value ? "senado" : "sin_seniar"}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="senado" />
                      </FormControl>
                      <FormLabel className="font-normal">Señado</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="sin_seniar" />
                      </FormControl>
                      <FormLabel className="font-normal">Sin señar</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
