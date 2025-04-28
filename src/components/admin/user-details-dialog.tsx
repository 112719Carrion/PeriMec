"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Switch } from "@/src/components/ui/switch"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { UserData } from "@/types/user"
import { updateUserDetails } from "@/src/lib/admin/user"
import { useToast } from "@/src/hooks/use-toast"

interface UserDetailsDialogProps {
  user: UserData
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: (user: UserData) => void
}

export default function UserDetailsDialog({ user, open, onOpenChange, onUserUpdated }: UserDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState<UserData>(user)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setUserData((prev) => ({ ...prev, role: value }))
  }

  const handleStatusChange = (checked: boolean) => {
    setUserData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await updateUserDetails(userData)
      onUserUpdated(userData)
      setIsEditing(false)
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados correctamente.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("Error al actualizar usuario:", err)
      setError(errorMessage)
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario. " + errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
          <DialogDescription>Información detallada del usuario y opciones de gestión.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 md:col-span-1 font-medium">ID:</div>
              <div className="col-span-4 md:col-span-3 text-muted-foreground break-all">{userData.id}</div>

              <div className="col-span-4 md:col-span-1 font-medium">Nombre:</div>
              <div className="col-span-4 md:col-span-3">
                {isEditing ? (
                  <Input name="full_name" value={userData.full_name || ""} onChange={handleInputChange} />
                ) : (
                  <span>{userData.full_name || "No disponible"}</span>
                )}
              </div>

              <div className="col-span-4 md:col-span-1 font-medium">Correo:</div>
              <div className="col-span-4 md:col-span-3">
                {isEditing ? (
                  <Input name="email" value={userData.email} onChange={handleInputChange} disabled />
                ) : (
                  <span>{userData.email}</span>
                )}
              </div>

              <div className="col-span-4 md:col-span-1 font-medium">Teléfono:</div>
              <div className="col-span-4 md:col-span-3">
                {isEditing ? (
                  <Input name="phone" value={userData.phone || ""} onChange={handleInputChange} />
                ) : (
                  <span>{userData.phone || "No disponible"}</span>
                )}
              </div>

              <div className="col-span-4 md:col-span-1 font-medium">Rol:</div>
              <div className="col-span-4 md:col-span-3">
                {isEditing ? (
                  <Select value={userData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="perito">Perito</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      userData.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : userData.role === "perito"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {userData.role === "admin" ? "Administrador" : userData.role === "perito" ? "Perito" : "Usuario"}
                  </span>
                )}
              </div>

              <div className="col-span-4 md:col-span-1 font-medium">Estado:</div>
              <div className="col-span-4 md:col-span-3">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Switch checked={userData.is_active} onCheckedChange={handleStatusChange} id="user-status" />
                    <Label htmlFor="user-status">{userData.is_active ? "Activo" : "Inactivo"}</Label>
                  </div>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      userData.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userData.is_active ? "Activo" : "Inactivo"}
                  </span>
                )}
              </div>

              <div className="col-span-4 md:col-span-1 font-medium">Fecha de registro:</div>
              <div className="col-span-4 md:col-span-3">{new Date(userData.created_at).toLocaleString()}</div>

              <div className="col-span-4 md:col-span-1 font-medium">Último acceso:</div>
              <div className="col-span-4 md:col-span-3">
                {userData.last_sign_in_at ? new Date(userData.last_sign_in_at).toLocaleString() : "Nunca"}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Notificaciones por correo</h4>
                  <p className="text-sm text-muted-foreground">Recibir notificaciones sobre actividades del sistema</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Autenticación de dos factores</h4>
                  <p className="text-sm text-muted-foreground">Aumentar la seguridad de la cuenta</p>
                </div>
                <Switch />
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Eliminar cuenta
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Esta acción no se puede deshacer. Eliminará permanentemente la cuenta y todos sus datos.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setUserData(user)
                  setIsEditing(false)
                  setError(null)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              <Button onClick={() => setIsEditing(true)}>Editar usuario</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
