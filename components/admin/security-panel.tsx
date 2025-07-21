"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Activity, Settings, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import {
  getSecurityAlerts,
  resolveSecurityAlert,
  getSystemConfig,
  updateSystemConfig,
  getActivityLogs,
  type SecurityAlert,
  type SystemConfig,
  type ActivityLog,
} from "@/lib/admin"

export function SecurityPanel() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = () => {
    setAlerts(getSecurityAlerts())
    setConfig(getSystemConfig())
    setLogs(getActivityLogs())
  }

  const handleResolveAlert = (alertId: string) => {
    resolveSecurityAlert(alertId)
    loadSecurityData()
    setSuccess("Alerta resuelta correctamente")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleConfigChange = (key: keyof SystemConfig, value: boolean | number | string) => {
    if (!config) return

    const updatedConfig = { ...config, [key]: value }
    setConfig(updatedConfig)
    updateSystemConfig({ [key]: value })
    setSuccess("Configuración actualizada")
    setTimeout(() => setSuccess(""), 3000)
  }

  const getSeverityColor = (severidad: SecurityAlert["severidad"]) => {
    switch (severidad) {
      case "alta":
        return "bg-red-100 text-red-700"
      case "media":
        return "bg-yellow-100 text-yellow-700"
      case "baja":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getSeverityIcon = (severidad: SecurityAlert["severidad"]) => {
    switch (severidad) {
      case "alta":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "media":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "baja":
        return <AlertTriangle className="w-4 h-4 text-blue-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const unresolvedAlerts = alerts.filter((alert) => !alert.resuelto)
  const resolvedAlerts = alerts.filter((alert) => alert.resuelto)

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alertas de Seguridad</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="logs">Logs de Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Alertas Activas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Alertas Activas ({unresolvedAlerts.length})</span>
                </CardTitle>
                <CardDescription>Eventos de seguridad que requieren atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unresolvedAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas activas</h3>
                      <p className="text-gray-500">Todos los eventos de seguridad han sido resueltos</p>
                    </div>
                  ) : (
                    unresolvedAlerts.map((alerta) => (
                      <div key={alerta.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            alerta.severidad === "alta"
                              ? "bg-red-100"
                              : alerta.severidad === "media"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                          }`}
                        >
                          {getSeverityIcon(alerta.severidad)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{alerta.mensaje}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getSeverityColor(alerta.severidad)}>
                              {alerta.severidad.charAt(0).toUpperCase() + alerta.severidad.slice(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(alerta.fecha).toLocaleString("es-ES")}
                            </span>
                          </div>
                          {alerta.usuario && <p className="text-xs text-gray-600 mt-1">Usuario: {alerta.usuario}</p>}
                          {alerta.ip && <p className="text-xs text-gray-600">IP: {alerta.ip}</p>}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alerta.id)}>
                          Resolver
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Alertas Resueltas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Alertas Resueltas ({resolvedAlerts.length})</span>
                </CardTitle>
                <CardDescription>Historial de eventos de seguridad resueltos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {resolvedAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas resueltas</h3>
                      <p className="text-gray-500">Las alertas resueltas aparecerán aquí</p>
                    </div>
                  ) : (
                    resolvedAlerts.map((alerta) => (
                      <div
                        key={alerta.id}
                        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{alerta.mensaje}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Resuelto
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(alerta.fecha).toLocaleString("es-ES")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Configuración de Seguridad</span>
              </CardTitle>
              <CardDescription>Ajusta las configuraciones de seguridad del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {config && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-gray-600">Requerir 2FA para todos los usuarios del sistema</p>
                    </div>
                    <Switch
                      checked={config.requireTwoFactor}
                      onCheckedChange={(checked) => handleConfigChange("requireTwoFactor", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Bloqueo automático de cuentas</h4>
                      <p className="text-sm text-gray-600">Bloquear cuentas tras múltiples intentos fallidos</p>
                    </div>
                    <Switch
                      checked={config.autoLockAccounts}
                      onCheckedChange={(checked) => handleConfigChange("autoLockAccounts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auditoría de accesos</h4>
                      <p className="text-sm text-gray-600">Registrar todos los accesos y acciones en el sistema</p>
                    </div>
                    <Switch
                      checked={config.auditAccess}
                      onCheckedChange={(checked) => handleConfigChange("auditAccess", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificaciones de seguridad</h4>
                      <p className="text-sm text-gray-600">Enviar alertas por email para eventos críticos</p>
                    </div>
                    <Switch
                      checked={config.securityNotifications}
                      onCheckedChange={(checked) => handleConfigChange("securityNotifications", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Tiempo de sesión (minutos)</h4>
                      <input
                        type="number"
                        value={config.sessionTimeout}
                        onChange={(e) => handleConfigChange("sessionTimeout", Number.parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="5"
                        max="480"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Máximo intentos de login</h4>
                      <input
                        type="number"
                        value={config.maxLoginAttempts}
                        onChange={(e) => handleConfigChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="3"
                        max="10"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Longitud mínima de contraseña</h4>
                      <input
                        type="number"
                        value={config.passwordMinLength}
                        onChange={(e) => handleConfigChange("passwordMinLength", Number.parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="6"
                        max="20"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Frecuencia de backup</h4>
                      <select
                        value={config.backupFrequency}
                        onChange={(e) => handleConfigChange("backupFrequency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Logs de Actividad</span>
              </CardTitle>
              <CardDescription>Registro detallado de todas las actividades del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay logs disponibles</h3>
                    <p className="text-gray-500">Los logs de actividad aparecerán aquí</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.exitoso ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {log.exitoso ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{log.accion}</span>
                          <Badge className={log.exitoso ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                            {log.exitoso ? "Exitoso" : "Fallido"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{log.detalles}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Usuario: {log.usuario}</span>
                          <span>Fecha: {new Date(log.fecha).toLocaleString("es-ES")}</span>
                          {log.ip && <span>IP: {log.ip}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
