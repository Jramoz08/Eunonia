"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [newUser, setNewUser] = useState({
    email: "",
    nombre: "",
    apellido: "",
    rol: "" as UserRole | "",
    telefono: "",
    especialidad: "",
    numeroLicencia: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = getStoredUsers()
    setUsers(allUsers)
    onUserUpdate?.()
  }

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    updateUserStatus(userId, !currentStatus)
    loadUsers()
    setSuccess(`Usuario ${!currentStatus ? "activado" : "desactivado"} correctamente`)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleCreateUser = () => {
    setError("")

    if (!newUser.email || !newUser.nombre || !newUser.apellido || !newUser.rol) {
      setError("Todos los campos obligatorios deben ser completados")
      return
    }

    // Verificar si el email ya existe
    if (users.some((u) => u.email === newUser.email)) {
      setError("Ya existe un usuario con este email")
      return
    }

    try {
      createUserAsAdmin({
        email: newUser.email,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        rol: newUser.rol as UserRole,
        telefono: newUser.telefono || undefined,
        especialidad: newUser.rol === "psicologo" ? newUser.especialidad : undefined,
        numeroLicencia: newUser.rol === "psicologo" ? newUser.numeroLicencia : undefined,
      })

      setSuccess("Usuario creado correctamente")
      setIsCreateDialogOpen(false)
      setNewUser({
        email: "",
        nombre: "",
        apellido: "",
        rol: "",
        telefono: "",
        especialidad: "",
        numeroLicencia: "",
      })
      loadUsers()
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
                        placeholder="Nombre del usuario"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={newUser.apellido}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, apellido: e.target.value }))}
                        placeholder="Apellido del usuario"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="email@ejemplo.com"
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
                        placeholder="+34 600 000 000"
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
                            placeholder="Psicología Clínica"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="numeroLicencia">Número de Licencia *</Label>
                          <Input
                            id="numeroLicencia"
                            value={newUser.numeroLicencia}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, numeroLicencia: e.target.value }))}
                            placeholder="COL-12345"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser}>Crear Usuario</Button>
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
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      usuario.rol === "administrador"
                        ? "bg-red-100"
                        : usuario.rol === "psicologo"
                          ? "bg-purple-100"
                          : "bg-blue-100"
                    }`}
                  >
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
                      Registrado: {new Date(usuario.fechaRegistro).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{usuario.activo ? "Activo" : "Inactivo"}</span>
                    <Switch
                      checked={usuario.activo}
                      onCheckedChange={() => handleToggleUserStatus(usuario.id, usuario.activo)}
                    />
                  </div>

                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
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
