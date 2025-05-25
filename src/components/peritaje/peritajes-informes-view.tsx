"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { CalendarIcon, RefreshCw, TrendingUp } from "lucide-react"
import { format, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/src/lib/utils"
import { fetchPeritajesStats } from "@/src/lib/peritajes/stats"
import { useToast } from "@/src/hooks/use-toast"
import PeritajesStatsCards from "./peritajes-stats-cards"
import PeritajesPieChart from "./pertitajes-pie-chart"

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
  const [dateFrom, setDateFrom] = useState<Date>(subMonths(new Date(), 1))
  const [dateTo, setDateTo] = useState<Date>(new Date())
  const [isFromCalendarOpen, setIsFromCalendarOpen] = useState(false)
  const [isToCalendarOpen, setIsToCalendarOpen] = useState(false)

  // Cargar las estadísticas
  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await fetchPeritajesStats(
        format(startOfDay(dateFrom), "yyyy-MM-dd"),
        format(endOfDay(dateTo), "yyyy-MM-dd"),
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
  }, [dateFrom, dateTo])

  // Funciones para establecer períodos predefinidos
  const setLastWeek = () => {
    setDateFrom(subDays(new Date(), 7))
    setDateTo(new Date())
  }

  const setLastMonth = () => {
    setDateFrom(subMonths(new Date(), 1))
    setDateTo(new Date())
  }

  const setLast3Months = () => {
    setDateFrom(subMonths(new Date(), 3))
    setDateTo(new Date())
  }

  const setLastYear = () => {
    setDateFrom(subYears(new Date(), 1))
    setDateTo(new Date())
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
            <CalendarIcon className="mr-2 h-5 w-5" />
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
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fecha desde */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Desde</label>
              <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => {
                      if (date) {
                        setDateFrom(date)
                        setIsFromCalendarOpen(false)
                      }
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Fecha hasta */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hasta</label>
              <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-[240px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => {
                      if (date) {
                        setDateTo(date)
                        setIsToCalendarOpen(false)
                      }
                    }}
                    disabled={(date) => date > new Date() || date < dateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Período seleccionado: {format(dateFrom, "dd/MM/yyyy", { locale: es })} -{" "}
            {format(dateTo, "dd/MM/yyyy", { locale: es })}
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
