import {MercadoPagoConfig, Payment} from "mercadopago";
import {createClient} from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN!});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: {data: {id: string}} = await request.json();

  // Obtenemos el pago
  const payment = await new Payment(mercadopago).get({id: body.data.id});

  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {

    const donation = {//Revisar nombres de variales
      id: payment.id,
      amount: payment.transaction_amount,
      message: payment.description,
      type: 1, // 1 para MP
    };

    await supabase.from("payments").insert(donation);

    // Revalidamos la página de inicio para mostrar los datos actualizados
    revalidatePath("/");
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, {status: 200});
}

