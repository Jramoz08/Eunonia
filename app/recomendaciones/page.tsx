"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Heart,
  Zap,
  Moon,
  Coffee,
  ArrowLeft,
  Play,
  Clock,
  Target,
  CheckCircle,
  Star,
  Bookmark,
  Share,
} from "lucide-react"
import Link from "next/link"

export default function Recomendaciones() {
  const [userProfile, setUserProfile] = useState({
    mood: 7,
    stress: 4,
    energy: 6,
    sleep: 7,
    preferences: ["mindfulness", "ejercicio", "respiracion"],
  })

  const [completedActivities, setCompletedActivities] = useState<string[]>([])

  // Simulación de recomendaciones basadas en IA
  const generateRecommendations = () => {
    const recommendations = []

    // Recomendaciones basadas en nivel de estrés
    if (userProfile.stress >= 6) {
      recommendations.push({
        id: "stress-breathing",
        type: "Respiración",
        title: "Técnica de Respiración 4-7-8",
        description: "Reduce el estrés inmediatamente con esta técnica de respiración profunda",
        duration: "5 min",
        difficulty: "Fácil",
        effectiveness: 95,
        icon: <Heart className="w-5 h-5" />,
        color: "bg-green-100 text-green-700",
        priority: "high",
      })
    }

    // Recomendaciones basadas en energía
    if (userProfile.energy <= 5) {
      recommendations.push({
        id: "energy-boost",
        type: "Movimiento",
        title: "Rutina Energizante de 10 Minutos",
        description: "Ejercicios suaves para aumentar tu energía sin agotarte",
        duration: "10 min",
        difficulty: "Fácil",
        effectiveness: 88,
        icon: <Zap className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-700",
        priority: "medium",
      })
    }

    // Recomendaciones basadas en estado de ánimo
    if (userProfile.mood <= 6) {
      recommendations.push({
        id: "mood-boost",
        type: "Mindfulness",
        title: "Meditación de Gratitud",
        description: "Practica la gratitud para mejorar tu estado de ánimo y perspectiva",
        duration: "15 min",
        difficulty: "Fácil",
        effectiveness: 92,
        icon: <Brain className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-700",
        priority: "high",
      })
    }

    // Recomendaciones basadas en sueño
    if (userProfile.sleep <= 6) {
      recommendations.push({
        id: "sleep-hygiene",
        type: "Sueño",
        title: "Rutina de Relajación Nocturna",
        description: "Prepara tu mente y cuerpo para un sueño reparador",
        duration: "20 min",
        difficulty: "Fácil",
        effectiveness: 85,
        icon: <Moon className="w-5 h-5" />,
        color: "bg-indigo-100 text-indigo-700",
        priority: "medium",
      })
    }

    // Recomendaciones generales de bienestar
    recommendations.push(
      {
        id: "mindful-break",
        type: "Mindfulness",
        title: "Pausa Mindful de 3 Minutos",
        description: "Una breve práctica de atención plena para reconectar contigo mismo",
        duration: "3 min",
        difficulty: "Muy Fácil",
        effectiveness: 78,
        icon: <Target className="w-5 h-5" />,
        color: "bg-teal-100 text-teal-700",
        priority: "low",
      },
      {
        id: "desk-stretches",
        type: "Movimiento",
        title: "Estiramientos en el Escritorio",
        description: "Alivia la tensión muscular sin levantarte de tu lugar de trabajo",
        duration: "7 min",
        difficulty: "Muy Fácil",
        effectiveness: 82,
        icon: <Coffee className="w-5 h-5" />,
        color: "bg-orange-100 text-orange-700",
        priority: "medium",
      },
    )

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const [recommendations] = useState(generateRecommendations())

  const handleCompleteActivity = (activityId: string) => {
    setCompletedActivities((prev) => [...prev, activityId])
    // Simular actualización de progreso
    setTimeout(() => {
      alert("¡Actividad completada! Tu progreso ha sido registrado. 🎉")
    }, 500)
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-gray-100 text-gray-700",
    }
    const labels = {
      high: "Alta Prioridad",
      medium: "Prioridad Media",
      low: "Opcional",
    }
    return <Badge className={styles[priority]}>{labels[priority]}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MentalWell</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recomendaciones Personalizadas</h1>
          <p className="text-gray-600">
            Actividades diseñadas específicamente para tu estado actual y objetivos de bienestar
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Insights */}
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>Análisis de IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Basándome en tu estado actual (Ánimo: {userProfile.mood}/10, Estrés: {userProfile.stress}/10), he
                    identificado las siguientes áreas de oportunidad:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.stress >= 6 && <Badge className="bg-red-100 text-red-700">Gestión del Estrés</Badge>}
                    {userProfile.energy <= 5 && (
                      <Badge className="bg-orange-100 text-orange-700">Aumento de Energía</Badge>
                    )}
                    {userProfile.mood <= 6 && <Badge className="bg-purple-100 text-purple-700">Mejora del Ánimo</Badge>}
                    {userProfile.sleep <= 6 && (
                      <Badge className="bg-indigo-100 text-indigo-700">Calidad del Sueño</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Grid */}
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${rec.color}`}>
                          {rec.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                            {getPriorityBadge(rec.priority)}
                          </div>
                          <p className="text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{rec.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{rec.difficulty}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{rec.effectiveness}% efectividad</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Efectividad</span>
                        <span>{rec.effectiveness}%</span>
                      </div>
                      <Progress value={rec.effectiveness} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={rec.color}>
                        {rec.type}
                      </Badge>
                      {completedActivities.includes(rec.id) ? (
                        <Button disabled className="bg-green-100 text-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completado
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCompleteActivity(rec.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Comenzar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tu Progreso Hoy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{completedActivities.length}</div>
                  <div className="text-sm text-gray-600">Actividades completadas</div>
                </div>
                <Progress value={(completedActivities.length / recommendations.length) * 100} className="h-3" />
                <div className="text-xs text-gray-500 text-center">
                  {completedActivities.length} de {recommendations.length} recomendaciones
                </div>
              </CardContent>
            </Card>

            {/* Current State */}
            <Card>
              <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estado de Ánimo</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={userProfile.mood * 10} className="w-16 h-2" />
                    <span className="text-sm font-medium">{userProfile.mood}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nivel de Estrés</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={userProfile.stress * 10} className="w-16 h-2" />
                    <span className="text-sm font-medium">{userProfile.stress}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Energía</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={userProfile.energy * 10} className="w-16 h-2" />
                    <span className="text-sm font-medium">{userProfile.energy}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Calidad del Sueño</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={userProfile.sleep * 10} className="w-16 h-2" />
                    <span className="text-sm font-medium">{userProfile.sleep}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Comienza con actividades de alta prioridad para obtener mejores resultados</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Las actividades cortas son más fáciles de mantener como hábito</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p>Registra tu progreso para que la IA mejore sus recomendaciones</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="border-red-100 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">¿Necesitas Ayuda Inmediata?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Si sientes que necesitas apoyo profesional inmediato, no dudes en contactar:
                </p>
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  Línea de Crisis 24/7
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
