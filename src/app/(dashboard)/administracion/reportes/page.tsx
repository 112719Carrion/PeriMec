"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { DatePickerWithRange } from "@/src/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { createServiceClient } from "@/src/lib/supabase"
import { useToast } from "@/src/hooks/use-toast"
import PaymentDistribution from "@/src/components/admin/payment-distribution"
import { DateRange } from "react-day-picker"

interface ReportData {
  user_id: string
  user_name: string
  total_peritajes: number
  completados: number
  pendientes: number
  en_proceso: number
  cancelados: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportesPage() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [users, setUsers] = useState<{ id: string; full_name: string }[]>([])
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      const supabase = createServiceClient()
      const { data: usersData, error } = await supabase!
        .from("profiles")
        .select("id, full_name")
        .in("role", ["admin", "perito"])
        .order("full_name")

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        })
        return
      }

      setUsers(usersData || [])
    }

    loadUsers()
  }, [toast])

  // Cargar datos del reporte
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true)
      const supabase = createServiceClient()

      let query = supabase!
        .from("peritajes")
        .select("user_id, estado, created_at")

      if (dateRange.from && dateRange.to) {
        query = query
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
      }

      if (selectedUser !== "all") {
        query = query.eq("user_id", selectedUser)
      }

      if (selectedStatus !== "all") {
        query = query.eq("estado", selectedStatus)
      }

      const { data, error } = await query

      if (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del reporte",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Procesar datos para el reporte
      const processedData = users.map(user => {
        const userPeritajes = data?.filter(p => p.user_id === user.id) || []
        return {
          user_id: user.id,
          user_name: user.full_name,
          total_peritajes: userPeritajes.length,
          completados: userPeritajes.filter(p => p.estado === "completado").length,
          pendientes: userPeritajes.filter(p => p.estado === "pendiente").length,
          en_proceso: userPeritajes.filter(p => p.estado === "en_proceso").length,
          cancelados: userPeritajes.filter(p => p.estado === "cancelado").length,
        }
      })

      setReportData(processedData)
      setLoading(false)
    }

    loadReportData()
  }, [dateRange, selectedUser, selectedStatus, users, toast])

  // Preparar datos para el gráfico
  const chartData = reportData.map(data => ({
    name: data.user_name,
    value: data.total_peritajes,
  }))

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Reportes de Peritajes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rango de fechas</CardTitle>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange 
              date={dateRange} 
              onDateChange={(range) => {
                if (range?.from && range?.to) {
                  setDateRange(range)
                }
              }} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_proceso">En proceso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico y Tabla */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Peritajes por Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalle por Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Usuario</th>
                    <th className="text-center py-2">Total</th>
                    <th className="text-center py-2">Completados</th>
                    <th className="text-center py-2">Pendientes</th>
                    <th className="text-center py-2">En proceso</th>
                    <th className="text-center py-2">Cancelados</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map(data => (
                    <tr key={data.user_id} className="border-b">
                      <td className="py-2">{data.user_name}</td>
                      <td className="text-center py-2">{data.total_peritajes}</td>
                      <td className="text-center py-2">{data.completados}</td>
                      <td className="text-center py-2">{data.pendientes}</td>
                      <td className="text-center py-2">{data.en_proceso}</td>
                      <td className="text-center py-2">{data.cancelados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 