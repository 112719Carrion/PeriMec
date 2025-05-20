import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import type { PeritajeData } from "@/src/lib/peritajes/peritaje"

interface PeritajeCompletadoEmailProps {
  peritaje: PeritajeData
}

// Función para formatear la fecha
const formatearFecha = (fechaStr: string) => {
  try {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch (error) {
    return fechaStr
  }
}

// Función para obtener el color según el estado
const obtenerColorEstado = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "excelente":
      return "#22c55e" // Verde
    case "bueno":
      return "#3b82f6" // Azul
    case "regular":
      return "#f59e0b" // Amarillo
    case "malo":
      return "#ef4444" // Rojo
    case "crítico":
    case "critico":
      return "#7f1d1d" // Rojo oscuro
    default:
      return "#6b7280" // Gris
  }
}

export default function PeritajeCompletadoEmail({ peritaje }: PeritajeCompletadoEmailProps) {
  // Texto para la vista previa del correo
  const previewText = `El peritaje de su vehículo ${peritaje.marca} ${peritaje.modelo} ha sido completado.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Encabezado */}
          <Section style={header}>
            <Heading style={heading}>Peritaje Completado</Heading>
            <Text style={subheading}>
              El peritaje de su vehículo ha sido completado. A continuación, encontrará los detalles y resultados.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Información del vehículo */}
          <Section style={section}>
            <Heading as="h2" style={sectionHeading}>
              Información del Vehículo
            </Heading>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Marca:</Text>
                <Text style={value}>{peritaje.marca}</Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Modelo:</Text>
                <Text style={value}>{peritaje.modelo}</Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Año:</Text>
                <Text style={value}>{peritaje.anio}</Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Patente:</Text>
                <Text style={value}>{peritaje.patente}</Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Color:</Text>
                <Text style={value}>{peritaje.color}</Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Kilometraje:</Text>
                <Text style={value}>{peritaje.kilometraje} km</Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Combustible:</Text>
                <Text style={value}>{peritaje.tipo_combustible}</Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Fecha del peritaje:</Text>
                <Text style={value}>{formatearFecha(peritaje.fecha_turno)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Resultados del peritaje */}
          <Section style={section}>
            <Heading as="h2" style={sectionHeading}>
              Resultados del Peritaje
            </Heading>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Estado General:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.estado_general || "") }}>
                  {peritaje.estado_general || "No evaluado"}
                </Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Carrocería:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.carroceria || "") }}>
                  {peritaje.carroceria || "No evaluado"}
                </Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Pintura:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.pintura || "") }}>
                  {peritaje.pintura || "No evaluado"}
                </Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Motor:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.motor || "") }}>
                  {peritaje.motor || "No evaluado"}
                </Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Transmisión:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.transmision || "") }}>
                  {peritaje.transmision || "No evaluado"}
                </Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Frenos:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.frenos || "") }}>
                  {peritaje.frenos || "No evaluado"}
                </Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Suspensión:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.suspension || "") }}>
                  {peritaje.suspension || "No evaluado"}
                </Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Sistema Eléctrico:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.sistema_electrico || "") }}>
                  {peritaje.sistema_electrico || "No evaluado"}
                </Text>
              </Column>
            </Row>

            <Row style={row}>
              <Column style={column}>
                <Text style={label}>Interior:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.interior || "") }}>
                  {peritaje.interior || "No evaluado"}
                </Text>
              </Column>
              <Column style={column}>
                <Text style={label}>Neumáticos:</Text>
                <Text style={{ ...value, color: obtenerColorEstado(peritaje.neumaticos || "") }}>
                  {peritaje.neumaticos || "No evaluado"}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Observaciones */}
          {peritaje.observaciones && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={sectionHeading}>
                  Observaciones
                </Heading>
                <Text style={paragraph}>{peritaje.observaciones}</Text>
              </Section>
            </>
          )}

          {/* Conclusión */}
          {peritaje.conclusion && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={sectionHeading}>
                  Conclusión
                </Heading>
                <Text style={paragraph}>{peritaje.conclusion}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* Pie de página */}
          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} PeriMec. Todos los derechos reservados.</Text>
            <Text style={footerText}>
              Si tiene alguna pregunta, puede contactarnos a{" "}
              <Link href="mailto:contacto@perimec.com" style={link}>
                contacto@perimec.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const header = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "5px 5px 0 0",
  textAlign: "center" as const,
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 10px",
  color: "#333",
}

const subheading = {
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  color: "#666",
}

const section = {
  backgroundColor: "#ffffff",
  padding: "20px 30px",
}

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 15px",
  color: "#333",
}

const row = {
  display: "flex" as const,
  flexDirection: "row" as const,
  marginBottom: "10px",
}

const column = {
  flex: "1",
  padding: "0 10px",
}

const label = {
  fontSize: "14px",
  color: "#666",
  margin: "0 0 5px",
  fontWeight: "bold",
}

const value = {
  fontSize: "16px",
  color: "#333",
  margin: "0",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333",
  margin: "0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "0",
}

const ctaSection = {
  backgroundColor: "#ffffff",
  padding: "30px",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "5px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 30px",
  textDecoration: "none",
  textAlign: "center" as const,
}

const footer = {
  backgroundColor: "#ffffff",
  padding: "20px 30px",
  borderRadius: "0 0 5px 5px",
  textAlign: "center" as const,
}

const footerText = {
  fontSize: "14px",
  color: "#666",
  margin: "5px 0",
}

const link = {
  color: "#0070f3",
  textDecoration: "underline",
}
