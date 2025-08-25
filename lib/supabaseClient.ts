import { createClient } from '@supabase/supabase-js'

// Crea la instancia del cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// 🔄 Función para actualizar datos básicos del usuario
export async function updateUserData(
  userId: string,
  data: {
    email?: string
    nombre?: string
    apellido?: string
    telefono?: string
    fecha_nacimiento?: string
  }
) {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId)

  if (error) throw error
}


// ❌ Función para eliminar un usuario por ID
export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) throw error
}


// ⚙️ Función para actualizar la configuración personalizada del usuario
export async function updateUserConfiguracion(
  userId: string,
  configuracion: any // JSON con datos personalizados (preferencias, horarios, etc.)
) {
  const { error } = await supabase
    .from('users')
    .update({ configuracion })
    .eq('id', userId)

  if (error) throw error
}


// 👁️ Función para obtener la configuración del usuario
export async function getUserConfiguracion(userId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('users')
    .select('configuracion')
    .eq('id', userId)
    .single()

  if (error) {
    console.error("Error al obtener configuración:", error.message)
    return null
  }

  return data?.configuracion || null
}
