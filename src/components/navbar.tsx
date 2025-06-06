"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogIn, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { useAuth } from "@/src/context/auth-context"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { isAdmin } = useAuth()

  // Asegurarse de que la ruta de "Administración" sea correcta
  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Peritajes", href: "/peritaje" },
    { name: "Administración", href: "/administracion" },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      console.log("Iniciando cierre de sesión...")
      await logout()
      console.log("Sesión cerrada, redirigiendo...")
      router.push("/")
      router.refresh() // Forzar actualización de la página
    } catch (error) {
      console.error("Error en handleLogout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">PeriMec</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems
              .filter((item) => item.name !== "Administración" || isAdmin)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>

        {/* Login/Logout Button (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoading && (
            isAuthenticated ? (
              <>
                {user && (
                  <span className="text-sm text-muted-foreground">
                    Hola, {user.user_metadata?.full_name || user.email}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogin} className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar sesión
              </Button>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Abrir menú</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isLoading && (
                isAuthenticated ? (
                  <Button variant="ghost" className="justify-start px-0" onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                  </Button>
                ) : (
                  <Button variant="ghost" className="justify-start px-0" onClick={handleLogin}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar sesión
                  </Button>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
