// src/app/actions/peritaje.ts
"use server";

import api from "@/src/api";
import { redirect } from "next/navigation";

export async function redirectMP(message: string) {
  // Lógica en el servidor:
  const url = await api.message.submit(message);
  // Redirige (devuelve un 3XX al navegador)
  redirect(url);
}
