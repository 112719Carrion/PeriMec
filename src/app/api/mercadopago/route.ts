import {MercadoPagoConfig, Payment} from "mercadopago";
import {createClient} from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN!});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: {data: {id: string}} = await request.json();
  console.log("Body prueba:", body);
  console.log("--------------------------");

  // Obtenemos el pago
  const payment = await new Payment(mercadopago).get({id: body.data.id});

  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {

    const donation = {//Revisar nombres de variales
      id: payment.id,
      amount: payment.transaction_amount,
      message: payment.description,
    };

    console.log("PAGO:", payment);
    await supabase.from("payments").insert(donation);

    // // Enviar el email de confirmación
    // await fetch("/api/email", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: payment.payer?.email ?? "",
    //     userFirstname: payment.payer?.email,
    //     fecha: payment.payer?.email,
    //     hora: payment.metadata,
    //   }),
    // })

    // Revalidamos la página de inicio para mostrar los datos actualizados
    revalidatePath("/");
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, {status: 200});
}

