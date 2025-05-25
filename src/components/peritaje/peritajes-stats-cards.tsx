"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { CheckCircle, Clock, AlertCircle, XCircle, FileText } from "lucide-react"
import type { PeritajesStats } from "./peritajes-informes-view"

interface PeritajesStatsCardsProps {
  stats: PeritajesStats
  loading: boolean
}

export default function PeritajesStatsCards({ stats, loading }: PeritajesStatsCardsProps) {
  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completados",
      value: stats.completados,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "En proceso",
      value: stats.en_proceso,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Cancelados",
      value: stats.cancelados,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : card.value}
            </div>
            {!loading && stats.total > 0 && (
              <p className="text-xs text-muted-foreground">{Math.round((card.value / stats.total) * 100)}% del total</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
