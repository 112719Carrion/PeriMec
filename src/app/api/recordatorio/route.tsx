"use server"

import PeritajeReminderEmail from "@/emails/peritaje-reminder";
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { clienteEmail, clienteNombre, fechaPeritaje, direccion } = await request.json();

    const data = await resend.emails.send({
      from: "PeriMec <notificaciones@perimec.com>",
      to: clienteEmail,
      subject: "Recordatorio: Peritaje programado",
      react: PeritajeReminderEmail({
        clienteNombre,
        fechaPeritaje,
        direccion,
      }),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error al enviar email de recordatorio:", error);
    return NextResponse.json({ success: false, error: "No se pudo enviar el email de recordatorio" }, { status: 500 });
  }
}
