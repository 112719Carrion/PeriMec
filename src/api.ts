import {MercadoPagoConfig, Preference} from "mercadopago";

interface Message {
  id: number;
  text: string;
}

export const mercadopago = new MercadoPagoConfig({accessToken: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN!});

const api = {
  message: {
    async submit(text: Message["text"]) {

      // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: "message",
              unit_price: 1000,
              quantity: 1,
              title: "Peritaje automotriz",
              description: "Peritaje automotriz",
            },
          ],
          "back_urls": {
          "success": "https://m3sp86s1-3000.brs.devtunnels.ms/",
          "pending": "https://localhost:3000/",
          "failure": "https://localhost:3000/"
          },
          "auto_return": "approved",
          metadata: {
            text,
          },
        },
      });

      // Devolvemos el init point (url de pago) para que el usuario pueda pagar
      return preference.init_point!;
    },
  },
};

export default api;