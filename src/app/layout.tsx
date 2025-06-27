import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/src/components/theme-provider"
import { AuthProvider } from "@/src/context/auth-context"
import { ToastProvider } from "@/src/components/toast-provider"
import Navbar from "@/src/components/navbar"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PeriMec",
  description: "Aplicación de gestión de peritajes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <div className="h-full flex flex-col">
                <Navbar />
                <main className="flex-1 min-h-0">{children}</main>
                <footer className="w-full border-t p-4 text-center bg-muted/40 flex-shrink-0">
                  <Link href="/faq" className="text-xs text-muted-foreground hover:underline">
                    Preguntas frecuentes
                  </Link>
                </footer>
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
