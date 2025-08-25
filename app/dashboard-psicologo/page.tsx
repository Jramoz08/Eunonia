"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  UserIcon,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Video,
  Phone,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUsersByRole } from "@/lib/auth"
import type { User } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function DashboardPsicologo() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [pacientes, setPacientes] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAuthenticated || user?.rol !== "psicologo") {
      router.push("/auth/login")
      return
    }

    const fetchPacientes = async () => {
      try {
        const allPacientes = await getUsersByRole("paciente")
        console.log("allPacientes:", allPacientes)
        setPacientes(Array.isArray(allPacientes) ? allPacientes : [])
      } catch (error) {
        console.error("Error al cargar pacientes:", error)
        setPacientes([])
      }
    }

    fetchPacientes()
  }, [isAuthenticated, user, router])

  if (!user) return null

  const filteredPacientes = Array.isArray(pacientes)
    ? pacientes.filter(
        (paciente) =>
          paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paciente.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const estadisticas = {
    totalPacientes: pacientes.length,
    citasHoy: 5,
    citasSemana: 23,
    pacientesActivos: pacientes.filter((p) => p.activo).length,
  }

  const citasHoy = [
    { id: 1, paciente: "Ana García", hora: "09:00", tipo: "Presencial", estado: "confirmada", motivo: "Seguimiento ansiedad laboral" },
    { id: 2, paciente: "Carlos López", hora: "10:30", tipo: "Virtual", estado: "pendiente", motivo: "Primera consulta" },
    { id: 3, paciente: "María Rodríguez", hora: "14:00", tipo: "Presencial", estado: "confirmada", motivo: "Terapia cognitivo-conductual" },
    { id: 4, paciente: "David Martín", hora: "15:30", tipo: "Virtual", estado: "confirmada", motivo: "Manejo del estrés" },
    { id: 5, paciente: "Laura Sánchez", hora: "17:00", tipo: "Presencial", estado: "pendiente", motivo: "Evaluación inicial" },
  ]

  const alertasPacientes = [
    { paciente: "Ana García", tipo: "riesgo_alto", mensaje: "Puntuación de estrés elevada en últimos registros", fecha: "Hace 2 horas" },
    { paciente: "Carlos López", tipo: "sin_actividad", mensaje: "Sin registros de seguimiento en 5 días", fecha: "Hace 1 día" },
    { paciente: "María Rodríguez", tipo: "mejora", mensaje: "Progreso positivo en estado de ánimo", fecha: "Hace 3 horas" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-12" />
              </div>
              <span className="text-xl font-bold text-gray-900">Eunonia</span>
              <Badge className="bg-blue-100 text-blue-700">Psicólogo</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">{user.nombre} {user.apellido}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <a href="/">Cerrar Sesión</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido, Dr. {user.nombre} 👨‍⚕️</h1>
          <p className="text-gray-600">Panel de control para gestión de pacientes y consultas</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.totalPacientes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.citasHoy}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Semana</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.citasSemana}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.pacientesActivos}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="agenda" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agenda">Agenda del Día</TabsTrigger>
            <TabsTrigger value="pacientes">Mis Pacientes</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          {/* Agenda */}
          <TabsContent value="agenda" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Citas de Hoy</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" /> Nueva Cita
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {citasHoy.map((cita) => (
                        <div key={cita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{cita.hora}</div>
                              <div className="text-xs text-gray-500">{cita.tipo}</div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{cita.paciente}</h4>
                              <p className="text-sm text-gray-600">{cita.motivo}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={cita.estado === "confirmada" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                              {cita.estado === "confirmada" ? "Confirmada" : "Pendiente"}
                            </Badge>
                            <Button size="sm" variant="outline">
                              {cita.tipo === "Virtual" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Mensajes de Pacientes</Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline"><FileText className="w-4 h-4 mr-2" /> Crear Nota Clínica</Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline"><Calendar className="w-4 h-4 mr-2" /> Gestionar Horarios</Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline"><BarChart3 className="w-4 h-4 mr-2" /> Ver Estadísticas</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Citas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm"><p className="font-medium">Mañana - 09:00</p><p className="text-gray-600">Ana García - Seguimiento</p></div>
                    <div className="text-sm"><p className="font-medium">Mañana - 11:00</p><p className="text-gray-600">Pedro Ruiz - Primera consulta</p></div>
                    <div className="text-sm"><p className="font-medium">Viernes - 15:00</p><p className="text-gray-600">Elena Torres - Terapia grupal</p></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Pacientes */}
          <TabsContent value="pacientes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lista de Pacientes</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input placeholder="Buscar pacientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-2" /> Nuevo Paciente</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPacientes.map((paciente) => (
                    <div key={paciente.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{paciente.nombre} {paciente.apellido}</h4>
                          <p className="text-sm text-gray-600">{paciente.email}</p>
                          <p className="text-xs text-gray-500">Registrado: {new Date(paciente.fecha_registro).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={paciente.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {paciente.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="sm" variant="outline">Ver Perfil</Button>
                        <Button size="sm" variant="outline"><MessageSquare className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPacientes.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
                    <p className="text-gray-500">{searchTerm ? "Intenta ajustar tu búsqueda" : "Aún no tienes pacientes registrados"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alertas */}
          <TabsContent value="alertas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Pacientes</CardTitle>
                <CardDescription>Notificaciones importantes sobre el estado de tus pacientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertasPacientes.map((alerta, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        alerta.tipo === "riesgo_alto" ? "bg-red-100" :
                        alerta.tipo === "sin_actividad" ? "bg-yellow-100" : "bg-green-100"
                      }`}>
                        {alerta.tipo === "riesgo_alto" ? <AlertCircle className="w-4 h-4 text-red-600" /> :
                         alerta.tipo === "sin_actividad" ? <Clock className="w-4 h-4 text-yellow-600" /> :
                         <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{alerta.paciente}</h4>
                        <p className="text-sm text-gray-600">{alerta.mensaje}</p>
                        <p className="text-xs text-gray-500 mt-1">{alerta.fecha}</p>
                      </div>
                      <Button size="sm" variant="outline">Ver Detalles</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reportes */}
          <TabsContent value="reportes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">Aquí se mostrarán gráficos y reportes de progreso de pacientes y métricas de la clínica.</p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><FileText className="w-4 h-4 mr-2" /> Generar Reporte</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
