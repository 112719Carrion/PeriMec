export default function PeritajesPendientesPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Peritajes Pendientes</h1>
        </div>
        <div className="border-b pb-2">
          <p className="text-muted-foreground">Lista de peritajes agendados pendientes de realización.</p>
        </div>
        <div className="rounded-md border">
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No hay peritajes pendientes para mostrar</p>
          </div>
        </div>
      </div>
    )
  }
  