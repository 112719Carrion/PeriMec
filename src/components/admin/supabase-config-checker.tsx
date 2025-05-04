"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { Button } from "@/src/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function SupabaseConfigChecker() {
  const [status, setStatus] = useState<{
    url: boolean
    anonKey: boolean
    serviceKey: boolean
    checked: boolean
  }>({
    url: false,
    anonKey: false,
    serviceKey: false,
    checked: false,
  })

  const checkConfig = async () => {
    try {
      const response = await fetch("/api/check-supabase-config")
      const data = await response.json()

      setStatus({
        url: !!data.url,
        anonKey: !!data.anonKey,
        serviceKey: !!data.serviceKey,
        checked: true,
      })
    } catch (error) {
      console.error("Error al verificar la configuración:", error)
      setStatus({
        url: false,
        anonKey: false,
        serviceKey: false,
        checked: true,
      })
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={checkConfig} variant="outline">
        Verificar configuración de Supabase
      </Button>

      {status.checked && (
        <div className="space-y-2">
          <Alert variant={status.url ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {status.url ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>URL de Supabase</AlertTitle>
            </div>
            <AlertDescription>
              {status.url
                ? "La URL de Supabase está configurada correctamente."
                : "La URL de Supabase no está configurada. Verifique la variable de entorno NEXT_PUBLIC_SUPABASE_URL."}
            </AlertDescription>
          </Alert>

          <Alert variant={status.anonKey ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {status.anonKey ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>Clave anónima de Supabase</AlertTitle>
            </div>
            <AlertDescription>
              {status.anonKey
                ? "La clave anónima de Supabase está configurada correctamente."
                : "La clave anónima de Supabase no está configurada. Verifique la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY."}
            </AlertDescription>
          </Alert>

          <Alert variant={status.serviceKey ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {status.serviceKey ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>Clave de servicio de Supabase</AlertTitle>
            </div>
            <AlertDescription>
              {status.serviceKey
                ? "La clave de servicio de Supabase está configurada correctamente."
                : "La clave de servicio de Supabase no está configurada. Verifique la variable de entorno SUPABASE_SERVICE_ROLE_KEY."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
