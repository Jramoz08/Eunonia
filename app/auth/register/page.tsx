"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { registerUser, getStoredUsers } from "@/lib/auth"
import type { UserRole } from "@/lib/auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    rol: "" as UserRole | "",
    telefono: "",
    especialidad: "",
    numeroLicencia: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const especialidades = [
    "Psicología Clínica",
    "Psicología Laboral",
    "Psicología Cognitivo-Conductual",
    "Psicoterapia",
    "Psicología de la Salud",
    "Neuropsicología",
    "Psicología del Desarrollo",
    "Otra",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = async () => {
    if (!formData.email || !formData.password || !formData.nombre || !formData.apellido || !formData.rol) {
      return "Todos los campos obligatorios deben ser completados"
    }

    if (formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return "Ingresa un email válido"
    }

    const existingUsers = await getStoredUsers()
    if (existingUsers.some((user) => user.email === formData.email)) {
      return "Ya existe una cuenta con este email"
    }

    if (formData.rol === "psicologo" && (!formData.especialidad || !formData.numeroLicencia)) {
      return "Los psicólogos deben completar especialidad y número de licencia"
    }

    if (!acceptTerms) {
      return "Debes aceptar los términos y condiciones"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const validationError = await validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const newUser = await registerUser({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rol: formData.rol as UserRole,
        telefono: formData.telefono || undefined,
        especialidad: formData.rol === "psicologo" ? formData.especialidad : undefined,
        numeroLicencia: formData.rol === "psicologo" ? formData.numeroLicencia : undefined,
      })

      await login(newUser.email, formData.password)

      router.push(
        newUser.rol === "psicologo" ? "/dashboard-psicologo" : "/dashboard"
      )
    } catch (err) {
      setError("Error al crear la cuenta o iniciar sesión. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-white from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-12" />                
            </div>
            <span className="text-2xl font-bold text-gray-900">Eunonia</span>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">Únete a nuestra plataforma de bienestar mental</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Tipo de Usuario *</Label>
                <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    {/* <SelectItem value="psicologo">Psicólogo</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {formData.rol === "psicologo" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad *</Label>
                    <Select
                      value={formData.especialidad}
                      onValueChange={(value) => handleInputChange("especialidad", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((esp) => (
                          <SelectItem key={esp} value={esp}>
                            {esp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroLicencia">Número de Licencia *</Label>
                    <Input
                      id="numeroLicencia"
                      placeholder="Ej: COL-12345"
                      value={formData.numeroLicencia}
                      onChange={(e) => handleInputChange("numeroLicencia", e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(val) => setAcceptTerms(!!val)} />
                <Label htmlFor="terms">Acepto los términos y condiciones *</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>

              <div className="text-sm text-center text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
