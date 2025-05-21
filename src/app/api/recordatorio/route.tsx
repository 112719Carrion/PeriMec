"use server"

import PeritajeReminderEmail from "@/emails/peritaje-reminder";
import { Resend } from "resend"

const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY)

export async function sendReminderEmail({
  clienteEmail,
  clienteNombre,
  fechaPeritaje,
  // Otros datos necesarios
}: {
  clienteEmail: string;
  clienteNombre: string;
  fechaPeritaje: string; // Cambia a Date si corresponde
  // Otros datos necesarios: sus tipos aquí
}) {
  try {
    const data = await resend.emails.send({
      from: "PeriMec <notificaciones@perimec.com>",
      to: clienteEmail,
      subject: "Recordatorio: Peritaje programado",
      react: PeritajeReminderEmail({
        clienteNombre,
        fechaPeritaje,
        // Otros datos necesarios
      }),
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error al enviar email de recordatorio:", error)
    throw new Error("No se pudo enviar el email de recordatorio")
  }
}
