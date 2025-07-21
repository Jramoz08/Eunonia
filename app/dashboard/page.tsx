"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Heart,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Bell,
  Settings,
  User,
  BarChart3,
  BookOpen,
  Users,
} from "lucide-react"
import Link from "next/link"

// Agregar protección de ruta al inicio del componente, después de los imports:
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [moodScore, setMoodScore] = useState(75)
  const [stressLevel, setStressLevel] = useState(40)
  const [wellnessStreak, setWellnessStreak] = useState(12)

  // Dentro del componente, después de los estados existentes:
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  // Agregar useEffect para protección de ruta:
  useEffect(() => {
    if (!isAuthenticated || user?.rol !== "paciente") {
      router.push("/auth/login")
      return
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  const todayRecommendations = [
    {
      type: "Respiración",
      title: "Ejercicio de respiración 4-7-8",
      duration: "5 min",
      icon: <Heart className="w-4 h-4" />,
      color: "bg-green-100 text-green-700",
    },
    {
      type: "Movimiento",
      title: "Pausa activa en el escritorio",
      duration: "10 min",
      icon: <Zap className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      type: "Mindfulness",
      title: "Meditación guiada para el estrés",
      duration: "15 min",
      icon: <Brain className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  const weeklyStats = [
    { day: "L", mood: 70, stress: 60 },
    { day: "M", mood: 65, stress: 70 },
    { day: "X", mood: 80, stress: 45 },
    { day: "J", mood: 75, stress: 50 },
    { day: "V", mood: 85, stress: 30 },
    { day: "S", mood: 90, stress: 20 },
    { day: "D", mood: 75, stress: 40 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MentalWell</span>
            </Link>

            {/* En la navegación, reemplazar el contenido del div de la derecha con: */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">
                  {user?.nombre} {user?.apellido}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Cambiar el saludo para usar el nombre del usuario: */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.nombre} 👋
          </h1>
          <p className="text-gray-600">
            {currentTime.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado de Ánimo</p>
                  <p className="text-2xl font-bold text-green-600">{moodScore}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={moodScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nivel de Estrés</p>
                  <p className="text-2xl font-bold text-blue-600">{stressLevel}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={stressLevel} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Racha de Bienestar</p>
                  <p className="text-2xl font-bold text-purple-600">{wellnessStreak} días</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">¡Sigue así!</div>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progreso Semanal</p>
                  <p className="text-2xl font-bold text-orange-600">+15%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-3 text-sm text-green-600">Mejorando</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Progreso Semanal</span>
                </CardTitle>
                <CardDescription>Tu evolución en estado de ánimo y niveles de estrés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estado de Ánimo</span>
                    <span>Nivel de Estrés</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weeklyStats.map((stat, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="text-xs font-medium text-gray-500">{stat.day}</div>
                        <div className="space-y-1">
                          <div className="bg-green-200 rounded-sm" style={{ height: `${stat.mood / 2}px` }}></div>
                          <div className="bg-red-200 rounded-sm" style={{ height: `${stat.stress / 2}px` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Herramientas para mejorar tu bienestar ahora mismo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/seguimiento">
                    <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                      <Heart className="w-6 h-6" />
                      <span className="text-xs">Registrar Estado</span>
                    </Button>
                  </Link>
                  <Link href="/recomendaciones">
                    <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                      <Brain className="w-6 h-6" />
                      <span className="text-xs">Recomendaciones</span>
                    </Button>
                  </Link>
                  <Link href="/autodiagnostico">
                    <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                      <Target className="w-6 h-6" />
                      <span className="text-xs">Autodiagnóstico</span>
                    </Button>
                  </Link>
                  <Link href="/recursos">
                    <Button variant="outline" className="h-20 flex-col space-y-2 w-full bg-transparent">
                      <BookOpen className="w-6 h-6" />
                      <span className="text-xs">Recursos</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Recomendaciones de Hoy</span>
                </CardTitle>
                <CardDescription>Actividades personalizadas basadas en tu estado actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rec.color}`}>{rec.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rec.title}</p>
                      <p className="text-xs text-gray-500">{rec.duration}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      Iniciar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Próximas Actividades</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sesión de mindfulness</p>
                    <p className="text-xs text-gray-500">Hoy, 15:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Check-in semanal</p>
                    <p className="text-xs text-gray-500">Mañana, 09:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Grupo de apoyo</p>
                    <p className="text-xs text-gray-500">Viernes, 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Highlight */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Comunidad</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">1,247</p>
                    <p className="text-sm text-gray-500">Profesionales activos</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Unirse a la Conversación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  // Agregar verificación de usuario al final del componente antes del return:
  if (!user) return null
}
