"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { FileBarChart } from "lucide-react"
import type { PeritajesStats } from "./peritajes-informes-view"

interface PeritajesPieChartProps {
  stats: PeritajesStats
  loading: boolean
}

// Colores para cada estado
const COLORS = {
  completados: "#22c55e", // Verde
  pendientes: "#f59e0b", // Amarillo
  en_proceso: "#3b82f6", // Azul
  cancelados: "#ef4444", // Rojo
}

export default function PeritajesPieChart({ stats, loading }: PeritajesPieChartProps) {
  // Preparar los datos para el gráfico
  const data = [
    {
      name: "Completados",
      value: stats.completados,
      color: COLORS.completados,
    },
    {
      name: "Pendientes",
      value: stats.pendientes,
      color: COLORS.pendientes,
    },
    {
      name: "En proceso",
      value: stats.en_proceso,
      color: COLORS.en_proceso,
    },
    {
      name: "Cancelados",
      value: stats.cancelados,
      color: COLORS.cancelados,
    },
  ].filter((item) => item.value > 0) // Solo mostrar estados que tengan valores

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = stats.total > 0 ? Math.round((data.value / stats.total) * 100) : 0
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} peritajes ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Componente personalizado para la leyenda
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-muted-foreground">
              {entry.value}: {entry.payload.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileBarChart className="mr-2 h-5 w-5" />
          Distribución de peritajes
        </CardTitle>
        <CardDescription>Distribución por estado en el período seleccionado</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : stats.total === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <FileBarChart className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No hay datos</p>
            <p className="text-sm">No se encontraron peritajes en el período seleccionado</p>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
