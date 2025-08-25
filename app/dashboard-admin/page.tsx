"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, Settings, Bell, TrendingUp, Activity, Database, BarChart3 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { UserManagement } from "@/components/admin/user-management"
import { SecurityPanel } from "@/components/admin/security-panel"
import { SystemMetricsPanel } from "@/components/admin/system-metrics"

interface Stats {
  totalUsuarios: number
  pacientes: number
  psicologos: number
  usuariosActivos: number
  registrosHoy: number
  registrosMes: number
}

export default function DashboardAdmin() {
  const { user, logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalUsuarios: 0,
    pacientes: 0,
    psicologos: 0,
    usuariosActivos: 0,
    registrosHoy: 0,
    registrosMes: 0,
  })

  // Función para obtener estadísticas desde Supabase
  async function fetchStats() {
    // Obtener total de usuarios
    const { count: totalUsuarios } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("activo", true)

    // Contar pacientes activos
    const { count: pacientes } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("rol", "paciente")
      .eq("activo", true)

    // Contar psicologos activos
    const { count: psicologos } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("rol", "psicologo")
      .eq("activo", true)

    // Usuarios activos (puedes definir qué es "activo", aquí supongo "activo = true")
    const { count: usuariosActivos } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("activo", true)

    // Registros de hoy
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const { count: registrosHoy } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("fecha_registro", startOfToday.toISOString())
      .eq("activo", true)

    // Registros de este mes
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const { count: registrosMes } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("fecha_registro", startOfMonth.toISOString())
      .eq("activo", true)

    setStats({
      totalUsuarios: totalUsuarios ?? 0,
      pacientes: pacientes ?? 0,
      psicologos: psicologos ?? 0,
      usuariosActivos: usuariosActivos ?? 0,
      registrosHoy: registrosHoy ?? 0,
      registrosMes: registrosMes ?? 0,
    })
  }

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.rol !== "administrador") {
        router.push("/auth/login")
        return
      }
      fetchStats()
    }
  }, [isAuthenticated, user, router, loading])

  const handleStatsUpdate = () => {
    fetchStats()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || user.rol !== "administrador") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-12" />
              </div>
              <span className="text-xl font-bold text-gray-900">Eunonia</span>
              <Badge className="bg-red-100 text-red-700">Administrador</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium">
                  {user.nombre} {user.apellido}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <a href="/">
                  Cerrar Sesión
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración 🛡️</h1>
          <p className="text-gray-600">Gestión completa del sistema y usuarios de Eunonia</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsuarios}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes</p>
                  <p className="text-2xl font-bold text-green-600">{stats.pacientes}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Psicólogos</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.psicologos}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.usuariosActivos}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Registros Hoy</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.registrosHoy}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <UserManagement onUserUpdate={handleStatsUpdate} />
          </TabsContent>

          <TabsContent value="seguridad">
            <SecurityPanel />
          </TabsContent>

          <TabsContent value="sistema">
            <SystemMetricsPanel />
          </TabsContent>

          <TabsContent value="reportes" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reporte de Usuarios</CardTitle>
                  <CardDescription>Estadísticas de registro y actividad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registros este mes:</span>
                      <span className="font-semibold">{stats.registrosMes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usuarios activos:</span>
                      <span className="font-semibold">{stats.usuariosActivos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de retención:</span>
                      <span className="font-semibold">87%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generar Reporte Completo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reporte de Seguridad</CardTitle>
                  <CardDescription>Eventos y alertas de seguridad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intentos de login fallidos:</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alertas de seguridad:</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accesos bloqueados:</span>
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Ver Reporte de Seguridad
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reporte del Sistema</CardTitle>
                  <CardDescription>Rendimiento y uso de recursos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo de actividad:</span>
                      <span className="font-semibold">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo de respuesta promedio:</span>
                      <span className="font-semibold">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Errores del sistema:</span>
                      <span className="font-semibold">0</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Análisis de Rendimiento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
