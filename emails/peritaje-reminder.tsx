import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Basado en la plantilla de peritaje-completado
type PeritajeReminderEmailProps = {
  clienteNombre: string;
  fechaPeritaje: string | Date;
  direccion: string;
};

export const PeritajeReminderEmail = ({
  clienteNombre,
  fechaPeritaje,
  direccion = "Puerto Rico 1631",
}: PeritajeReminderEmailProps) => {
  const formattedDate = fechaPeritaje
    ? format(new Date(fechaPeritaje), "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
    : "fecha no disponible"

  return (
    <Html>
      <Head />
      <Preview>Recordatorio de su peritaje programado</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Encabezado */}
            <Section style={header}>
            <Img src="https://localhost:3000/public/logo.png" width="150" height="auto" alt="PeriMec Logo" style={logo} />
            <Heading style={heading}>Recordatorio de Peritaje</Heading>
            <Text style={subheading}>
              Le recordamos que tiene un peritaje programado próximamente.
            </Text>
            </Section>

          <Hr style={hr} />

          {/* Detalles del peritaje */}
          <Section style={section}>
            <Text style={paragraph}>Estimado/a {clienteNombre},</Text>
            <Text style={paragraph}>
              Le recordamos que tiene un peritaje programado para el {formattedDate} en {direccion}.
            </Text>
            <Text style={paragraph}>
              Por favor, asegúrese de tener el vehículo disponible y los documentos necesarios para realizar el
              peritaje.
            </Text>
            <Text style={paragraph}>
              Si necesita reprogramar o tiene alguna pregunta, contáctenos lo antes posible.
            </Text>
          </Section>

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

const logo = {
  margin: "0 auto 20px",
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

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333",
  margin: "0 0 15px",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "0",
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

export default PeritajeReminderEmail
