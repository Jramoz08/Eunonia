"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabaseClient"

export default function UserSettingsButton() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nombre, setNombre] = useState(user?.nombre || "")
  const [apellido, setApellido] = useState(user?.apellido || "")
  const [telefono, setTelefono] = useState(user?.telefono || "")
  const [fechaNacimiento, setFechaNacimiento] = useState(user?.fecha_nacimiento || "")

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from("users")
      .update({
        nombre,
        apellido,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        updated_at: new Date(),
      })
      .eq("id", user?.id)

    setLoading(false)

    if (!error) {
      alert("Datos actualizados con éxito")
      setOpen(false)
    } else {
      alert("Error al actualizar: " + error.message)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.")
    if (!confirmed || !user?.id) return

    // Llama a una función de RLS o backend para eliminar en cascada si es necesario
    const { error } = await supabase.from("users").delete().eq("id", user.id)

    if (error) {
      alert("Error al eliminar la cuenta: " + error.message)
    } else {
      logout()
      alert("Tu cuenta ha sido eliminada.")
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Settings className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configuración de Usuario</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <Input placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            <Input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <Input
              placeholder="Fecha de nacimiento"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />

            <div className="flex justify-between mt-4">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
