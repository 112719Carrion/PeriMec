import { NextResponse } from "next/server"
import { Resend } from "resend"
import PeritajeCompletadoEmail from "@/emails/peritaje-completado"

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { email, peritaje } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "El correo electrónico es obligatorio" }, { status: 400 })
    }

    if (!peritaje) {
      return NextResponse.json({ error: "Los datos del peritaje son obligatorios" }, { status: 400 })
    }
    console.log("Email:", email)

    // Enviar el correo electrónico
    const data = await resend.emails.send({
      from: "PeriMec <notificaciones@perimec.com>",
      to: email,
      subject: `Peritaje de vehículo ${peritaje.marca} ${peritaje.modelo} completado`,
      react: PeritajeCompletadoEmail({ peritaje }),
    })

    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, {status: 200});
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error)
    return NextResponse.json({ error: "Error al enviar el correo electrónico" }, { status: 500 })
  }
}
