"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import UserSettingsModal from "@/components/ui/UserSettingsModal"
import UserSettingsPanel from "@/components/ui/UserSettingsPanel"

import { getEmotionalRecords, EmotionalRecord } from "@/lib/emotional"
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
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<EmotionalRecord[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [moodScore, setMoodScore] = useState(0)
  const [stressLevel, setStressLevel] = useState(0)
  const [wellnessStreak, setWellnessStreak] = useState(0)
  const [weeklyProgress, setWeeklyProgress] = useState<number | null>(null)
  const [weeklyTrend, setWeeklyTrend] = useState<"mejorando" | "empeorando" | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<{ day: string; mood: number; stress: number }[]>([])




  // Protección de ruta:
  useEffect(() => {
    if (!isAuthenticated || user?.rol !== "paciente") {
      router.push("/auth/login")
      return
    }
  }, [isAuthenticated, user, router])

  // Agrega esto arriba de tu return, a nivel del componente
  const [availableActivities, setAvailableActivities] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const completedActivities = localStorage.getItem("completedActivities")
    const availability: { [key: string]: boolean } = {}

    todayRecommendations.forEach((rec) => {
      const activityId = rec.title.toLowerCase().replace(/\s/g, "-")
      availability[activityId] = true // por defecto disponible

      if (completedActivities) {
        const activities: { id: string; completedAt: number }[] = JSON.parse(completedActivities)
        const activity = activities.find(a => a.id === activityId)
        if (activity) {
          const now = Date.now()
          availability[activityId] = now - activity.completedAt >= 24 * 60 * 60 * 1000
        }
      }
    })

    setAvailableActivities(availability)
  }, [])


  // Actualizar estados con datos del usuario cuando esté disponible:
  useEffect(() => {
    if (user) {
      getEmotionalRecords(user.id).then((recs) => {
        setRecords(recs)

        if (recs.length > 0) {
          const latest = recs[recs.length - 1]
          setMoodScore(Number(latest.mood) * 10)    // escala 1–10 → 10–100%
          setStressLevel(Number(latest.stress) * 10)
        }

        if (recs.length > 0) {
          const today = new Date()

          // Arrays para promedio de mood actuales y previos
          const currentWeek: number[] = []
          const previousWeek: number[] = []

          recs.forEach((record) => {
            const date = new Date(record.fecha)
            const diffDays = Math.floor((+today - +date) / (1000 * 60 * 60 * 24))
            const mood = Number(record.mood)

            if (diffDays <= 6) {
              currentWeek.push(mood)
            } else if (diffDays >= 7 && diffDays <= 13) {
              previousWeek.push(mood)
            }
          })

          const avg = (arr: number[]) =>
            arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length

          const avgCurrent = avg(currentWeek)
          const avgPrevious = avg(previousWeek)

          if (avgPrevious > 0) {
            const progress = ((avgCurrent - avgPrevious) / avgPrevious) * 100
            setWeeklyProgress(Math.round(progress))
            setWeeklyTrend(progress >= 0 ? "mejorando" : "empeorando")
          } else {
            setWeeklyProgress(null)
            setWeeklyTrend(null)
          }

          // ** Aquí calculamos weeklyStats para el gráfico semanal **

          const dayNames = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]

          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() - i)
            return d
          }).reverse()

          const stats = last7Days.map((date) => {
            const filtered = recs.filter(record => {
              const recordDate = new Date(record.fecha)
              return (
                recordDate.getFullYear() === date.getFullYear() &&
                recordDate.getMonth() === date.getMonth() &&
                recordDate.getDate() === date.getDate()
              )
            })

            const avgMood = filtered.length
              ? filtered.reduce((sum, r) => sum + Number(r.mood), 0) / filtered.length
              : 0

            const avgStress = filtered.length
              ? filtered.reduce((sum, r) => sum + Number(r.stress), 0) / filtered.length
              : 0

            return {
              day: dayNames[date.getDay()],
              mood: Math.round(avgMood * 10),   // escala 0–100 para visualización
              stress: Math.round(avgStress * 10),
            }
          })

          setWeeklyStats(stats)
        }

        // Calcular racha de bienestar (mood >= 7)
        let streak = 0
        for (let i = recs.length - 1; i >= 0; i--) {
          if (Number(recs[i].mood) >= 7) streak++
          else break
        }
        setWellnessStreak(streak)
      })
    }
  }, [user])



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
      type: "Movimiento",
      title: "Estiramientos en el Escritorio",
      duration: "5 min",
      icon: <Zap className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      type: "Mindfulness",
      title: "Pausa Mindful de 3 Minutos",
      duration: "3 min",
      icon: <Brain className="w-4 h-4" />,
      color: "bg-purple-100 text-purple-700",
    },
  ]


  // No mostrar nada si no hay usuario:
  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gray-900">Eunonia</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <UserSettingsPanel />


              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">
                  {user?.nombre} {user?.apellido}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <a href="/">
                  Cerrar Sesión
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
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
                  <p className={`text-2xl font-bold ${weeklyProgress >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {weeklyProgress !== null ? `${weeklyProgress > 0 ? "+" : ""}${weeklyProgress}%` : "Sin datos"}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${weeklyProgress >= 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                  <TrendingUp className={`w-6 h-6 ${weeklyProgress >= 0 ? "text-green-600" : "text-red-600"}`} />
                </div>
              </div>
              <div
                className={`mt-3 text-sm ${weeklyProgress >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {weeklyTrend === "mejorando"
                  ? "Mejorando"
                  : weeklyTrend === "empeorando"
                    ? "Empeorando"
                    : "Sin suficientes datos"}
              </div>
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
                          <div
                            className="bg-green-300 rounded-sm transition-all duration-300"
                            style={{ height: `${stat.mood * 0.5}px` }} // Ajusta escala si quieres
                          />
                          <div
                            className="bg-red-300 rounded-sm transition-all duration-300"
                            style={{ height: `${stat.stress * 0.5}px` }}
                          />
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
                {todayRecommendations.map((rec, index) => {
                  const activityId = rec.title.toLowerCase().replace(/\s/g, "-")
                  const isAvailable = availableActivities[activityId] ?? true

                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${rec.color}`}>{rec.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{rec.title}</p>
                        <p className="text-xs text-gray-500">{rec.duration}</p>
                      </div>
                      {isAvailable ? (
                        <Link href="/recomendaciones" passHref>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            Comenzar
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Disponible en 24 horas
                        </Button>
                      )}
                    </div>
                  )
                })}


              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Nombre:</strong> {user?.nombre} {user?.apellido}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                {/* Más info del perfil si quieres */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
