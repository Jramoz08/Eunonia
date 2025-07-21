"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Zap, Coffee, Moon, Smile, Frown, Meh, ArrowLeft, Save, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function SeguimientoEmocional() {
  const [mood, setMood] = useState([7])
  const [stress, setStress] = useState([4])
  const [energy, setEnergy] = useState([6])
  const [sleep, setSleep] = useState([7])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const emotions = [
    { name: "Feliz", icon: "😊", color: "bg-yellow-100 text-yellow-700" },
    { name: "Ansioso", icon: "😰", color: "bg-orange-100 text-orange-700" },
    { name: "Calmado", icon: "😌", color: "bg-green-100 text-green-700" },
    { name: "Frustrado", icon: "😤", color: "bg-red-100 text-red-700" },
    { name: "Motivado", icon: "💪", color: "bg-blue-100 text-blue-700" },
    { name: "Cansado", icon: "😴", color: "bg-gray-100 text-gray-700" },
    { name: "Optimista", icon: "🌟", color: "bg-purple-100 text-purple-700" },
    { name: "Abrumado", icon: "🤯", color: "bg-pink-100 text-pink-700" },
  ]

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  const getMoodIcon = (value: number) => {
    if (value >= 8) return <Smile className="w-6 h-6 text-green-500" />
    if (value >= 5) return <Meh className="w-6 h-6 text-yellow-500" />
    return <Frown className="w-6 h-6 text-red-500" />
  }

  const handleSave = () => {
    const data = {
      mood: mood[0],
      stress: stress[0],
      energy: energy[0],
      sleep: sleep[0],
      emotions: selectedEmotions,
      notes,
      timestamp: new Date().toISOString(),
    }

    // Simular guardado
    console.log("Datos guardados:", data)
    alert("¡Registro guardado exitosamente! 🎉")
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento Emocional</h1>
          <p className="text-gray-600">
            Registra tu estado emocional actual para obtener recomendaciones personalizadas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>Estado de Ánimo</span>
                </CardTitle>
                <CardDescription>¿Cómo te sientes en general hoy? (1 = Muy mal, 10 = Excelente)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  {getMoodIcon(mood[0])}
                  <div className="flex-1">
                    <Slider value={mood} onValueChange={setMood} max={10} min={1} step={1} className="w-full" />
                  </div>
                  <span className="text-2xl font-bold text-green-600">{mood[0]}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Muy mal</span>
                  <span>Regular</span>
                  <span>Excelente</span>
                </div>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span>Nivel de Estrés</span>
                </CardTitle>
                <CardDescription>¿Qué tan estresado te sientes? (1 = Muy relajado, 10 = Muy estresado)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        stress[0] <= 3 ? "bg-green-500" : stress[0] <= 6 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <Slider value={stress} onValueChange={setStress} max={10} min={1} step={1} className="w-full" />
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{stress[0]}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Muy relajado</span>
                  <span>Moderado</span>
                  <span>Muy estresado</span>
                </div>
              </CardContent>
            </Card>

            {/* Energy Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coffee className="w-5 h-5 text-blue-600" />
                  <span>Nivel de Energía</span>
                </CardTitle>
                <CardDescription>¿Cómo está tu energía hoy? (1 = Muy baja, 10 = Muy alta)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Coffee className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <Slider value={energy} onValueChange={setEnergy} max={10} min={1} step={1} className="w-full" />
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{energy[0]}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Muy baja</span>
                  <span>Moderada</span>
                  <span>Muy alta</span>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-purple-600" />
                  <span>Calidad del Sueño</span>
                </CardTitle>
                <CardDescription>¿Cómo dormiste anoche? (1 = Muy mal, 10 = Excelente)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Moon className="w-6 h-6 text-purple-600" />
                  <div className="flex-1">
                    <Slider value={sleep} onValueChange={setSleep} max={10} min={1} step={1} className="w-full" />
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{sleep[0]}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Muy mal</span>
                  <span>Regular</span>
                  <span>Excelente</span>
                </div>
              </CardContent>
            </Card>

            {/* Emotions */}
            <Card>
              <CardHeader>
                <CardTitle>Emociones Específicas</CardTitle>
                <CardDescription>Selecciona las emociones que mejor describen cómo te sientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion.name}
                      variant={selectedEmotions.includes(emotion.name) ? "default" : "outline"}
                      className={`h-16 flex-col space-y-1 ${
                        selectedEmotions.includes(emotion.name) ? "bg-green-600 hover:bg-green-700" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleEmotion(emotion.name)}
                    >
                      <span className="text-lg">{emotion.icon}</span>
                      <span className="text-xs">{emotion.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notas Adicionales</CardTitle>
                <CardDescription>¿Hay algo específico que quieras compartir sobre tu día?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Escribe aquí cualquier detalle sobre tu estado emocional, eventos del día, o factores que puedan haber influido en cómo te sientes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Guardar Registro
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Resumen Actual</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estado de Ánimo</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {mood[0]}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nivel de Estrés</span>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      {stress[0]}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Energía</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {energy[0]}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sueño</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {sleep[0]}/10
                    </Badge>
                  </div>
                </div>

                {selectedEmotions.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-2">Emociones seleccionadas:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedEmotions.map((emotion) => (
                        <Badge key={emotion} variant="secondary" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Consejos para el Seguimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p>Registra tu estado al menos una vez al día para obtener mejores insights</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Sé honesto contigo mismo, no hay respuestas correctas o incorrectas</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p>Las notas adicionales ayudan a identificar patrones y triggers</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/recomendaciones">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Brain className="w-4 h-4 mr-2" />
                    Ver Recomendaciones
                  </Button>
                </Link>
                <Link href="/recursos">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Recursos de Apoyo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
