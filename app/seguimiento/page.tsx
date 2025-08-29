"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import {
  Brain,
  Heart,
  Zap,
  Coffee,
  Moon,
  Smile,
  Frown,
  Meh,
  ArrowLeft,
  Save,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabaseClient"

export default function SeguimientoEmocional() {
  const [mood, setMood] = useState<number[]>([7])
  const [stress, setStress] = useState<number[]>([4])
  const [energy, setEnergy] = useState<number[]>([6])
  const [sleep, setSleep] = useState<number[]>([7])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const router = useRouter()
  const [yaRegistroHoy, setYaRegistroHoy] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabaseClient = supabase
  const { user } = useAuth()

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
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    )
  }

  const getMoodIcon = (value: number) => {
    if (value >= 8) return <Smile className="w-6 h-6 text-green-500" />
    if (value >= 5) return <Meh className="w-6 h-6 text-yellow-500" />
    return <Frown className="w-6 h-6 text-red-500" />
  }

  // Obtener fecha local en formato YYYY-MM-DD
  const todayDateOnly = (() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`
  })()

  // Al montar, verifica si ya hay registro hoy
  useEffect(() => {
    if (!user) {
      setYaRegistroHoy(false)
      setLoading(false)
      return
    }

    const verificarRegistro = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabaseClient
          .from("emotional_records")
          .select("id")
          .eq("user_id", user.id)
          .eq("fecha", todayDateOnly)
          .limit(1)

        if (error) {
          console.error("Error consultando registros:", error)
          setYaRegistroHoy(false)
        } else if (data && data.length > 0) {
          setYaRegistroHoy(true)
        } else {
          setYaRegistroHoy(false)
        }
      } catch (error) {
        console.error("Error al verificar registro:", error)
        setYaRegistroHoy(false)
      } finally {
        setLoading(false)
      }
    }

    verificarRegistro()
  }, [user, supabaseClient, todayDateOnly])

  const handleSave = async () => {
    if (!user) {
      alert("Debes iniciar sesión para guardar tus registros.")
      return
    }

    if (yaRegistroHoy) {
      alert("Ya tienes un registro para hoy, solo puedes hacer uno por día.")
      return
    }

    try {
      const { error: insertError } = await supabaseClient.from("emotional_records").insert({
        user_id: user.id,
        fecha: todayDateOnly,
        mood: mood[0],
        stress: stress[0],
        energy: energy[0],
        sleep: sleep[0],
        emociones: selectedEmotions,
        notas: notes,
      })

      if (insertError) throw insertError

      alert("¡Registro guardado exitosamente! 🎉")
      setYaRegistroHoy(true) // Bloquea el registro luego de guardar
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Ocurrió un error al guardar el registro.")
    }
  }

  if (loading) return <p className="p-4 text-center">Cargando...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento Emocional</h1>
          <p className="text-gray-600">
            Registra tu estado emocional actual para obtener recomendaciones personalizadas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Estado de ánimo */}
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
                    <Slider
                      value={mood}
                      onValueChange={setMood}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={yaRegistroHoy}
                    />
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

            {/* Nivel de Estrés */}
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
                      className={`w-4 h-4 rounded-full ${stress[0] <= 3 ? "bg-green-500" : stress[0] <= 6 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <Slider
                      value={stress}
                      onValueChange={setStress}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={yaRegistroHoy}
                    />
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

            {/* Nivel de Energía */}
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
                    <Slider
                      value={energy}
                      onValueChange={setEnergy}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={yaRegistroHoy}
                    />
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

            {/* Calidad del Sueño */}
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
                    <Slider
                      value={sleep}
                      onValueChange={setSleep}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                      disabled={yaRegistroHoy}
                    />
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

            {/* Emociones Específicas */}
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
                      className={`h-16 flex-col space-y-1 ${selectedEmotions.includes(emotion.name)
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-gray-50"
                        }`}
                      onClick={() => toggleEmotion(emotion.name)}
                      disabled={yaRegistroHoy}
                    >
                      <span className="text-lg">{emotion.icon}</span>
                      <span className="text-xs">{emotion.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notas */}
            <Card>
              <CardHeader>
                <CardTitle>Notas Adicionales</CardTitle>
                <CardDescription>Escribe cualquier detalle adicional sobre cómo te sientes</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Escribe tus notas aquí..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={yaRegistroHoy}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho resumen + guardar */}
          <div className="space-y-6 sticky top-20">
            <Card className="p-6">
              <CardTitle className="mb-2">Resumen del Día</CardTitle>
              <div className="space-y-2">
                <p>
                  <strong>Estado de ánimo:</strong> {mood[0]}
                </p>
                <p>
                  <strong>Energía:</strong> {energy[0]}
                </p>
                <p>
                  <strong>Estrés:</strong> {stress[0]}
                </p>
                <p>
                  <strong>Sueño:</strong> {sleep[0]}
                </p>
                <p>
                  <strong>Emociones:</strong>{" "}
                  {selectedEmotions.length > 0 ? selectedEmotions.join(", ") : "Ninguna seleccionada"}
                </p>
                <p>
                  <strong>Notas:</strong> {notes || "Ninguna"}
                </p>
              </div>
            </Card>

            <Button
              onClick={handleSave}
              disabled={yaRegistroHoy}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Guardar Registro</span>
            </Button>

            {yaRegistroHoy && (
              <p className="text-sm text-center text-red-600">
                Ya has registrado tus emociones para hoy. Solo puedes registrar una vez al día.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
