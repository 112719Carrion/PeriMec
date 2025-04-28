import UserManagementPanel from "@/src/components/admin/user-managment-panel"

export default function UsersAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
      </div>
      <div className="border-b pb-2">
        <p className="text-muted-foreground">
          Administra los usuarios registrados en el sistema. Puedes crear, editar, y gestionar sus roles y estado.
        </p>
      </div>
      <UserManagementPanel />
    </div>
  )
}
