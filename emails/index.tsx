import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PerimiecConfirmacionProps {
  userFirstname: string;
  fecha: string;
  hora: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const PerimiecConfirmacion = ({
  userFirstname,
  fecha,
  hora
}: PerimiecConfirmacionProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hola {userFirstname},</Text>
        <Text style={paragraph}>
          Su turno en PeriMec para el {fecha} y {hora}fue confirmado con exito, ante cualquier enventualidad por favor notifique al equipo.
        </Text>
        <Text style={paragraph}>
          Saludos,
          <br />
          Equipo de PeriMec
        </Text>
        <Hr style={hr} />
      </Container>
    </Body>
  </Html>
);

PerimiecConfirmacion.PreviewProps = {
  userFirstname: 'Alan',
} as PerimiecConfirmacionProps;

export default PerimiecConfirmacion;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
