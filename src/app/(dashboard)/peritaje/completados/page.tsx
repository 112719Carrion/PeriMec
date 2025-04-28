export default function PeritajesCompletadosPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Peritajes Completados</h1>
        </div>
        <div className="border-b pb-2">
          <p className="text-muted-foreground">Lista de peritajes realizados y finalizados.</p>
        </div>
        <div className="rounded-md border">
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No hay peritajes completados para mostrar</p>
          </div>
        </div>
      </div>
    )
  }
  