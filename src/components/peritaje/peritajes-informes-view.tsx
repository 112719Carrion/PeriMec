"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { RefreshCw, TrendingUp } from "lucide-react"
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { fetchPeritajesStats } from "@/src/lib/peritajes/stats"
import { useToast } from "@/src/hooks/use-toast"
import PeritajesStatsCards from "./peritajes-stats-cards"
import PeritajesPieChart from "./pertitajes-pie-chart"
import { DatePickerWithRange } from "@/src/components/ui/date-range-picker"

export interface PeritajesStats {
  pendientes: number
  completados: number
  cancelados: number
  en_proceso: number
  total: number
}

export default function PeritajesInformesView() {
  const { toast } = useToast()
  const [stats, setStats] = useState<PeritajesStats>({
    pendientes: 0,
    completados: 0,
    cancelados: 0,
    en_proceso: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  })

  // Cargar las estadísticas
  const loadStats = async () => {
    if (!dateRange.from || !dateRange.to) return
    
    setLoading(true)
    try {
      const data = await fetchPeritajesStats(
        format(startOfDay(dateRange.from), "yyyy-MM-dd"),
        format(endOfDay(dateRange.to), "yyyy-MM-dd"),
      )
      setStats(data)
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar estadísticas al montar el componente y cuando cambien las fechas
  useEffect(() => {
    loadStats()
  }, [dateRange])

  // Funciones para establecer períodos predefinidos
  const setLastWeek = () => {
    setDateRange({
      from: subDays(new Date(), 7),
      to: new Date(),
    })
  }

  const setLastMonth = () => {
    setDateRange({
      from: subMonths(new Date(), 1),
      to: new Date(),
    })
  }

  const setLast3Months = () => {
    setDateRange({
      from: subMonths(new Date(), 3),
      to: new Date(),
    })
  }

  const setLastYear = () => {
    setDateRange({
      from: subYears(new Date(), 1),
      to: new Date(),
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Informes de Peritajes</h1>
          <p className="text-muted-foreground">Análisis y estadísticas de los peritajes realizados</p>
        </div>
        <Button onClick={loadStats} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Filtros de fecha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Filtros de período
          </CardTitle>
          <CardDescription>Selecciona el rango de fechas para generar el informe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
            {/* Período predefinido */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período predefinido</label>
              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "week":
                      setLastWeek()
                      break
                    case "month":
                      setLastMonth()
                      break
                    case "3months":
                      setLast3Months()
                      break
                    case "year":
                      setLastYear()
                      break
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Último mes " />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selector de rango de fechas */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rango de fechas</label>
              <DatePickerWithRange 
                date={dateRange} 
                onDateChange={setDateRange} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de estadísticas */}
      <PeritajesStatsCards stats={stats} loading={loading} />

      {/* Gráfico de torta */}
      <div className="grid gap-6 md:grid-cols-2">
        <PeritajesPieChart stats={stats} loading={loading} />

        {/* Resumen adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Resumen del período
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total de peritajes:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tasa de completados:</span>
                <span className="font-medium">
                  {stats.total > 0 ? Math.round((stats.completados / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tasa de cancelados:</span>
                <span className="font-medium">
                  {stats.total > 0 ? Math.round((stats.cancelados / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pendientes de completar:</span>
                <span className="font-medium">{stats.pendientes + stats.en_proceso}</span>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {stats.completados > stats.cancelados
                    ? "✅ Buen rendimiento en completación de peritajes"
                    : "⚠️ Revisar procesos para reducir cancelaciones"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
