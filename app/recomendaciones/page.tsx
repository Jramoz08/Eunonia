"use client"

import { useState, useEffect, useMemo } from "react"
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
  Target,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type Completed = { id: string; completedAt: number }

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

export default function Recomendaciones() {
  const [userProfile] = useState({
    mood: 7,
    stress: 4,
    energy: 6,
    sleep: 7,
    preferences: ["mindfulness", "ejercicio", "respiracion"],
  })

  // Estado inicial leyendo y saneando localStorage (deduplica por id conservando el más reciente)
  const [completedActivities, setCompletedActivities] = useState<Completed[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem("completedActivities")
      if (!stored) return []
      const raw = JSON.parse(stored)
      if (!Array.isArray(raw)) return []
      const map: Record<string, Completed> = {}
      for (const item of raw) {
        const id = String(item?.id ?? "")
        const ts = Number(item?.completedAt ?? 0)
        if (!id || !ts) continue
        if (!map[id] || ts > map[id].completedAt) {
          map[id] = { id, completedAt: ts }
        }
      }
      return Object.values(map)
    } catch {
      return []
    }
  })

  // Persistencia
  useEffect(() => {
    localStorage.setItem("completedActivities", JSON.stringify(completedActivities))
  }, [completedActivities])

  // Mapa para lookups O(1)
  const completionMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of completedActivities) {
      map[a.id] = Math.max(map[a.id] || 0, a.completedAt)
    }
    return map
  }, [completedActivities])

  const isActivityLocked = (activityId: string) => {
    const last = completionMap[activityId]
    if (!last) return false
    return Date.now() - last < TWENTY_FOUR_HOURS
  }

  // Modal para ejercicio
  const [activeExercise, setActiveExercise] = useState<
    | null
    | {
      id: string
      title: string
      duration: string
      videoUrl?: string
      steps?: { text: string; img: string }[]
      currentStep?: number
    }
  >(null)

  const addCompletedActivity = (activityId: string) => {
    // Sobrescribe si ya existe (evita duplicados)
    setCompletedActivities((prev) => {
      const filtered = prev.filter((a) => a.id !== activityId)
      return [...filtered, { id: activityId, completedAt: Date.now() }]
    })
  }

  const generateRecommendations = () => {
    const recommendations: any[] = []

    if (userProfile.stress >= 6) {
      recommendations.push({
        id: "stress-breathing",
        type: "Respiración",
        title: "Técnica de Respiración 4-7-8",
        description:
          "Reduce el estrés inmediatamente con esta técnica de respiración profunda",
        duration: "5 min",
        difficulty: "Fácil",
        effectiveness: 95,
        icon: <Heart className="w-5 h-5" />,
        color: "bg-green-100 text-green-700",
        priority: "high",
        steps: [
          { text: "Siéntate cómodamente y cierra los ojos.", img: "/sitdown.gif" },
          { text: "Inhala por la nariz contando hasta 4.", img: "/animations/breath_step2.gif" },
          { text: "Mantén la respiración contando hasta 7.", img: "/animations/breath_step3.gif" },
          { text: "Exhala por la boca contando hasta 8.", img: "/animations/breath_step4.gif" },
          { text: "Repite el ciclo 3 veces.", img: "/animations/breath_step5.gif" },
        ],
      })
    }

    if (userProfile.energy <= 5) {
      recommendations.push({
        id: "energy-boost",
        type: "Movimiento",
        title: "Rutina Energizante de 10 Minutos",
        description:
          "Ejercicios suaves para aumentar tu energía sin agotarte",
        duration: "10 min",
        difficulty: "Fácil",
        effectiveness: 88,
        icon: <Zap className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-700",
        priority: "medium",
        steps: [
          { text: "Calienta moviendo los brazos suavemente.", img: "/animations/energy_step1.gif" },
          { text: "Estiramientos laterales del torso.", img: "/animations/energy_step2.gif" },
          { text: "Marcha en el sitio levantando las rodillas.", img: "/animations/energy_step3.gif" },
          { text: "Respira profundo y relaja los hombros.", img: "/animations/energy_step4.gif" },
        ],
      })
    }

    if (userProfile.mood <= 6) {
      recommendations.push({
        id: "mood-boost",
        type: "Mindfulness",
        title: "Meditación de Gratitud",
        description:
          "Practica la gratitud para mejorar tu estado de ánimo y perspectiva",
        duration: "15 min",
        difficulty: "Fácil",
        effectiveness: 92,
        icon: <Brain className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-700",
        priority: "high",
        steps: [
          { text: "Encuentra un lugar tranquilo y siéntate cómodo.", img: "/sitdown.gif" },
          { text: "Cierra los ojos y respira profundamente.", img: "/animations/mood_step2.gif" },
          { text: "Piensa en tres cosas por las que estás agradecido.", img: "/animations/mood_step3.gif" },
          { text: "Siente esa gratitud en tu pecho.", img: "/animations/mood_step4.gif" },
          { text: "Abre los ojos lentamente y sonríe.", img: "/animations/mood_step5.gif" },
        ],
      })
    }

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
        steps: [
          { text: "Apaga luces fuertes y dispositivos electrónicos.", img: "/animations/sleep_step1.gif" },
          { text: "Haz respiraciones lentas y profundas.", img: "/animations/sleep_step2.gif" },
          { text: "Relaja los músculos uno a uno.", img: "/animations/sleep_step3.gif" },
          { text: "Visualiza un lugar tranquilo.", img: "/animations/sleep_step4.gif" },
          { text: "Déjate llevar al sueño.", img: "/animations/sleep_step5.gif" },
        ],
      })
    }

    recommendations.push(
      {
        id: "mindful-break",
        type: "Mindfulness",
        title: "Pausa Mindful de 3 Minutos",
        description:
          "Una breve práctica de atención plena para reconectar contigo mismo",
        duration: "3 min",
        difficulty: "Muy Fácil",
        effectiveness: 78,
        icon: <Target className="w-5 h-5" />,
        color: "bg-teal-100 text-teal-700",
        priority: "low",
        steps: [
          { text: "Siéntate en una postura cómoda.", img: "/sitdown.gif" },
          { text: "Concéntrate en tu respiración natural.", img: "/respira.gif" },
          { text: "Observa tus pensamientos sin juzgar.", img: "/piensa.gif" },
          { text: "Permanece en estado de presencia.", img: "/calm.gif" },
        ],
      },
      {
        id: "desk-stretches",
        type: "Movimiento",
        title: "Estiramientos en el Escritorio",
        description:
          "Alivia la tensión muscular sin levantarte de tu lugar de trabajo",
        duration: "5 min",
        difficulty: "Muy Fácil",
        effectiveness: 82,
        icon: <Coffee className="w-5 h-5" />,
        color: "bg-orange-100 text-orange-700",
        priority: "medium",
        videoUrl: "https://www.youtube.com/embed/LBeh-uzFzns",
      },
    )

    return recommendations.sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    })
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  const [recommendations] = useState(generateRecommendations())

  const handleStartExercise = (exercise: {
    id: string
    title: string
    duration: string
    videoUrl?: string
    steps?: { text: string; img: string }[]
  }) => {
    setActiveExercise({ ...exercise, currentStep: 0 })
  }

  const handleCompleteFromModal = () => {
    if (activeExercise) {
      addCompletedActivity(activeExercise.id)
      setActiveExercise(null)
      alert("¡Actividad completada! Tu progreso ha sido registrado. 🎉")
    }
  }

  const handleNextStep = () => {
    if (activeExercise?.steps && activeExercise.currentStep! < activeExercise.steps.length - 1) {
      setActiveExercise((prev) => prev ? { ...prev, currentStep: prev.currentStep! + 1 } : prev)
    }
  }

  const handlePrevStep = () => {
    if (activeExercise?.steps && activeExercise.currentStep! > 0) {
      setActiveExercise((prev) => prev ? { ...prev, currentStep: prev.currentStep! - 1 } : prev)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-gray-100 text-gray-700",
    }
    const labels: Record<string, string> = {
      high: "Alta Prioridad",
      medium: "Prioridad Media",
      low: "Opcional",
    }
    return <Badge className={styles[priority]}>{labels[priority]}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navegación */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2">
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gray-900">Eunonia</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recomendaciones Personalizadas</h1>
          <p className="text-gray-600">
            Actividades diseñadas específicamente para tu estado actual y objetivos de bienestar
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Insights IA */}
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>Análisis de IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Basándonos en tus respuestas recientes, te sugerimos estas actividades para mejorar tu bienestar.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-semibold text-blue-700 flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>Estrés Actual:</span>
                    </h3>
                    <p className="text-lg font-bold">{userProfile.stress}/10</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-semibold text-blue-700 flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Energía:</span>
                    </h3>
                    <p className="text-lg font-bold">{userProfile.energy}/10</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-semibold text-blue-700 flex items-center space-x-1">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span>Estado de Ánimo:</span>
                    </h3>
                    <p className="text-lg font-bold">{userProfile.mood}/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className={`border ${rec.color.split(" ")[0]} bg-white`}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {rec.icon}
                      <span>{rec.title}</span>
                    </CardTitle>
                    {getPriorityBadge(rec.priority)}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{rec.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>Duración: {rec.duration}</span>
                      <span>Dificultad: {rec.difficulty}</span>
                    </div>
                    <Progress
                      value={rec.effectiveness}
                      className="mb-4"
                      aria-label={`Efectividad ${rec.effectiveness}%`}
                    />
                    <Button
                      onClick={() => handleStartExercise(rec)}
                      disabled={mounted ? isActivityLocked(rec.id) : false}
                    >
                      {mounted && isActivityLocked(rec.id) ? "Disponible en 24h" : "Comenzar"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Barra lateral con perfil y progreso */}
          <aside className="hidden lg:block">
            <Card className="sticky top-8">
              <CardContent>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Actividades completadas</h3>
                  {completedActivities.length === 0 ? (
                    <p className="text-gray-500">Ninguna aún</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-green-700">
                      {completedActivities
                        .sort((a, b) => b.completedAt - a.completedAt)
                        .map((act) => {
                          const actividad = recommendations.find((r) => r.id === act.id)
                          return <li key={act.id}>{actividad?.title || act.id}</li>
                        })}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Modal ejercicio */}
      <Dialog open={!!activeExercise} onOpenChange={(open) => !open && setActiveExercise(null)}>
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle>{activeExercise?.title}</DialogTitle>
          </DialogHeader>

          {activeExercise && activeExercise.steps ? (
            <div className="flex flex-col items-center space-y-4">
              <img
                src={activeExercise.steps[activeExercise.currentStep!].img}
                alt={`Paso ${activeExercise.currentStep! + 1}`}
                className="w-100 h-100 object-contain rounded-lg shadow"
              />
              <p className="text-center text-lg px-4">
                {activeExercise.steps[activeExercise.currentStep!].text}
              </p>
              <div className="flex justify-between w-full px-8">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={activeExercise.currentStep === 0}
                >
                  Anterior
                </Button>
                {activeExercise.currentStep! < activeExercise.steps.length - 1 ? (
                  <Button onClick={handleNextStep}>Siguiente</Button>
                ) : (
                  <Button variant="success" onClick={handleCompleteFromModal}>
                    Completar actividad
                  </Button>
                )}
              </div>
            </div>
          ) : activeExercise && activeExercise.videoUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src={activeExercise.videoUrl}
                  title={activeExercise.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <Button variant="success" onClick={handleCompleteFromModal}>
                Completar actividad
              </Button>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveExercise(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
