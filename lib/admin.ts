import type { User } from "./auth"
import { getStoredUsers, storeUser, getUserStats } from "./auth"

export interface SystemStats {
  totalUsuarios: number
  pacientes: number
  psicologos: number
  administradores: number
  usuariosActivos: number
  usuariosInactivos: number
  registrosHoy: number
  registrosSemana: number
  registrosMes: number
}

export interface SecurityAlert {
  id: string
  tipo: "login_fallido" | "usuario_inactivo" | "datos_sensibles" | "acceso_no_autorizado"
  mensaje: string
  fecha: string
  severidad: "baja" | "media" | "alta"
  usuario?: string
  ip?: string
  resuelto: boolean
}

export interface SystemConfig {
  requireTwoFactor: boolean
  autoLockAccounts: boolean
  auditAccess: boolean
  securityNotifications: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  backupFrequency: "diario" | "semanal" | "mensual"
}

// Obtener estadísticas del sistema
export const getSystemStats = (): SystemStats => {
  const stats = getUserStats()

  return {
    totalUsuarios: stats.total,
    pacientes: stats.pacientes,
    psicologos: stats.psicologos,
    administradores: stats.administradores,
    usuariosActivos: stats.activos,
    usuariosInactivos: stats.inactivos,
    registrosHoy: stats.registrosHoy,
    registrosSemana: stats.registrosSemana,
    registrosMes: stats.registrosMes,
  }
}

// Obtener alertas de seguridad simuladas
export const getSecurityAlerts = (): SecurityAlert[] => {
  const alerts = localStorage.getItem("mentalwell_security_alerts")
  if (alerts) {
    return JSON.parse(alerts)
  }

  // Alertas de ejemplo
  const defaultAlerts: SecurityAlert[] = [
    {
      id: "1",
      tipo: "login_fallido",
      mensaje: "Múltiples intentos de login fallidos desde IP 192.168.1.100",
      fecha: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      severidad: "alta",
      ip: "192.168.1.100",
      resuelto: false,
    },
    {
      id: "2",
      tipo: "usuario_inactivo",
      mensaje: "Dr. García no ha accedido al sistema en 30 días",
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severidad: "media",
      usuario: "Dr. García",
      resuelto: false,
    },
    {
      id: "3",
      tipo: "datos_sensibles",
      mensaje: "Acceso a datos sensibles fuera del horario habitual",
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      severidad: "alta",
      resuelto: true,
    },
  ]

  localStorage.setItem("mentalwell_security_alerts", JSON.stringify(defaultAlerts))
  return defaultAlerts
}

// Resolver alerta de seguridad
export const resolveSecurityAlert = (alertId: string): void => {
  const alerts = getSecurityAlerts()
  const updatedAlerts = alerts.map((alert) => (alert.id === alertId ? { ...alert, resuelto: true } : alert))
  localStorage.setItem("mentalwell_security_alerts", JSON.stringify(updatedAlerts))
}

// Obtener configuración del sistema
export const getSystemConfig = (): SystemConfig => {
  const config = localStorage.getItem("mentalwell_system_config")
  if (config) {
    return JSON.parse(config)
  }

  const defaultConfig: SystemConfig = {
    requireTwoFactor: false,
    autoLockAccounts: true,
    auditAccess: true,
    securityNotifications: true,
    sessionTimeout: 30, // minutos
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    backupFrequency: "diario",
  }

  localStorage.setItem("mentalwell_system_config", JSON.stringify(defaultConfig))
  return defaultConfig
}

// Actualizar configuración del sistema
export const updateSystemConfig = (config: Partial<SystemConfig>): void => {
  const currentConfig = getSystemConfig()
  const updatedConfig = { ...currentConfig, ...config }
  localStorage.setItem("mentalwell_system_config", JSON.stringify(updatedConfig))
}

