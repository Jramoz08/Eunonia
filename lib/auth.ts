export type UserRole = "paciente" | "psicologo" | "administrador"

export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  telefono?: string
  fechaRegistro: string
  activo: boolean
  especialidad?: string
  numeroLicencia?: string
}

// Usuarios de prueba
const defaultUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@mentalwell.com",
    nombre: "Ana",
    apellido: "Administradora",
    rol: "administrador",
    telefono: "+34 600 000 001",
    fechaRegistro: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
  },
  {
    id: "psi-1",
    email: "psicologo@mentalwell.com",
    nombre: "Dr. Carlos",
    apellido: "García",
    rol: "psicologo",
    telefono: "+34 600 000 002",
    fechaRegistro: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
    especialidad: "Psicología Clínica",
    numeroLicencia: "COL-12345",
  },
  {
    id: "psi-2",
    email: "maria.lopez@mentalwell.com",
    nombre: "Dra. María",
    apellido: "López",
    rol: "psicologo",
    telefono: "+34 600 000 003",
    fechaRegistro: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
    especialidad: "Terapia Cognitivo-Conductual",
    numeroLicencia: "COL-67890",
  },
  {
    id: "pac-1",
    email: "paciente@mentalwell.com",
    nombre: "Juan",
    apellido: "Pérez",
    rol: "paciente",
    telefono: "+34 600 000 004",
    fechaRegistro: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
  },
  {
    id: "pac-2",
    email: "laura.martinez@email.com",
    nombre: "Laura",
    apellido: "Martínez",
    rol: "paciente",
    telefono: "+34 600 000 005",
    fechaRegistro: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
  },
  {
    id: "pac-3",
    email: "pedro.sanchez@email.com",
    nombre: "Pedro",
    apellido: "Sánchez",
    rol: "paciente",
    telefono: "+34 600 000 006",
    fechaRegistro: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    activo: false,
  },
  {
    id: "pac-4",
    email: "sofia.rodriguez@email.com",
    nombre: "Sofía",
    apellido: "Rodríguez",
    rol: "paciente",
    telefono: "+34 600 000 007",
    fechaRegistro: new Date().toISOString(),
    activo: true,
  },
]

// Inicializar usuarios por defecto si no existen
const initializeDefaultUsers = () => {
  const existingUsers = localStorage.getItem("mentalwell_users")
  if (!existingUsers) {
    localStorage.setItem("mentalwell_users", JSON.stringify(defaultUsers))
  }
}

// Obtener todos los usuarios
export const getStoredUsers = (): User[] => {
  initializeDefaultUsers()
  const users = localStorage.getItem("mentalwell_users")
  return users ? JSON.parse(users) : []
}

// Guardar usuario
export const storeUser = (user: User): void => {
  const users = getStoredUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem("mentalwell_users", JSON.stringify(users))
}

// Actualizar estado de usuario
export const updateUserStatus = (userId: string, activo: boolean): void => {
  const users = getStoredUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex >= 0) {
    users[userIndex].activo = activo
    localStorage.setItem("mentalwell_users", JSON.stringify(users))
  }
}

// Autenticar usuario
export const authenticateUser = (email: string, password: string): User | null => {
  const users = getStoredUsers()
  const user = users.find((u) => u.email === email && u.activo)

  // Simulación de autenticación (en producción verificar password hash)
  if (user) {
    return user
  }

  return null
}

// Registrar nuevo usuario
export const registerUser = (userData: Omit<User, "id" | "fechaRegistro" | "activo">): User => {
  const users = getStoredUsers()

  // Verificar si el email ya existe
  if (users.some((u) => u.email === userData.email)) {
    throw new Error("El email ya está registrado")
  }

  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    fechaRegistro: new Date().toISOString(),
    activo: true,
  }

  storeUser(newUser)
  return newUser
}

// Obtener usuario por ID
export const getUserById = (id: string): User | null => {
  const users = getStoredUsers()
  return users.find((u) => u.id === id) || null
}

// Obtener usuarios por rol
export const getUsersByRole = (rol: UserRole): User[] => {
  const users = getStoredUsers()
  return users.filter((u) => u.rol === rol)
}

// Verificar si es administrador
export const isAdmin = (user: User | null): boolean => {
  return user?.rol === "administrador" && user?.activo === true
}

// Obtener estadísticas de usuarios
export const getUserStats = () => {
  const users = getStoredUsers()
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    total: users.length,
    activos: users.filter((u) => u.activo).length,
    inactivos: users.filter((u) => !u.activo).length,
    pacientes: users.filter((u) => u.rol === "paciente").length,
    psicologos: users.filter((u) => u.rol === "psicologo").length,
    administradores: users.filter((u) => u.rol === "administrador").length,
    registrosHoy: users.filter((u) => new Date(u.fechaRegistro).toDateString() === today.toDateString()).length,
    registrosSemana: users.filter((u) => new Date(u.fechaRegistro) >= weekAgo).length,
    registrosMes: users.filter((u) => new Date(u.fechaRegistro) >= monthAgo).length,
  }
}
