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
} from '@react-email/components';

interface PerimiecConfirmacionProps {
  userFirstname: string;
  fecha: string;
  hora: string;
}

export const PerimiecConfirmacion = ({
  userFirstname,
  fecha,
  hora
}: PerimiecConfirmacionProps) => (
  <Html>
    <Head />
    <Preview>Su turno en PeriMec ha sido confirmado</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Encabezado */}
        <Section style={header}>
          <Img src="logo.png" width="150" height="auto" alt="PeriMec Logo" style={logo} />
          <Heading style={heading}>Turno Confirmado</Heading>
          <Text style={subheading}>
            Su turno ha sido confirmado exitosamente. A continuación encontrará los detalles.
          </Text>
        </Section>

        <Hr style={hr} />

        {/* Detalles del turno */}
        <Section style={section}>
          <Text style={paragraph}>Hola {userFirstname},</Text>
          <Text style={paragraph}>
            Su turno en PeriMec para el {fecha} a las {hora} ha sido confirmado con éxito.
          </Text>
          <Text style={paragraph}>
            Ante cualquier eventualidad, por favor notifique al equipo lo antes posible.
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
);

PerimiecConfirmacion.PreviewProps = {
  userFirstname: 'Alan',
  fecha: '01/01/2024',
  hora: '10:00'
} as PerimiecConfirmacionProps;

export default PerimiecConfirmacion;

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "5px 5px 0 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto 20px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 10px",
  color: "#333",
};

const subheading = {
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  color: "#666",
};

const section = {
  backgroundColor: "#ffffff",
  padding: "20px 30px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333",
  margin: "0 0 15px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "0",
};

const footer = {
  backgroundColor: "#ffffff",
  padding: "20px 30px",
  borderRadius: "0 0 5px 5px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#666",
  margin: "5px 0",
};

const link = {
  color: "#0070f3",
  textDecoration: "underline",
};
