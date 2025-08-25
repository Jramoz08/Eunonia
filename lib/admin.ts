import type { User } from "./auth"
import { supabase } from "@/lib/supabaseClient" // Ajusta la ruta según tu proyecto

export interface User {
  id: string
  email: string
  password_hash: string
  nombre: string
  apellido: string
  rol: "paciente" | "psicologo" | "administrador"
  activo: boolean
  fecha_registro: string
  telefono?: string | null
  fecha_nacimiento?: string | null
  profesion?: string | null
  especialidad?: string | null
  numero_licencia?: string | null
  psicologo_asignado?: string | null
  configuracion?: Record<string, any> | null
  created_at?: string
  updated_at?: string
}

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

export interface ActivityLog {
  id: string
  usuario: string
  accion: string
  detalles: string
  fecha: string
  ip?: string
  exitoso: boolean
}

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

// Obtener estadísticas del sistema (async)
export const getSystemStats = async (): Promise<SystemStats> => {
  const hoy = new Date()
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString()
  const inicioSemana = new Date(hoy)
  inicioSemana.setDate(hoy.getDate() - hoy.getDay())
  const inicioSemanaISO = inicioSemana.toISOString()
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString()

  const { count: totalCount, error: totalError } = await supabase
    .from("users")
    .select("id", { count: "exact" })

  const { count: pacientesCount, error: pacientesError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .eq("rol", "paciente")

  const { count: psicologosCount, error: psicologosError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .eq("rol", "psicologo")

  const { count: administradoresCount, error: adminError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .eq("rol", "administrador")

  const { count: activosCount, error: activosError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .eq("activo", true)

  const { count: inactivosCount, error: inactivosError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .eq("activo", false)

  const { count: registrosHoyCount, error: registrosHoyError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .gte("fecha_registro", inicioHoy)

  const { count: registrosSemanaCount, error: registrosSemanaError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .gte("fecha_registro", inicioSemanaISO)

  const { count: registrosMesCount, error: registrosMesError } = await supabase
    .from("users")
    .select("id", { count: "exact" })
    .gte("fecha_registro", inicioMes)

  if (
    totalError ||
    pacientesError ||
    psicologosError ||
    adminError ||
    activosError ||
    inactivosError ||
    registrosHoyError ||
    registrosSemanaError ||
    registrosMesError
  ) {
    throw new Error("Error al obtener estadísticas del sistema desde Supabase")
  }

  return {
    totalUsuarios: totalCount ?? 0,
    pacientes: pacientesCount ?? 0,
    psicologos: psicologosCount ?? 0,
    administradores: administradoresCount ?? 0,
    usuariosActivos: activosCount ?? 0,
    usuariosInactivos: inactivosCount ?? 0,
    registrosHoy: registrosHoyCount ?? 0,
    registrosSemana: registrosSemanaCount ?? 0,
    registrosMes: registrosMesCount ?? 0,
  }
}

// Obtener alertas de seguridad simuladas (sin cambios)
export const getSecurityAlerts = (): SecurityAlert[] => {
  const alerts = localStorage.getItem("Eunonia_security_alerts")
  if (alerts) {
    return JSON.parse(alerts)
  }

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

  localStorage.setItem("Eunonia_security_alerts", JSON.stringify(defaultAlerts))
  return defaultAlerts
}

// Resolver alerta de seguridad (sin cambios)
export const resolveSecurityAlert = (alertId: string): void => {
  const alerts = getSecurityAlerts()
  const updatedAlerts = alerts.map((alert) => (alert.id === alertId ? { ...alert, resuelto: true } : alert))
  localStorage.setItem("Eunonia_security_alerts", JSON.stringify(updatedAlerts))
}

// Obtener configuración del sistema (sin cambios)
export const getSystemConfig = (): SystemConfig => {
  const config = localStorage.getItem("Eunonia_system_config")
  if (config) {
    return JSON.parse(config)
  }

  const defaultConfig: SystemConfig = {
    requireTwoFactor: false,
    autoLockAccounts: true,
    auditAccess: true,
    securityNotifications: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    backupFrequency: "diario",
  }

  localStorage.setItem("Eunonia_system_config", JSON.stringify(defaultConfig))
  return defaultConfig
}

// Actualizar configuración del sistema (sin cambios)
export const updateSystemConfig = (config: Partial<SystemConfig>): void => {
  const currentConfig = getSystemConfig()
  const updatedConfig = { ...currentConfig, ...config }
  localStorage.setItem("Eunonia_system_config", JSON.stringify(updatedConfig))
}

// Crear usuario desde panel de administrador (async)
export const createUserAsAdmin = async (
  userData: Omit<
    User,
    | "id"
    | "fecha_registro"
    | "activo"
    | "created_at"
    | "updated_at"
  > & { password_hash: string }
): Promise<User> => {
  const insertData = {
    email: userData.email,
    password_hash: userData.password_hash,
    nombre: userData.nombre,
    apellido: userData.apellido,
    rol: userData.rol,
    activo: true,
    fecha_registro: new Date().toISOString(),
    telefono: userData.telefono ?? null,
    fecha_nacimiento: userData.fecha_nacimiento ?? null,
    profesion: userData.profesion ?? null,
    especialidad: userData.especialidad ?? null,
    numero_licencia: userData.numeroLicencia ?? null, // aquí el mapeo
    psicologo_asignado: userData.psicologo_asignado ?? null,
    configuracion: userData.configuracion ?? {},
  }

  const { data, error } = await supabase
    .from("users")
    .insert([insertData])
    .select()
    .single()

  if (error) throw new Error("Error al crear usuario: " + error.message)
  return data as User
}


// Obtener usuarios almacenados (async)
export const getStoredUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from("users").select("*")
  if (error) throw new Error("Error al obtener usuarios: " + error.message)
  return data as User[]
}

// Obtener logs de actividad del sistema (sin cambios)
export const getActivityLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem("Eunonia_activity_logs")
  if (logs) {
    return JSON.parse(logs)
  }

  const defaultLogs: ActivityLog[] = [
    {
      id: "1",
      usuario: "admin@Eunonia.com",
      accion: "LOGIN",
      detalles: "Inicio de sesión exitoso",
      fecha: new Date().toISOString(),
      ip: "192.168.1.1",
      exitoso: true,
    },
    {
      id: "2",
      usuario: "psicologo@Eunonia.com",
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

  localStorage.setItem("Eunonia_activity_logs", JSON.stringify(defaultLogs))
  return defaultLogs
}

// Agregar log de actividad (sin cambios)
export const addActivityLog = (log: Omit<ActivityLog, "id" | "fecha">): void => {
  const logs = getActivityLogs()
  const newLog: ActivityLog = {
    ...log,
    id: Date.now().toString(),
    fecha: new Date().toISOString(),
  }

  logs.unshift(newLog)

  if (logs.length > 1000) {
    logs.splice(1000)
  }

  localStorage.setItem("Eunonia_activity_logs", JSON.stringify(logs))
}

// Exportar datos del sistema (async para usuarios)
export const exportSystemData = async (format: "json" | "csv") => {
  const users = await getStoredUsers()
  const stats = await getSystemStats()
  const alerts = getSecurityAlerts()
  const logs = getActivityLogs()

  const data = {
    exportDate: new Date().toISOString(),
    statistics: stats,
    users: users.map((u) => ({
      ...u,
      password_hash: undefined,
    })),
    securityAlerts: alerts,
    activityLogs: logs,
  }

  if (format === "json") {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Eunonia-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  } else if (format === "csv") {
    const csvContent = [
      "ID,Email,Nombre,Apellido,Rol,Fecha Registro,Activo,Telefono,Fecha Nacimiento,Profesion,Especialidad,Numero Licencia,Psicologo Asignado",
      ...users.map(
        (u) =>
          `${u.id},${u.email},${u.nombre},${u.apellido},${u.rol},${u.fecha_registro},${u.activo},${u.telefono ?? ""},${u.fecha_nacimiento ?? ""},${u.profesion ?? ""},${u.especialidad ?? ""},${u.numero_licencia ?? ""},${u.psicologo_asignado ?? ""}`
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Eunonia-users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Verificar permisos de administrador (sin cambios)
export const isAdmin = (user: User | null): boolean => {
  return user?.rol === "administrador" && user?.activo === true
}

// Obtener métricas de rendimiento del sistema (sin cambios)
export const getSystemMetrics = (): SystemMetrics => {
  return {
    uptime: "99.8%",
    responseTime: Math.floor(Math.random() * 200) + 50,
    memoryUsage: Math.floor(Math.random() * 30) + 50,
    cpuUsage: Math.floor(Math.random() * 40) + 10,
    diskUsage: Math.floor(Math.random() * 20) + 30,
    activeConnections: Math.floor(Math.random() * 100) + 50,
    lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    systemHealth: "good",
  }
}
