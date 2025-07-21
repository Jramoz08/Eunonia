"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  Activity,
  TrendingUp,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Download,
  RefreshCw,
} from "lucide-react"
import { getSystemMetrics, type SystemMetrics } from "@/lib/admin"

export function SystemMetricsPanel() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadMetrics()
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadMetrics = async () => {
    setIsRefreshing(true)
    // Simular delay de carga
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setMetrics(getSystemMetrics())
    setIsRefreshing(false)
  }

  const getHealthColor = (health: SystemMetrics["systemHealth"]) => {
    switch (health) {
      case "excellent":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "critical":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getHealthIcon = (health: SystemMetrics["systemHealth"]) => {
    switch (health) {
      case "excellent":
        return "🟢"
      case "good":
        return "🔵"
      case "warning":
        return "🟡"
      case "critical":
        return "🔴"
      default:
        return "⚪"
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return "bg-red-500"
    if (usage >= 70) return "bg-yellow-500"
    if (usage >= 50) return "bg-blue-500"
    return "bg-green-500"
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estado general */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>Estado del Sistema</span>
              </CardTitle>
              <CardDescription>Monitoreo en tiempo real del rendimiento del sistema</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getHealthColor(metrics.systemHealth)}>
                {getHealthIcon(metrics.systemHealth)}{" "}
                {metrics.systemHealth.charAt(0).toUpperCase() + metrics.systemHealth.slice(1)}
              </Badge>
              <Button variant="outline" size="sm" onClick={loadMetrics} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo de Actividad</p>
                <p className="text-2xl font-bold text-green-600">{metrics.uptime}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo de Respuesta</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.responseTime}ms</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conexiones Activas</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.activeConnections}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Último Backup</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(metrics.lastBackup).toLocaleString("es-ES")}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uso de recursos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5" />
              <span>Uso de CPU</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.cpuUsage}%</span>
                <Badge className={metrics.cpuUsage > 80 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                  {metrics.cpuUsage > 80 ? "Alto" : "Normal"}
                </Badge>
              </div>
              <Progress
                value={metrics.cpuUsage}
                className="w-full"
                // @ts-ignore
                indicatorClassName={getUsageColor(metrics.cpuUsage)}
              />
              <p className="text-sm text-gray-600">Promedio de los últimos 5 minutos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MemoryStick className="w-5 h-5" />
              <span>Uso de Memoria</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.memoryUsage}%</span>
                <Badge className={metrics.memoryUsage > 80 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                  {metrics.memoryUsage > 80 ? "Alto" : "Normal"}
                </Badge>
              </div>
              <Progress
                value={metrics.memoryUsage}
                className="w-full"
                // @ts-ignore
                indicatorClassName={getUsageColor(metrics.memoryUsage)}
              />
              <p className="text-sm text-gray-600">RAM utilizada del total disponible</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5" />
              <span>Espacio en Disco</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metrics.diskUsage}%</span>
                <Badge className={metrics.diskUsage > 80 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
                  {metrics.diskUsage > 80 ? "Alto" : "Normal"}
                </Badge>
              </div>
              <Progress
                value={metrics.diskUsage}
                className="w-full"
                // @ts-ignore
                indicatorClassName={getUsageColor(metrics.diskUsage)}
              />
              <p className="text-sm text-gray-600">Almacenamiento utilizado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones de mantenimiento */}
      <Card>
        <CardHeader>
          <CardTitle>Mantenimiento del Sistema</CardTitle>
          <CardDescription>Herramientas para el mantenimiento y optimización del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Realizar Backup
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              Limpiar Logs
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimizar BD
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
