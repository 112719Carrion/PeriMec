"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ConfirmAccountPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    // Supabase maneja automáticamente la confirmación del correo electrónico
    // cuando el usuario hace clic en el enlace de confirmación
    // Solo necesitamos verificar si la sesión está activa
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error al verificar la sesión:", error)
          setStatus("error")
          return
        }

        if (data.session) {
          setStatus("success")
        } else {
          // Si no hay sesión, puede ser que el token ya fue usado o es inválido
          setStatus("error")
        }
      } catch (error) {
        console.error("Error inesperado:", error)
        setStatus("error")
      }
    }

    // Pequeño retraso para dar tiempo a que Supabase procese la confirmación
    setTimeout(checkSession, 1000)
  }, [])

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verificando tu cuenta...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <CardTitle className="text-xl text-red-600">Error de verificación</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>No pudimos verificar tu cuenta. El enlace puede haber expirado o ser inválido.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/login">Volver al inicio de sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <CardTitle className="text-xl text-green-600">¡Cuenta verificada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
