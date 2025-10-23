"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function AutodiagnosticoSRQ() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [showHabeasData, setShowHabeasData] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [answers, setAnswers] = useState<number[]>(Array(20).fill(0))
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [blocked, setBlocked] = useState(false)

  const DIAS_BLOQUEO = 30

  // 🔒 Mostrar modal si no se ha aceptado antes
  useEffect(() => {
    const acceptedHabeas = localStorage.getItem("habeasDataAccepted")
    if (!acceptedHabeas) setShowHabeasData(true)
    else setAccepted(true)
  }, [])

  // 🚪 Si no está autenticado, redirigir
  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login")
  }, [isAuthenticated, router])

  // ⚠️ Revisar si pasó menos de 30 días desde el último llenado
  useEffect(() => {
    const lastFilled = localStorage.getItem("srqLastFilled")
    if (lastFilled) {
      const lastDate = new Date(lastFilled)
      const now = new Date()
      const diffDias = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDias < DIAS_BLOQUEO) {
        setBlocked(true)
        setSubmitted(true) // mostrar pantalla final aunque no lo haya llenado ahora
      }
    }
  }, [])

  // ✅ Guardar respuestas
  const handleChange = (index: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  // 📤 Simular envío de resultados
  const handleSubmit = async () => {
    setLoading(true)
    const total = answers.reduce((a, b) => a + b, 0)
    setScore(total)

    try {
      // Guardar la fecha del llenado
      localStorage.setItem("srqLastFilled", new Date().toISOString())

      // Simulación del envío a servidor
      console.log("Simulando envío de datos:", {
        user_id: user?.id,
        fecha: new Date().toISOString(),
        respuestas: answers,
        puntaje_total: total,
      })

      // Esperar 1 segundo para simular carga
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Respuestas enviadas correctamente ✅ (simulado)")
      setSubmitted(true)
    } catch (err) {
      console.error("Error simulando el envío de resultados:", err)
      alert("Error al guardar los resultados ❌ (simulado)")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptHabeas = () => {
    localStorage.setItem("habeasDataAccepted", "true")
    setShowHabeasData(false)
    setAccepted(true)
  }

  const handleRejectHabeas = () => {
    router.push("/dashboard")
  }

  const preguntas = [
    "¿Ha tenido frecuentes dolores de cabeza?",
    "¿Ha perdido el apetito?",
    "¿Duerme mal?",
    "¿Se asusta con facilidad?",
    "¿Se siente tenso o nervioso?",
    "¿Tiene temblores en las manos?",
    "¿Se siente triste con frecuencia?",
    "¿Llora con frecuencia?",
    "¿Tiene dificultades para disfrutar de sus actividades diarias?",
    "¿Tiene dificultades para tomar decisiones?",
    "¿Tiene dificultades para realizar su trabajo habitual?",
    "¿Se siente incapaz de cumplir con sus responsabilidades?",
    "¿Ha perdido interés en las cosas?",
    "¿Siente que es una persona inútil?",
    "¿Ha tenido pensamientos de acabar con su vida?",
    "¿Se siente cansado todo el tiempo?",
    "¿Tiene problemas digestivos frecuentes?",
    "¿Tiene dificultades para pensar con claridad?",
    "¿Siente que su vida no vale la pena?",
    "¿Ha tenido pensamientos o comportamientos extraños?",
  ]

  if (!accepted) {
    return (
      <Dialog open={showHabeasData}>
        <DialogContent className="max-w-sm h-[580px] rounded-2xl p-6 flex flex-col justify-between">
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Autorización de Habeas Data
            </DialogTitle>
          </DialogHeader>

          <div className="text-gray-700 text-sm space-y-3 overflow-y-auto">
            <p>
              Eunonia recopilará la información de este test únicamente con fines de análisis, investigación y mejora de la salud mental del usuario.
            </p>
            <p>
              Este instrumento tiene fines <strong>educativos y evaluativos</strong>. Los resultados no serán mostrados directamente al usuario, sino que serán enviados de forma segura a una <strong>IPS de la Universitaria de Colombia</strong>, donde un <strong>psicólogo</strong> revisará y analizará la información para su interpretación profesional.
            </p>
            <p>
              Los datos serán tratados de acuerdo con la <strong>Ley 1581 de 2012</strong> y las políticas de privacidad vigentes.
            </p>
            <p>
              ¿Desea autorizar el tratamiento de sus datos personales para realizar este autodiagnóstico?
            </p>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={handleRejectHabeas}>
              No Acepto
            </Button>
            <Button
              onClick={handleAcceptHabeas}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Acepto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
  <Card className="max-w-3xl mx-auto">
    <CardHeader>
      <CardTitle>🧠 Test SRQ - Autodiagnóstico de Salud Mental</CardTitle>
      <CardDescription>
        Responde con sinceridad a las siguientes preguntas (Sí / No).
      </CardDescription>
    </CardHeader>

    <CardContent>
      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Control del paso actual */}
          <div className="flex flex-col space-y-4 text-center">
            <p className="text-sm text-gray-500">
              Pregunta {currentQuestion + 1} de {preguntas.length}
            </p>
            <span className="text-base font-medium text-gray-800">
              {preguntas[currentQuestion]}
            </span>

            <div className="flex justify-center space-x-8 mt-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  name={`q${currentQuestion}`}
                  value={1}
                  checked={answers[currentQuestion] === 1}
                  onChange={() => handleChange(currentQuestion, 1)}
                  required
                  disabled={blocked}
                />
                <span>Sí</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  name={`q${currentQuestion}`}
                  value={0}
                  checked={answers[currentQuestion] === 0}
                  onChange={() => handleChange(currentQuestion, 0)}
                  disabled={blocked}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Controles de navegación */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestion === 0 || blocked}
            >
              Anterior
            </Button>

            {currentQuestion < preguntas.length - 1 ? (
              <Button
                type="button"
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(prev + 1, preguntas.length - 1)
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={blocked}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || blocked}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Enviando..." : "Enviar Respuestas"}
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center space-y-4">
          {blocked ? (
            <h3 className="text-lg font-semibold text-red-700">
              ⚠️ Solo puedes llenar este test una vez cada {DIAS_BLOQUEO} días.
            </h3>
          ) : (
            <h3 className="text-lg font-semibold text-green-700">
              ✅ Tus respuestas han sido guardadas correctamente
            </h3>
          )}

          <p className="text-gray-700 text-sm">
            La información recolectada será enviada a la <strong>IPS de la Universitaria de Colombia</strong>{" "}
            para que un <strong>psicólogo profesional</strong> pueda revisar y analizar tus resultados con fines educativos y evaluativos.
          </p>

          <div className="text-sm text-gray-700 space-y-2 pt-2">
            <p>
              📍 <strong>Consultorio PSI:</strong> Calle 36 # 13 - 09  
              <br />
              📞 <strong>Celular:</strong> 311 514 8383
            </p>
            <p>
              📍 <strong>IPS:</strong> Calle 34 # 5 - 89  
              <br />
              📞 <strong>Celular:</strong> 313 858 7733
            </p>
          </div>
          <p className="text-xs text-gray-500 pt-2">
            Gracias por tu participación. Recuerda que este instrumento tiene fines educativos y de orientación psicológica.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ir al Dashboard
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</div>

  )
}
