"use client"

import { useState, useEffect } from "react"
import bcrypt from "bcryptjs"
import { supabase } from '../../lib/supabaseClient'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Search, MoreHorizontal, Plus, Shield, Download } from "lucide-react"
import { getStoredUsers, updateUserStatus, type User, type UserRole } from "@/lib/auth"
import { createUserAsAdmin, exportSystemData } from "@/lib/admin"

interface UserManagementProps {
  onUserUpdate?: () => void
}

export function UserManagement({ onUserUpdate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("todos")
  const [selectedStatus, setSelectedStatus] = useState<string>("todos")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [newUser, setNewUser] = useState({
    email: "",
    nombre: "",
    apellido: "",
    rol: "" as UserRole | "",
    telefono: "",
    especialidad: "",
    numeroLicencia: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetch = async () => {
      await loadUsers()
    }
    fetch()
  }, [])

  const loadUsers = async () => {
    const allUsers = await getStoredUsers()
    setUsers(allUsers || [])
    onUserUpdate?.()
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    const { id, ...fields } = editingUser

    // Si se cambió la contraseña, hashearla
    if (newPassword.trim()) {
      const password_hash = await bcrypt.hash(newPassword, 10)
      fields["password_hash"] = password_hash
    }

    const { error } = await supabase
      .from("users")
      .update(fields)
      .eq("id", id)

    if (error) {
      console.error("Error al actualizar usuario:", error)
      setError("No se pudo actualizar el usuario.")
    } else {
      setSuccess("Usuario actualizado correctamente.")
      setIsEditDialogOpen(false)
      setNewPassword("")
      await loadUsers()
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este usuario?")
    if (!confirm) return

    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      console.error("Error al eliminar usuario:", error)
      setError("No se pudo eliminar el usuario.")
    } else {
      setSuccess("Usuario eliminado correctamente.")
      await loadUsers()
      setTimeout(() => setSuccess(""), 3000)
    }
  }


  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    console.log("Toggling status for:", userId, "from", currentStatus, "to", !currentStatus)
    try {
      await updateUserStatus(userId, !currentStatus)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, activo: !currentStatus } : user
        )
      )
      setSuccess(`Usuario ${!currentStatus ? "activado" : "desactivado"} correctamente`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error actualizando estado:", err)
      setError("Error al actualizar el estado del usuario")
    }
  }


  const handleCreateUser = async () => {
    setError("")

    // Validar que los campos obligatorios estén completos, incluyendo la contraseña
    if (!newUser.email || !newUser.nombre || !newUser.apellido || !newUser.rol || !newUser.password) {
      setError("Todos los campos obligatorios deben ser completados")
      return
    }

    // Validar que no exista un usuario con ese email
    if (users.some((u) => u.email === newUser.email)) {
      setError("Ya existe un usuario con este email")
      return
    }

    try {
      // Generar hash de la contraseña
      const password_hash = await bcrypt.hash(newUser.password, 10)

      // Llamar a la función que crea el usuario, enviando todos los datos necesarios
      await createUserAsAdmin({
        email: newUser.email,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        rol: newUser.rol as UserRole,
        telefono: newUser.telefono || null,
        especialidad: newUser.rol === "psicologo" ? newUser.especialidad || null : null,
        numero_licencia: newUser.rol === "psicologo" ? newUser.numeroLicencia || null : null,
        password_hash, // enviar el hash en vez de la contraseña plana
        fecha_nacimiento: null, // o un valor si tienes
        profesion: null, // o un valor si tienes
        psicologo_asignado: null, // o un valor si tienes
        configuracion: {}, // objeto vacío por defecto
      })

      setSuccess("Usuario creado correctamente")
      setIsCreateDialogOpen(false)

      // Resetear formulario
      setNewUser({
        email: "",
        nombre: "",
        apellido: "",
        rol: "",
        telefono: "",
        especialidad: "",
        numeroLicencia: "",
        password: "",
      })

      await loadUsers()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Error al crear el usuario")
    }
  }


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === "todos" || user.rol === selectedRole
    const matchesStatus =
      selectedStatus === "todos" ||
      (selectedStatus === "activo" && user.activo) ||
      (selectedStatus === "inactivo" && !user.activo)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (rol: UserRole) => {
    switch (rol) {
      case "administrador":
        return "bg-red-100 text-red-700"
      case "psicologo":
        return "bg-purple-100 text-purple-700"
      case "paciente":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getRoleIcon = (rol: UserRole) => {
    switch (rol) {
      case "administrador":
        return <Shield className="w-5 h-5 text-red-600" />
      case "psicologo":
        return <Users className="w-5 h-5 text-purple-600" />
      case "paciente":
        return <Users className="w-5 h-5 text-blue-600" />
      default:
        return <Users className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra todos los usuarios del sistema</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => exportSystemData("csv")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa la información para crear un nuevo usuario en el sistema
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={newUser.nombre}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={newUser.apellido}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, apellido: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    {/* Aquí agregamos el campo contraseña */}
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password || ''}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rol">Rol *</Label>
                      <Select
                        value={newUser.rol}
                        onValueChange={(value) => setNewUser((prev) => ({ ...prev, rol: value as UserRole }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paciente">Paciente</SelectItem>
                          <SelectItem value="psicologo">Psicólogo</SelectItem>
                          <SelectItem value="administrador">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={newUser.telefono}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, telefono: e.target.value }))}
                      />
                    </div>
                    {newUser.rol === "psicologo" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="especialidad">Especialidad *</Label>
                          <Input
                            id="especialidad"
                            value={newUser.especialidad}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, especialidad: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numeroLicencia">Número de Licencia *</Label>
                          <Input
                            id="numeroLicencia"
                            value={newUser.numeroLicencia}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, numeroLicencia: e.target.value }))}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setIsEditDialogOpen(false)
                      setNewPassword("")
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser}>Crear Usuario</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogDescription>Modifica la información del usuario</DialogDescription>
                  </DialogHeader>

                  {editingUser && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          value={editingUser.nombre}
                          onChange={(e) =>
                            setEditingUser((prev) => prev && { ...prev, nombre: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                          id="apellido"
                          value={editingUser.apellido}
                          onChange={(e) =>
                            setEditingUser((prev) => prev && { ...prev, apellido: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser((prev) => prev && { ...prev, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={editingUser.telefono || ""}
                          onChange={(e) =>
                            setEditingUser((prev) => prev && { ...prev, telefono: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="new-password">Nueva Contraseña (opcional)</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Dejar vacío si no deseas cambiarla"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>

                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateUser}>Guardar Cambios</Button>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="paciente">Pacientes</SelectItem>
                <SelectItem value="psicologo">Psicólogos</SelectItem>
                <SelectItem value="administrador">Administradores</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de usuarios */}
          <div className="space-y-4">
            {filteredUsers.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${usuario.rol === "administrador"
                    ? "bg-red-100"
                    : usuario.rol === "psicologo"
                      ? "bg-purple-100"
                      : "bg-blue-100"
                    }`}>
                    {getRoleIcon(usuario.rol)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {usuario.nombre} {usuario.apellido}
                    </h4>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleBadgeColor(usuario.rol)}>
                        {usuario.rol === "administrador"
                          ? "Admin"
                          : usuario.rol === "psicologo"
                            ? "Psicólogo"
                            : "Paciente"}
                      </Badge>
                      {usuario.especialidad && (
                        <Badge variant="outline" className="text-xs">
                          {usuario.especialidad}
                        </Badge>
                      )}
                      <Badge className={usuario.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Registrado: {new Date(usuario.fecha_registro).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{usuario.activo ? "Activo" : "Inactivo"}</span>
                    <Switch
                      checked={!!users.find((u) => u.id === usuario.id)?.activo}
                      onCheckedChange={() => handleToggleUserStatus(usuario.id, usuario.activo)}
                    />

                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditUser(usuario)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(usuario.id)}
                            className="text-red-600"
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(usuario)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:bg-red-50"
                        onClick={() => handleDeleteUser(usuario.id)}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
              <p className="text-gray-500">
                {searchTerm || selectedRole !== "todos" || selectedStatus !== "todos"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay usuarios registrados en el sistema"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
