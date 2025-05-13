"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import PeritajeForm from "@/src/components/peritaje/peritaje-form"

export default function PeritajeFormPage() {
  const searchParams = useSearchParams()
  const [appointmentDetails, setAppointmentDetails] = useState({
    fecha: "",
    hora: "",
  })

  useEffect(() => {
    const fecha = searchParams.get("fecha") || ""
    const hora = searchParams.get("hora") || ""
    setAppointmentDetails({ fecha, hora })
  }, [searchParams])

  return (
    <div className="container mx-auto py-6">
      <PeritajeForm appointmentDetails={appointmentDetails} />
    </div>
  )
}
