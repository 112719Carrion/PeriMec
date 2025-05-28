import PaymentsAdmin from "@/src/components/admin/payments-admin";

export default function PaymentsAdminPage() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
      </div>
      <div className="border-b pb-2">
        <p className="text-muted-foreground">
          Administra los peritajes que tiene pendiente asignar un pago.
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        <PaymentsAdmin />
      </div>
    </div>
  )
}
