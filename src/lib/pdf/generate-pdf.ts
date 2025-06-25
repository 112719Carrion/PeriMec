import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Definir el tipo Peritaje sin usar Prisma
export interface PeritajeForPDF {
  id: string
  marca: string
  modelo: string
  anio: string
  patente: string
  kilometraje: string
  color: string
  tipo_combustible: string
  observaciones?: string | null
  nombre_propietario: string
  telefono_propietario: string
  email_propietario: string
  fecha_turno: string | Date
  hora_turno: string
  estado: string
  estado_general?: string | null
  carroceria?: string | null
  pintura?: string | null
  motor?: string | null
  transmision?: string | null
  frenos?: string | null
  suspension?: string | null
  sistema_electrico?: string | null
  interior?: string | null
  neumaticos?: string | null
  conclusion?: string | null
}

// Función auxiliar para formatear fechas de manera segura
function formatearFechaSegura(fechaInput: string | Date | null | undefined, formatoStr: string): string {
  if (!fechaInput) return "No disponible"

  try {
    const fecha = typeof fechaInput === "string" ? new Date(fechaInput) : fechaInput
    return format(fecha, formatoStr, { locale: es })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return String(fechaInput)
  }
}

// Función para capitalizar la primera letra de un texto
function capitalizarPrimeraLetra(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Función para evaluar el estado y devolver un texto descriptivo
function evaluarEstado(estado: string): string {
  switch (estado.toLowerCase()) {
    case "excelente":
      return "Excelente - En perfectas condiciones, sin desgaste visible."
    case "bueno":
      return "Bueno - En buen estado general, con desgaste normal por uso."
    case "regular":
      return "Regular - Presenta desgaste notable, requiere atención."
    case "malo":
      return "Malo - Presenta problemas significativos, requiere reparación."
    case "crítico":
      return "Crítico - Requiere reparación inmediata, no es seguro para uso."
    default:
      return "No evaluado"
  }
}

// Función para generar una conclusión basada en los datos del peritaje
function generarConclusion(peritaje: PeritajeForPDF): string {
  const estadosGenerales = [
    peritaje.estado_general,
    peritaje.carroceria,
    peritaje.pintura,
    peritaje.motor,
    peritaje.transmision,
    peritaje.frenos,
    peritaje.suspension,
    peritaje.sistema_electrico,
    peritaje.interior,
    peritaje.neumaticos,
  ].filter(Boolean)

  if (estadosGenerales.length === 0) {
    return "No se ha realizado una evaluación completa del vehículo."
  }

  const contarEstados = (estados: (string | null | undefined)[], tipo: string) => {
    return estados.filter((estado) => estado && estado.toLowerCase() === tipo.toLowerCase()).length
  }

  const excelentes = contarEstados(estadosGenerales, "excelente")
  const buenos = contarEstados(estadosGenerales, "bueno")
  const regulares = contarEstados(estadosGenerales, "regular")
  const malos = contarEstados(estadosGenerales, "malo")
  const criticos = contarEstados(estadosGenerales, "crítico")

  if (criticos > 0) {
    return `El vehículo presenta ${criticos} componentes en estado crítico que requieren atención inmediata. No es recomendable su adquisición sin antes realizar las reparaciones necesarias.`
  }

  if (malos > estadosGenerales.length / 3) {
    return `El vehículo presenta ${malos} componentes en mal estado. Se recomienda una revisión exhaustiva y presupuesto de reparaciones antes de considerar su adquisición.`
  }

  if (buenos + excelentes > estadosGenerales.length * 0.7) {
    return `El vehículo se encuentra en buen estado general. Con ${buenos} componentes en buen estado y ${excelentes} en excelente estado. Es una buena opción para adquisición, considerando su año y kilometraje.`
  }

  return `El vehículo presenta un estado general regular, con ${buenos} componentes en buen estado, ${regulares} en estado regular y ${malos} en mal estado. Se recomienda una revisión adicional antes de tomar una decisión de compra.`
}

// Función para agregar pie de página a todas las páginas
function agregarPieDePagina(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Página ${i} de ${pageCount} - Este documento es un informe oficial de peritaje.`, 105, 285, {
      align: "center",
    })
  }
}

// Función para verificar si hay suficiente espacio en la página actual
function verificarEspacioDisponible(doc: jsPDF, alturaRequerida: number, yPosActual: number, margenInferior = 270): boolean {
  const espacioDisponible = margenInferior - yPosActual
  return espacioDisponible >= alturaRequerida
}

// Función para generar un PDF a partir de los datos de un peritaje
export const generatePeritajePDF = (peritaje: PeritajeForPDF) => {
  // Crear un nuevo documento PDF
  const doc = new jsPDF()

  // Añadir título
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text("INFORME DE PERITAJE", 105, 20, { align: "center" })

  // Añadir número de peritaje
  doc.setFontSize(12)
  doc.text(`Peritaje Nº: ${peritaje.id.substring(0, 8).toUpperCase()}`, 105, 30, { align: "center" })

  // Añadir fecha de emisión
  const fechaEmision = formatearFechaSegura(new Date(), "dd 'de' MMMM 'de' yyyy")
  doc.setFontSize(10)
  doc.text(`Fecha de emisión: ${fechaEmision}`, 105, 35, { align: "center" })

  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 40, 190, 40)

  // Información del propietario
  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)
  doc.text("Datos del Propietario", 20, 50)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)

  // Tabla de datos del propietario
  let yPos = 55
  autoTable(doc, {
    startY: yPos,
    head: [["Nombre", "Teléfono", "Email"]],
    body: [[peritaje.nombre_propietario, peritaje.telefono_propietario, peritaje.email_propietario]],
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [40, 40, 40],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
    },
  })

  // Obtener la posición Y final después de la tabla
  // @ts-ignore - Esta es una propiedad válida añadida por el plugin autoTable
  yPos = (doc as any).lastAutoTable.finalY || 85

  // Información del vehículo
  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)
  doc.text("Datos del Vehículo", 20, yPos + 15)

  // Tabla de datos del vehículo
  autoTable(doc, {
    startY: yPos + 20,
    head: [["Marca", "Modelo", "Año", "Patente", "Color", "Kilometraje", "Combustible"]],
    body: [
      [
        peritaje.marca,
        peritaje.modelo,
        peritaje.anio,
        peritaje.patente,
        peritaje.color,
        `${peritaje.kilometraje} km`,
        capitalizarPrimeraLetra(peritaje.tipo_combustible),
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [40, 40, 40],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
    },
  })

  // Obtener la posición Y final después de la tabla
  // @ts-ignore - Esta es una propiedad válida añadida por el plugin autoTable
  yPos = (doc as any).lastAutoTable.finalY || yPos + 40

  // Información del turno
  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)
  doc.text("Datos del Turno", 20, yPos + 15)

  // Formatear fecha de forma segura
  const fechaTurno = formatearFechaSegura(peritaje.fecha_turno, "dd 'de' MMMM 'de' yyyy")

  // Tabla de datos del turno
  autoTable(doc, {
    startY: yPos + 20,
    head: [["Fecha", "Hora", "Estado"]],
    body: [[fechaTurno, peritaje.hora_turno, capitalizarPrimeraLetra(peritaje.estado)]],
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [40, 40, 40],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
    },
  })

  // Obtener la posición Y final después de la tabla
  // @ts-ignore - Esta es una propiedad válida añadida por el plugin autoTable
  yPos = (doc as any).lastAutoTable.finalY || yPos + 40

  // Sección de resultados del peritaje
  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)
  doc.text("Resultados del Peritaje", 20, yPos + 15)

  // Tabla de resultados del peritaje
  const resultadosItems = [
    ["Estado general", evaluarEstado(peritaje.estado_general || "No evaluado")],
    ["Carrocería", evaluarEstado(peritaje.carroceria || "No evaluado")],
    ["Pintura", evaluarEstado(peritaje.pintura || "No evaluado")],
    ["Motor", evaluarEstado(peritaje.motor || "No evaluado")],
    ["Transmisión", evaluarEstado(peritaje.transmision || "No evaluado")],
    ["Frenos", evaluarEstado(peritaje.frenos || "No evaluado")],
    ["Suspensión", evaluarEstado(peritaje.suspension || "No evaluado")],
    ["Sistema eléctrico", evaluarEstado(peritaje.sistema_electrico || "No evaluado")],
    ["Interior", evaluarEstado(peritaje.interior || "No evaluado")],
    ["Neumáticos", evaluarEstado(peritaje.neumaticos || "No evaluado")],
  ]

  autoTable(doc, {
    startY: yPos + 20,
    head: [["Componente", "Estado"]],
    body: resultadosItems,
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [40, 40, 40],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      1: {
        cellWidth: 100,
      },
    },
  })

  // Obtener la posición Y final después de la tabla
  // @ts-ignore - Esta es una propiedad válida añadida por el plugin autoTable
  yPos = (doc as any).lastAutoTable.finalY || yPos + 120

  // Observaciones
  if (peritaje.observaciones && peritaje.observaciones.trim() !== "") {
    // Dividir el texto de observaciones en líneas para calcular la altura necesaria
    const textLines = doc.splitTextToSize(peritaje.observaciones, 170)
    const alturaTexto = textLines.length * 5 + 25 // 25 para el título y espaciado

    // Verificar si hay suficiente espacio para el título y el texto
    if (!verificarEspacioDisponible(doc, alturaTexto, yPos, 270)) {
      doc.addPage()
      yPos = 20 // Reiniciar la posición Y en la nueva página
    }

    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text("Observaciones", 20, yPos + 15)

    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text(textLines, 20, yPos + 25)
    yPos = yPos + 25 + textLines.length * 5
  }

  // Conclusión
  const conclusion = peritaje.conclusion || generarConclusion(peritaje)
  const conclusionLines = doc.splitTextToSize(conclusion, 170)
  const alturaConclusionTexto = conclusionLines.length * 5 + 25 // 25 para el título y espaciado

  // Verificar si hay suficiente espacio para la conclusión
  if (!verificarEspacioDisponible(doc, alturaConclusionTexto, yPos, 270)) {
    doc.addPage()
    yPos = 20 // Reiniciar la posición Y en la nueva página
  }

  doc.setFontSize(14)
  doc.setTextColor(60, 60, 60)
  doc.text("Conclusión", 20, yPos + 15)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(conclusionLines, 20, yPos + 25)

  // Agregar pie de página a todas las páginas
  agregarPieDePagina(doc)

  // Guardar el PDF
  doc.save(`Peritaje_${peritaje.id.substring(0, 8)}_${peritaje.patente}.pdf`)
}
