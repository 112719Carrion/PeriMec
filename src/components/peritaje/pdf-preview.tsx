"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/src/components/ui/dialog"
import { Loader2, Download, X } from "lucide-react"
import { generatePeritajePDF, type PeritajeForPDF } from "@/src/lib/pdf/generate-pdf"

interface PDFPreviewProps {
  peritaje: PeritajeForPDF
  open: boolean
  onClose: () => void
}

export default function PDFPreview({ peritaje, open, onClose }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Establecer isClient a true cuando el componente se monte
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !open || !peritaje) return

    setLoading(true)

    // Importar las bibliotecas necesarias
    Promise.all([import("jspdf"), import("jspdf-autotable")])
      .then(([jsPDFModule]) => {
        // Crear un objeto de documento PDF
        const doc = new jsPDFModule.jsPDF()

        // Generar contenido simplificado para la vista previa
        doc.text(`Peritaje: ${peritaje.id.substring(0, 8)}`, 10, 10)
        doc.text(`Vehículo: ${peritaje.marca} ${peritaje.modelo} (${peritaje.anio})`, 10, 20)
        doc.text(`Patente: ${peritaje.patente}`, 10, 30)

        // Convertir el PDF a una URL de datos
        const pdfBlob = doc.output("blob")
        const url = URL.createObjectURL(pdfBlob)
        setPdfUrl(url)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error al generar la vista previa del PDF:", error)
        setLoading(false)
      })

    return () => {
      // Limpiar la URL cuando cambia el estado de open
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
        setPdfUrl(null)
      }
    }
  }, [isClient, open, peritaje, pdfUrl])

  // Limpiar la URL cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const handleDownload = () => {
    if (peritaje) {
      generatePeritajePDF(peritaje)
    }
  }

  if (!isClient || !peritaje) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Vista previa del informe de peritaje</DialogTitle>
          <DialogDescription>Previsualización del PDF generado para el peritaje.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Generando vista previa...</span>
            </div>
          ) : pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-[500px] border rounded" title="Vista previa del PDF" />
          ) : (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              No se pudo generar la vista previa
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cerrar
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
