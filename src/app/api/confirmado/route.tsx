import PerimiecConfirmacion from '@/emails';
import {render} from '@react-email/render';
import {Resend} from 'resend';



const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY!);

export async function POST(request: Request, res: Response) {
    const {email, userFirstname, fecha, hora} = await request.json();
    
    const { data, error } = await resend.emails.send({
        from: "PeriMec <notificaciones@perimec.com>",
        to: email,
        subject: 'Turno confirmado',
        html: await render(PerimiecConfirmacion({userFirstname, fecha, hora})),
    });
    
    if (error) {
        return new Response(JSON.stringify({error}), {status: 500});
    }
    
    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, {status: 200});
}