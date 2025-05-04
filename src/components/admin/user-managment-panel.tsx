"use client"

import { useState, useEffect } from "react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Search, UserPlus, RefreshCw, Pencil, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { fetchUsers, updateUserStatus, deleteUser } from "@/src/lib/admin/user"
import type { UserData } from "@/types/user"
import UserDetailsDialog from "./user-details-dialog"
import CreateUserDialog from "./create-user-dialog"
import { useToast } from "@/src/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"

// Importar el nuevo componente
import SupabaseConfigChecker from "./supabase-config-checker"

export default function UserManagementPanel() {
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers()
  }, [])

  // Filtrar usuarios cuando cambian los filtros
  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  // Función para cargar usuarios desde Supabase
  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar usuarios"
      console.error("Error al cargar usuarios:", err)
      setError(errorMessage)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios. " + errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para filtrar usuarios según los criterios
  const filterUsers = () => {
    let filtered = [...users]

    // Filtrar por rol
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter((user) => user.is_active === isActive)
    }

    // Filtrar por término de búsqueda (nombre, email o teléfono)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term),
      )
    }

    setFilteredUsers(filtered)
  }

  // Función para abrir el diálogo de detalles de usuario
  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  // Función para cambiar el estado de un usuario (activo/inactivo)
  const handleToggleStatus = async (user: UserData) => {
    setIsProcessing(true)
    try {
      const newStatus = !user.is_active
      await updateUserStatus(user.id, newStatus)

      // Actualizar el estado local
      setUsers(users.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)))

      toast({
        title: "Estado actualizado",
        description: `Usuario ${newStatus ? "activado" : "desactivado"} correctamente.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("Error al cambiar el estado del usuario:", err)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario. " + errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Función para confirmar eliminación de usuario
  const handleConfirmDelete = (user: UserData) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  // Función para eliminar un usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setIsProcessing(true)
    try {
      await deleteUser(userToDelete.id)

      // Actualizar el estado local
      setUsers(users.filter((u) => u.id !== userToDelete.id))

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("Error al eliminar usuario:", err)
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario. " + errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  // Función para actualizar la lista después de crear o editar un usuario
  const handleUserUpdated = (updatedUser: UserData) => {
    // Si el usuario ya existe, actualizarlo; si no, añadirlo
    const userExists = users.some((user) => user.id === updatedUser.id)

    if (userExists) {
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    } else {
      setUsers([...users, updatedUser])
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros y acciones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra la lista de usuarios por nombre, correo, teléfono, rol o estado.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, correo o teléfono..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="perito">Perito</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadUsers} className="md:w-auto" disabled={isLoading || isProcessing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>
            <Button className="md:w-auto" onClick={() => setIsCreateOpen(true)} disabled={isLoading || isProcessing}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>{filteredUsers.length} usuarios encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 mb-2">Error al cargar usuarios</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="mt-4 flex flex-col items-center gap-4">
                <Button variant="outline" onClick={loadUsers}>
                  Reintentar
                </Button>

                {error.includes("Error de configuración de Supabase") && (
                  <div className="mt-4 w-full max-w-md">
                    <SupabaseConfigChecker />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                    <TableHead className="hidden md:table-cell">Rol</TableHead>
                    <TableHead className="hidden md:table-cell">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No se encontraron usuarios con los filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || "Sin nombre"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.phone || "No disponible"}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "perito"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role === "admin" ? "Administrador" : user.role === "perito" ? "Perito" : "Usuario"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(user)}
                              title="Editar"
                              disabled={isProcessing}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(user)}
                              title={user.is_active ? "Desactivar" : "Activar"}
                              disabled={isProcessing}
                            >
                              {user.is_active ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleConfirmDelete(user)}
                              title="Eliminar"
                              disabled={isProcessing}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de detalles/edición de usuario */}
      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {/* Diálogo para crear nuevo usuario */}
      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onUserCreated={handleUserUpdated} />

      {/* Diálogo de confirmación para eliminar usuario */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario{" "}
              <span className="font-medium">{userToDelete?.full_name || userToDelete?.email || "seleccionado"}</span> y
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
