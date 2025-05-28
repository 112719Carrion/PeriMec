export default function AdministracionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
      </div>
      <div className="border-b pb-2">
        <p className="text-muted-foreground">Bienvenido al panel de administración del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Gestión de Usuarios</h3>
          <p className="text-muted-foreground mb-4">Administra los usuarios del sistema, sus roles y permisos.</p>
          <a href="/administracion/usuarios" className="text-primary hover:underline">
            Ir a Usuarios →
          </a>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Gestión de pagos</h3>
          <p className="text-muted-foreground mb-4">Administra los peritajes pendientes de pago.</p>
          <a href="/administracion/pagos" className="text-primary hover:underline">
            Ir a Pagos →
          </a>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Configuración</h3>
          <p className="text-muted-foreground mb-4">Configura los parámetros generales del sistema.</p>
          <a href="/administracion/configuracion" className="text-primary hover:underline">
            Ir a Configuración →
          </a>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-medium mb-2">Reportes</h3>
          <p className="text-muted-foreground mb-4">Genera y visualiza reportes del sistema.</p>
          <a href="/administracion/reportes" className="text-primary hover:underline">
            Ir a Reportes →
          </a>
        </div>
      </div>
    </div>
  )
}
