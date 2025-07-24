"use client"

import PaymentsAdmin from "@/src/components/admin/payments-admin"
import PaymentDistribution from "@/src/components/admin/payment-distribution"
import { useState } from "react"
import { PieChartIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"

export default function PaymentsAdminPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
        <Button variant="outline" onClick={() => setOpen(true)} title="Ver gráfico de pagos">
          <PieChartIcon className="w-5 h-5 mr-2" />
          Ver gráfico
        </Button>
      </div>
      <div className="border-b pb-2">
        <p className="text-muted-foreground">Administra los pagos registrados o pendientes.</p>
      </div>
      <div className="flex-1 min-h-0">
        <PaymentsAdmin />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Distribución de Pagos</DialogTitle>
            <DialogDescription>Visualización gráfica de la distribución de pagos registrados.</DialogDescription>
          </DialogHeader>
          <PaymentDistribution />
        </DialogContent>
      </Dialog>
    </div>
  )
}