// Crear usuario desde panel de administrador
export const createUserAsAdmin = (userData: Omit<User, "id" | "fechaRegistro" | "activo">): User => {
  const newUser: User = {
    ...userData,
    id: `admin-created-${Date.now()}`,
    fechaRegistro: new Date().toISOString(),
    activo: true,
  }

  storeUser(newUser)
  return newUser
}

// Obtener logs de actividad del sistema
export interface ActivityLog {
  id: string
  usuario: string
  accion: string
  detalles: string
  fecha: string
  ip?: string
  exitoso: boolean
}

export const getActivityLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem("mentalwell_activity_logs")
  if (logs) {
    return JSON.parse(logs)
  }

  // Logs de ejemplo
  const defaultLogs: ActivityLog[] = [
    {
      id: "1",
      usuario: "admin@mentalwell.com",
      accion: "LOGIN",
      detalles: "Inicio de sesión exitoso",
      fecha: new Date().toISOString(),
      ip: "192.168.1.1",
      exitoso: true,
    },
    {
      id: "2",
      usuario: "psicologo@mentalwell.com",
      accion: "VIEW_PATIENT",
      detalles: "Acceso a perfil de paciente",
      fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      exitoso: true,
    },
    {
      id: "3",
      usuario: "unknown",
      accion: "LOGIN_FAILED",
      detalles: "Intento de login fallido",
      fecha: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      ip: "192.168.1.100",
      exitoso: false,
    },
  ]

  localStorage.setItem("mentalwell_activity_logs", JSON.stringify(defaultLogs))
  return defaultLogs
}

// Agregar log de actividad
export const addActivityLog = (log: Omit<ActivityLog, "id" | "fecha">): void => {
  const logs = getActivityLogs()
  const newLog: ActivityLog = {
    ...log,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
  }

  logs.unshift(newLog) // Agregar al inicio

  // Mantener solo los últimos 1000 logs
  if (logs.length > 1000) {
    logs.splice(1000)
  }

  localStorage.setItem("mentalwell_activity_logs", JSON.stringify(logs))
}

// Exportar datos del sistema
export const exportSystemData = (format: "json" | "csv") => {
  const users = getStoredUsers()
  const stats = getSystemStats()
  const alerts = getSecurityAlerts()
  const logs = getActivityLogs()

  const data = {
    exportDate: new Date().toISOString(),
    statistics: stats,
    users: users.map((u) => ({
      ...u,
      // Remover información sensible
      password: undefined,
    })),
    securityAlerts: alerts,
    activityLogs: logs,
  }

  if (format === "json") {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mentalwell-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  } else if (format === "csv") {
    // Exportar usuarios como CSV
    const csvContent = [
      "ID,Email,Nombre,Apellido,Rol,Fecha Registro,Activo,Especialidad,Numero Licencia",
      ...users.map(
        (u) =>
          `${u.id},${u.email},${u.nombre},${u.apellido},${u.rol},${u.fechaRegistro},${u.activo},${u.especialidad || ""},${u.numeroLicencia || ""}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mentalwell-users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Verificar permisos de administrador
export const isAdmin = (user: User | null): boolean => {
  return user?.rol === "administrador" && user?.activo === true
}

// Obtener métricas de rendimiento del sistema
export interface SystemMetrics {
  uptime: string
  responseTime: number
  memoryUsage: number
  cpuUsage: number
  diskUsage: number
  activeConnections: number
  lastBackup: string
  systemHealth: "excellent" | "good" | "warning" | "critical"
}

export const getSystemMetrics = (): SystemMetrics => {
  // Simulación de métricas del sistema
  return {
    uptime: "99.8%",
    responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
    memoryUsage: Math.floor(Math.random() * 30) + 50, // 50-80%
    cpuUsage: Math.floor(Math.random() * 40) + 10, // 10-50%
    diskUsage: Math.floor(Math.random() * 20) + 30, // 30-50%
    activeConnections: Math.floor(Math.random() * 100) + 50,
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    systemHealth: "good",
  }
}
