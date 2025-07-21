"use client"

import { useState } from "react"
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
  Download,
  ExternalLink,
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

  const recursos = [
    {
      id: 1,
      title: "Guía Completa de Mindfulness para Profesionales",
      description: "Aprende técnicas de atención plena adaptadas al entorno laboral moderno",
      type: "Artículo",
      category: "mindfulness",
      duration: "15 min lectura",
      rating: 4.8,
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-green-100 text-green-700",
      tags: ["Principiantes", "Trabajo", "Estrés"],
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
      nombre: "Línea Nacional de Prevención del Suicidio",
      telefono: "988",
      descripcion: "Disponible 24/7 para crisis de salud mental",
      tipo: "Crisis",
    },
    {
      nombre: "Teléfono de la Esperanza",
      telefono: "717 003 717",
      descripcion: "Apoyo emocional y prevención del suicidio",
      tipo: "Apoyo",
    },
    {
      nombre: "Chat de Crisis Online",
      telefono: "www.crisistext.org",
      descripcion: "Apoyo por chat las 24 horas",
      tipo: "Chat",
    },
  ]

  const filteredRecursos = recursos.filter((recurso) => {
    const matchesSearch =
      recurso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recursos de Bienestar</h1>
          <p className="text-gray-600">
            Contenido curado por profesionales para apoyar tu crecimiento personal y bienestar mental
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
            {categorias.map((categoria) => (
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

          <TabsContent value="recursos" className="space-y-6">
            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecursos.map((recurso) => (
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
                        {recurso.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Acceder
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

          <TabsContent value="emergencia" className="space-y-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Recursos de Crisis y Emergencia</CardTitle>
                <CardDescription className="text-red-700">
                  Si estás experimentando una crisis de salud mental o pensamientos de autolesión, busca ayuda inmediata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recursosEmergencia.map((recurso, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{recurso.nombre}</h4>
                        <p className="text-sm text-gray-600">{recurso.descripcion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-100 text-red-700 mb-1">{recurso.tipo}</Badge>
                      <p className="font-mono text-lg font-bold text-red-600">{recurso.telefono}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Señales de Alerta</CardTitle>
                <CardDescription>Busca ayuda profesional si experimentas alguno de estos síntomas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Síntomas Emocionales:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Pensamientos de autolesión o suicidio</li>
                      <li>• Sentimientos intensos de desesperanza</li>
                      <li>• Cambios extremos de humor</li>
                      <li>• Pérdida total de interés en actividades</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Síntomas Físicos:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Insomnio severo o dormir excesivamente</li>
                      <li>• Pérdida significativa de apetito</li>
                      <li>• Fatiga extrema persistente</li>
                      <li>• Síntomas físicos sin causa médica</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
