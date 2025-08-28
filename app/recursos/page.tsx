"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  ArrowLeft,
  Search,
  BookOpen,
  Video,
  Headphones,
  Users,
  Clock,
  Star,
  Heart,
  Zap,
  Moon,
  Coffee,
  Target,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function Recursos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")

  const [activeExercise, setActiveExercise] = useState<{
    id: number
    title: string
    duration: string
    steps?: { text: string; img: string }[]
    videoUrl?: string
    currentStep?: number
  } | null>(null)

  const handleStartExercise = (exercise: any) => {
    if (exercise.steps || exercise.videoUrl) {
      setActiveExercise({ ...exercise, currentStep: 0 })
    } else {
      window.open("#", "_blank")
    }
  }

  const handleCompleteFromModal = () => {
    if (activeExercise) {
      setActiveExercise(null)
      alert("¡Actividad completada! Tu progreso ha sido registrado. 🎉")
    }
  }

  const handleNextStep = () => {
    if (activeExercise?.steps && activeExercise.currentStep! < activeExercise.steps.length - 1) {
      setActiveExercise(prev => prev ? { ...prev, currentStep: prev.currentStep! + 1 } : prev)
    }
  }

  const handlePrevStep = () => {
    if (activeExercise?.steps && activeExercise.currentStep! > 0) {
      setActiveExercise(prev => prev ? { ...prev, currentStep: prev.currentStep! - 1 } : prev)
    }
  }

  const recursos = [
    {
      id: 1,
      title: "Pausa Mindfulness de 3 Minutos",
      description: "Aprende técnicas de atención plena adaptadas al entorno laboral moderno",
      type: "Mindfulness",
      category: "mindfulness",
      duration: "3 min",
      rating: 4.8,
      icon: <Video className="w-5 h-5" />,
      color: "bg-green-100 text-green-700",
      tags: ["Principiantes", "Trabajo", "Estrés"],
      steps: [
        { text: "Siéntate en una postura cómoda.", img: "/sitdown.gif" },
        { text: "Concéntrate en tu respiración natural.", img: "/respira.gif" },
        { text: "Observa tus pensamientos sin juzgar.", img: "/piensa.gif" },
        { text: "Permanece en estado de presencia.", img: "/calm.gif" },
      ],
    },
    {
      id: 2,
      title: "Meditación Guiada: Reducción del Estrés Laboral",
      description: "Sesión de 20 minutos diseñada específicamente para aliviar la tensión del trabajo",
      type: "Audio",
      category: "meditacion",
      duration: "20 min",
      rating: 4.9,
      icon: <Headphones className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-700",
      tags: ["Estrés", "Relajación", "Trabajo"],
    },
    {
      id: 3,
      title: "Técnicas de Respiración para la Ansiedad",
      description: "Video tutorial con ejercicios prácticos para manejar momentos de ansiedad",
      type: "Video",
      category: "ansiedad",
      duration: "12 min",
      rating: 4.7,
      icon: <Video className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-700",
      tags: ["Ansiedad", "Respiración", "Técnicas"],
      videoUrl: "https://www.youtube.com/embed/EGO5m_DBzF8?si=jldSaA_xyrjgNhse",
    },
    {
      id: 4,
      title: "Rutina de Sueño para Profesionales Ocupados",
      description: "Estrategias para mejorar la calidad del sueño con horarios demandantes",
      type: "Artículo",
      category: "sueno",
      duration: "10 min lectura",
      rating: 4.6,
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-indigo-100 text-indigo-700",
      tags: ["Sueño", "Rutinas", "Productividad"],
    },
    {
      id: 5,
      title: "Ejercicios de Escritorio para Reducir Tensión",
      description: "Movimientos simples que puedes hacer en tu lugar de trabajo",
      type: "Video",
      category: "ejercicio",
      duration: "8 min",
      rating: 4.5,
      icon: <Video className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-700",
      tags: ["Ejercicio", "Oficina", "Tensión"],
      videoUrl: "https://www.youtube.com/embed/LBeh-uzFzns",
    },
    {
      id: 6,
      title: "Podcast: Equilibrio Vida-Trabajo en la Era Digital",
      description: "Conversación con expertos sobre mantener límites saludables",
      type: "Audio",
      category: "equilibrio",
      duration: "45 min",
      rating: 4.8,
      icon: <Headphones className="w-5 h-5" />,
      color: "bg-teal-100 text-teal-700",
      tags: ["Equilibrio", "Trabajo", "Límites"],
    },
  ]

  const categorias = [
    { id: "todos", label: "Todos los Recursos", icon: <Target className="w-4 h-4" /> },
    { id: "mindfulness", label: "Mindfulness", icon: <Brain className="w-4 h-4" /> },
    { id: "meditacion", label: "Meditación", icon: <Heart className="w-4 h-4" /> },
    { id: "ansiedad", label: "Ansiedad", icon: <Zap className="w-4 h-4" /> },
    { id: "sueno", label: "Sueño", icon: <Moon className="w-4 h-4" /> },
    { id: "ejercicio", label: "Ejercicio", icon: <Coffee className="w-4 h-4" /> },
    { id: "equilibrio", label: "Equilibrio", icon: <Users className="w-4 h-4" /> },
  ]

  const recursosEmergencia = [
    {
      nombre: "Línea Nacional de Emergencias en Salud",
      telefono: "123",
      descripcion: "Atención integral en emergencias de salud, incluyendo salud mental. Disponible 24/7 en todo el territorio nacional.",
      tipo: "Crisis",
    },
    {
      nombre: "Línea de la Vida",
      telefono: "(605) 3399999",
      descripcion: "Atención en salud mental y prevención de suicidio. Disponible 24/7.",
      tipo: "Crisis",
    },
    {
      nombre: "Línea Púrpura (Violencia de Género)",
      telefono: "018000112137",
      descripcion: "Atención a mujeres víctimas de violencia basada en género. Disponible 24/7.",
      tipo: "Apoyo",
    },
    {
      nombre: "Mesa de Ayuda del Ministerio de Salud",
      telefono: "(601) 330 5043",
      descripcion: "Orientación en salud mental y adicciones. Lunes a viernes de 7:00 a.m. a 6:00 p.m.; sábados de 8:00 a.m. a 1:00 p.m.",
      tipo: "Apoyo",
    },
    {
      nombre: "Línea de Emergencias y Desastres",
      telefono: "(601) 330 5071",
      descripcion: "Atención en situaciones de emergencia y desastres, incluyendo salud mental. Disponible 24/7.",
      tipo: "Crisis",
    },
    {
      nombre: "Chat WhatsApp Bogotá",
      telefono: "3007548933",
      descripcion: "Apoyo emocional y salud mental para habitantes de Bogotá.",
      tipo: "Chat",
    }
  ];

  const filteredRecursos = recursos.filter(recurso => {
    const matchesSearch =
      recurso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "todos" || recurso.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-gray-900">Eunonia</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recursos de Bienestar</h1>
          <p className="text-gray-600">
            Contenido recomendado por profesionales para apoyar tu crecimiento personal y bienestar mental
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categorias.map(categoria => (
              <Button
                key={categoria.id}
                variant={selectedCategory === categoria.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(categoria.id)}
                className={selectedCategory === categoria.id ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {categoria.icon}
                <span className="ml-2">{categoria.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="recursos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recursos">Recursos de Aprendizaje</TabsTrigger>
            <TabsTrigger value="herramientas">Herramientas Prácticas</TabsTrigger>
            <TabsTrigger value="emergencia">Apoyo de Emergencia</TabsTrigger>
          </TabsList>

          {/* Recursos */}
          <TabsContent value="recursos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecursos.map(recurso => (
                <Card key={recurso.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${recurso.color}`}>
                        {recurso.icon}
                      </div>
                      <Badge variant="outline">{recurso.type}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{recurso.title}</CardTitle>
                    <CardDescription className="text-sm">{recurso.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recurso.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{recurso.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recurso.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        {recurso.steps || recurso.videoUrl ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleStartExercise(recurso)}
                          >
                            Acceder
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-gray-400 cursor-not-allowed"
                            disabled
                          >
                            Próximamente
                          </Button>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Modal ejercicio */}
              <Dialog open={!!activeExercise} onOpenChange={(open) => !open && setActiveExercise(null)}>
                <DialogContent className="max-w-xl w-full">
                  <DialogHeader>
                    <DialogTitle>{activeExercise?.title}</DialogTitle>
                  </DialogHeader>

                  {activeExercise?.steps ? (
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={activeExercise.steps[activeExercise.currentStep!].img}
                        alt={`Paso ${activeExercise.currentStep! + 1}`}
                        className="w-full object-contain rounded-lg shadow"
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
                  ) : activeExercise?.videoUrl ? (
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
                    <Button variant="outline" onClick={() => setActiveExercise(null)}>Cerrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {filteredRecursos.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recursos</h3>
                <p className="text-gray-500">Intenta ajustar tu búsqueda o seleccionar una categoría diferente</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="herramientas" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Monitor de Estado de Ánimo</span>
                  </CardTitle>
                  <CardDescription>Herramienta interactiva para rastrear tu bienestar emocional</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/seguimiento">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Usar Herramienta</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span>Evaluación de Bienestar</span>
                  </CardTitle>
                  <CardDescription>Autodiagnóstico completo para identificar áreas de mejora</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/autodiagnostico">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Comenzar Evaluación</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span>Planificador de Bienestar</span>
                  </CardTitle>
                  <CardDescription>Crea un plan personalizado para mejorar tu salud mental</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline">
                    Próximamente
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Técnicas de Respiración</span>
                  </CardTitle>
                  <CardDescription>Ejercicios guiados para reducir el estrés y la ansiedad</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline">
                    Próximamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          {/* Emergencia */}
          <TabsContent value="emergencia">
            <div className="space-y-4">
              {recursosEmergencia.map((item, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{item.nombre}</CardTitle>
                    <CardDescription>{item.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">Teléfono: {item.telefono}</p>
                    <Badge>{item.tipo}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
