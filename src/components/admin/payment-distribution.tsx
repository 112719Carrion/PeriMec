"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!);

interface PaymentStats {
  mercadopago: {
    count: number;
    amount: number;
  };
  efectivo: {
    count: number;
    amount: number;
  };
}

export default function PaymentDistribution() {
  const [stats, setStats] = useState<PaymentStats>({ 
    mercadopago: { count: 0, amount: 0 }, 
    efectivo: { count: 0, amount: 0 } 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const { data: mercadopagoData, error: mpError } = await supabase
        .from("payments")
        .select("id, amount")
        .eq("type", 1);

      const { data: efectivoData, error: efError } = await supabase
        .from("payments")
        .select("id, amount")
        .eq("type", 2);

      if (mpError || efError) throw new Error("Error fetching payment stats");

      const mpAmount = mercadopagoData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      const efAmount = efectivoData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      setStats({
        mercadopago: {
          count: mercadopagoData?.length || 0,
          amount: mpAmount
        },
        efectivo: {
          count: efectivoData?.length || 0,
          amount: efAmount
        }
      });
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const data = [
    { name: "Mercado Pago", value: stats.mercadopago.count },
    { name: "Efectivo", value: stats.efectivo.count }
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Pagos</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Mercado Pago</p>
            <p className="text-2xl font-bold">{stats.mercadopago.count}</p>
            <p className="text-sm text-gray-500">Total: {formatCurrency(stats.mercadopago.amount)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Efectivo</p>
            <p className="text-2xl font-bold">{stats.efectivo.count}</p>
            <p className="text-sm text-gray-500">Total: {formatCurrency(stats.efectivo.amount)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 