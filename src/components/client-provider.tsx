"use client"

import type React from "react"
import { AuthProvider } from "@/context/auth-context"

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
