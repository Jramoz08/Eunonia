import { supabase } from '../lib/supabaseClient'
import bcrypt from "bcryptjs"

export type UserRole = "paciente" | "psicologo" | "administrador"

export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: UserRole
  telefono?: string
  fecha_registro: string
  activo: boolean
  especialidad?: string
  numeroLicencia?: string
  // Nota: password_hash no está aquí para evitar exponerlo en la app
}

// Nuevo tipo para registro, incluye password en texto plano
export interface UserRegistrationData extends Omit<User, "id" | "fecha_registro" | "activo"> {
  password: string
}

// Usuarios de prueba para inicializar
const defaultUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@Eunonia.com",
    nombre: "Ana",
    apellido: "Administradora",
    rol: "administrador",
    telefono: "+34 600 000 001",
    fecha_registro: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
  },
  {
    id: "psi-1",
    email: "psicologo@Eunonia.com",
    nombre: "Dr. Carlos",
    apellido: "García",
    rol: "psicologo",
    telefono: "+34 600 000 002",
    fecha_registro: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
    especialidad: "Psicología Clínica",
    numeroLicencia: "COL-12345",
  },
  {
    id: "psi-2",
    email: "maria.lopez@Eunonia.com",
    nombre: "Dra. María",
    apellido: "López",
    rol: "psicologo",
    telefono: "+34 600 000 003",
    fecha_registro: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
    especialidad: "Terapia Cognitivo-Conductual",
    numeroLicencia: "COL-67890",
  },
  {
    id: "pac-1",
    email: "paciente@Eunonia.com",
    nombre: "Juan",
    apellido: "Pérez",
    rol: "paciente",
    telefono: "+34 600 000 004",
    fecha_registro: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
  },
  {
    id: "pac-2",
    email: "laura.martinez@email.com",
    nombre: "Laura",
    apellido: "Martínez",
    rol: "paciente",
    telefono: "+34 600 000 005",
    fecha_registro: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    activo: true,
  },
  {
    id: "pac-3",
    email: "pedro.sanchez@email.com",
    nombre: "Pedro",
    apellido: "Sánchez",
    rol: "paciente",
    telefono: "+34 600 000 006",
    fecha_registro: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    activo: false,
  },
  {
    id: "pac-4",
    email: "sofia.rodriguez@email.com",
    nombre: "Sofía",
    apellido: "Rodríguez",
    rol: "paciente",
    telefono: "+34 600 000 007",
    fecha_registro: new Date().toISOString(),
    activo: true,
  },
]

// Inicializar usuarios por defecto si no existen en la base
export const initializeDefaultUsers = async (): Promise<void> => {
  const { data, error } = await supabase.from('users').select('id').limit(1)
  if (error) {
    console.error("Error comprobando usuarios:", error)
    return
  }
  if (!data || data.length === 0) {
    const { error: insertError } = await supabase.from('users').insert(defaultUsers)
    if (insertError) {
      console.error("Error insertando usuarios por defecto:", insertError)
    }
  }
}

// Obtener todos los usuarios
export const getStoredUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) {
    console.error("Error obteniendo usuarios:", error)
    return []
  }
  return data || []
}

// Guardar usuario (crear o actualizar)
export const storeUser = async (user: User): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .upsert(user, { onConflict: 'id' })
  if (error) {
    console.error("Error guardando usuario:", error)
    throw error
  }
}

// Actualizar estado activo/inactivo
export const updateUserStatus = async (userId: string, newStatus: boolean) => {
  const { data, error } = await supabase
    .from("users")
    .update({ activo: newStatus })
    .eq("id", userId)
    .select() // opcional para debug

  if (error) {
    console.error("Error actualizando usuario:", error.message)
    throw error
  }

  console.log("Usuario actualizado:", data)
}

// Autenticar usuario (chequeo email + activo + password hash)
export const loginUserWithPassword = async (email: string, plainPassword: string): Promise<User | null> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('activo', true)
    .single()

  if (error || !user) {
    console.error("Usuario no encontrado o inactivo:", error)
    return null
  }

  const passwordMatch = await bcrypt.compare(plainPassword, user.password_hash)
  if (!passwordMatch) {
    console.warn("Contraseña incorrecta para:", email)
    return null
  }

  return user
}

// Registrar nuevo usuario con hash de password
export const registerUser = async (userData: UserRegistrationData): Promise<User> => {
  const { email, password, ...rest } = userData

  const { data: existing, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)

  if (checkError) throw checkError
  if (existing && existing.length > 0) throw new Error("El email ya está registrado")

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    ...rest,
    email,
    password_hash: hashedPassword,
    fecha_registro: new Date().toISOString(),
    activo: true,
  }

  const { data, error } = await supabase
    .from('users')
    .insert(newUser)
    .select()
    .single()

  if (error) throw error
  return data!
}

// Obtener usuario por ID con validación para evitar error UUID
export const getUserById = async (id?: string | null): Promise<User | null> => {
  if (!id) {
    console.error("Error: 'id' no puede ser undefined o null")
    return null
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error("Error obteniendo usuario por ID:", error)
    return null
  }
  return data || null
}

// Obtener usuarios por rol
export const getUsersByRole = async (rol: UserRole): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('rol', rol)
  if (error) {
    console.error("Error obteniendo usuarios por rol:", error)
    return []
  }
  return data || []
}

// Verificar si es administrador
export const isAdmin = (user: User | null): boolean => {
  return user?.rol === "administrador" && user?.activo === true
}

// Obtener estadísticas
export const getUserStats = async () => {
  const users = await getStoredUsers()
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
    registrosHoy: users.filter((u) => new Date(u.fecha_registro).toDateString() === today.toDateString()).length,
    registrosSemana: users.filter((u) => new Date(u.fecha_registro) >= weekAgo).length,
    registrosMes: users.filter((u) => new Date(u.fecha_registro) >= monthAgo).length,
  }
}
