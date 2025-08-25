import { Dialog } from "@/components/ui/dialog"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"

// Asumiendo que Dialog implementa Modal con open / onOpenChange props

export default function UserSettingsModal() {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        nombre: user?.nombre || "",
        apellido: user?.apellido || "",
        telefono: user?.telefono || "",
        fecha_nacimiento: user?.fecha_nacimiento || "",
        profesion: user?.profesion || "",
        especialidad: user?.especialidad || "",
        numero_licencia: user?.numero_licencia || "",
    })
    const [loading, setLoading] = useState(false)

    if (!user) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async () => {
        setLoading(true)
        const updates = {
            ...form,
            updated_at: new Date().toISOString(),
        }
        const { data, error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", user.id)

        setLoading(false)
        if (error) {
            alert("Error al actualizar: " + error.message)
        } else {
            alert("Perfil actualizado")
            setOpen(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Deseas eliminar tu cuenta? Esto eliminará todos tus datos.")) return
        setLoading(true)
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", user.id)

        setLoading(false)
        if (error) {
            alert("Error al eliminar: " + error.message)
        } else {
            alert("Cuenta eliminada")
            logout()
        }
    }

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                <Settings className="w-4 h-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <Dialog.Header>
                    <h2 className="text-lg font-bold">Configuración del Perfil</h2>
                </Dialog.Header>
                <Dialog.Content>
                    <div className="space-y-4">
                        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
                        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
                        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
                        <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} placeholder="Fecha de Nac." />
                        <input name="profesion" value={form.profesion} onChange={handleChange} placeholder="Profesión" />
                        <input name="especialidad" value={form.especialidad} onChange={handleChange} placeholder="Especialidad" />
                        <input name="numero_licencia" value={form.numero_licencia} onChange={handleChange} placeholder="Número de licencia" />
                    </div>
                </Dialog.Content>
                <Dialog.Footer>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Eliminando..." : "Eliminar Cuenta"}
                    </Button>
                </Dialog.Footer>
            </Dialog>
        </>
    )
}
