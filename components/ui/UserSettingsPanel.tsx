"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { updateUserData, deleteUser } from "@/lib/supabaseClient"

export default function UserSettingsPanel() {
    const { user, logout } = useAuth()

    const [email, setEmail] = useState(user?.email || "")
    const [nombre, setNombre] = useState(user?.nombre || "")
    const [apellido, setApellido] = useState(user?.apellido || "")
    const [telefono, setTelefono] = useState(user?.telefono || "")
    const [fechaNacimiento, setFechaNacimiento] = useState(user?.fecha_nacimiento || "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateUserData(user.id, {
                email,
                nombre,
                apellido,
                telefono,
                fecha_nacimiento: fechaNacimiento,
            })
            alert("Datos actualizados correctamente")
            window.location.reload()  // Recarga la página para reflejar los cambios
        } catch (error) {
            alert("Error al actualizar datos: " + error.message)
        }
    }


    const handleDelete = async () => {
        if (confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
            await deleteUser(user.id)
            logout()
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Abrir configuración de usuario">
                    <Settings className="w-4 h-4" />
              <span>Configuracion</span>

                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[400px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Configuración de Usuario</SheetTitle>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 font-medium text-sm">Correo Electrónico</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="mb-1 font-medium text-sm">Nombre</label>
                        <Input
                            id="nombre"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="apellido" className="mb-1 font-medium text-sm">Apellido</label>
                        <Input
                            id="apellido"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="telefono" className="mb-1 font-medium text-sm">Teléfono</label>
                        <Input
                            id="telefono"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="fechaNacimiento" className="mb-1 font-medium text-sm">Fecha de Nacimiento</label>
                        <Input
                            id="fechaNacimiento"
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button type="submit" className="bg-black text-white">Guardar Cambios</Button>
                        <Button variant="destructive" onClick={handleDelete}>Eliminar Cuenta</Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
