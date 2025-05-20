import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Basado en la plantilla de peritaje-completado
type PeritajeReminderEmailProps = {
  clienteNombre: string;
  fechaPeritaje: string | Date;
  // Otros datos necesarios
};

export const PeritajeReminderEmail = ({
  clienteNombre,
  fechaPeritaje,
  // Otros datos necesarios
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
          <Img src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`} width="150" height="auto" alt="Logo" style={logo} />
          <Heading style={heading}>Recordatorio de Peritaje</Heading>
          <Section style={section}>
            <Text style={text}>Estimado/a {clienteNombre},</Text>
            <Text style={text}>
              Le recordamos que tiene un peritaje programado para el {formattedDate} en Puerto Rico 1631.
            </Text>
            <Text style={text}>
              Por favor, asegúrese de tener el vehículo disponible y los documentos necesarios para realizar el
              peritaje.
            </Text>
            <Text style={text}>Si necesita reprogramar o tiene alguna pregunta, contáctenos lo antes posible.</Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} PeriMec. Todos los derechos reservados.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos (copiados de la plantilla original con pequeñas modificaciones)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
}

const logo = {
  margin: "0 auto",
  marginBottom: "20px",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  textAlign: "center" as const,
}

const section = {
  padding: "20px",
}

const text = {
  fontSize: "16px",
  lineHeight: "1.4",
  color: "#3c4043",
}

const footer = {
  padding: "20px 0",
  borderTop: "1px solid #e5e5e5",
}

const footerText = {
  fontSize: "12px",
  color: "#6a6a6a",
  lineHeight: "1.5",
  textAlign: "center" as const,
}

const link = {
  color: "#0070f3",
  textDecoration: "underline",
}

export default PeritajeReminderEmail
