"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Info, Heart, Zap, Target } from "lucide-react"
import Link from "next/link"

export default function Autodiagnostico() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 0,
      category: "Estado de Ánimo",
      question: "¿Con qué frecuencia te has sentido desanimado, deprimido o sin esperanza en las últimas 2 semanas?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Varios días", score: 1 },
        { value: "2", label: "Más de la mitad de los días", score: 2 },
        { value: "3", label: "Casi todos los días", score: 3 },
      ],
    },
    {
      id: 1,
      category: "Estado de Ánimo",
      question: "¿Con qué frecuencia has tenido poco interés o placer en hacer cosas?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Varios días", score: 1 },
        { value: "2", label: "Más de la mitad de los días", score: 2 },
        { value: "3", label: "Casi todos los días", score: 3 },
      ],
    },
    {
      id: 2,
      category: "Ansiedad",
      question: "¿Te has sentido nervioso, ansioso o muy alterado?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Varios días", score: 1 },
        { value: "2", label: "Más de la mitad de los días", score: 2 },
        { value: "3", label: "Casi todos los días", score: 3 },
      ],
    },
    {
      id: 3,
      category: "Ansiedad",
      question: "¿Has tenido dificultades para relajarte o controlar tus preocupaciones?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Varios días", score: 1 },
        { value: "2", label: "Más de la mitad de los días", score: 2 },
        { value: "3", label: "Casi todos los días", score: 3 },
      ],
    },
    {
      id: 4,
      category: "Estrés Laboral",
      question: "¿Sientes que tu trabajo te genera más estrés del que puedes manejar?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Ocasionalmente", score: 1 },
        { value: "2", label: "Frecuentemente", score: 2 },
        { value: "3", label: "Constantemente", score: 3 },
      ],
    },
    {
      id: 5,
      category: "Estrés Laboral",
      question: "¿Te resulta difícil desconectarte del trabajo al final del día?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Ocasionalmente", score: 1 },
        { value: "2", label: "Frecuentemente", score: 2 },
        { value: "3", label: "Siempre", score: 3 },
      ],
    },
    {
      id: 6,
      category: "Sueño y Energía",
      question: "¿Has tenido problemas para dormir o mantenerte dormido?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Varios días", score: 1 },
        { value: "2", label: "Más de la mitad de los días", score: 2 },
        { value: "3", label: "Casi todos los días", score: 3 },
      ],
    },
    {
      id: 7,
      category: "Sueño y Energía",
      question: "¿Te sientes cansado o con poca energía durante el día?",
      options: [
        { value: "0", label: "Nunca", score: 0 },
        { value: "1", label: "Varios días", score: 1 },
        { value: "2", label: "Más de la mitad de los días", score: 2 },
        { value: "3", label: "Casi todos los días", score: 3 },
      ],
    },
    {
      id: 8,
      category: "Relaciones Sociales",
      question: "¿Sientes que tienes suficiente apoyo social en tu vida?",
      options: [
        { value: "3", label: "Nunca", score: 3 },
        { value: "2", label: "Ocasionalmente", score: 2 },
        { value: "1", label: "Frecuentemente", score: 1 },
        { value: "0", label: "Siempre", score: 0 },
      ],
    },
    {
      id: 9,
      category: "Autocuidado",
      question: "¿Qué tan bien cuidas de tu bienestar físico y mental?",
      options: [
        { value: "0", label: "Muy bien", score: 0 },
        { value: "1", label: "Bien", score: 1 },
        { value: "2", label: "Regular", score: 2 },
        { value: "3", label: "Mal", score: 3 },
      ],
    },
  ]

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateResults = () => {
    const totalScore = Object.entries(answers).reduce((sum, [questionId, answer]) => {
      const question = questions[Number.parseInt(questionId)]
      const option = question.options.find((opt) => opt.value === answer)
      return sum + (option?.score || 0)
    }, 0)

    const maxScore = questions.length * 3
    const percentage = (totalScore / maxScore) * 100

    let level = "Bajo"
    let color = "text-green-600"
    let bgColor = "bg-green-50"
    let borderColor = "border-green-200"
    let icon = <CheckCircle className="w-6 h-6 text-green-600" />
    let description = "Tu bienestar mental parece estar en un buen estado general."

    if (percentage >= 70) {
      level = "Alto"
      color = "text-red-600"
      bgColor = "bg-red-50"
      borderColor = "border-red-200"
      icon = <AlertTriangle className="w-6 h-6 text-red-600" />
      description = "Podrías beneficiarte significativamente del apoyo profesional."
    } else if (percentage >= 40) {
      level = "Moderado"
      color = "text-yellow-600"
      bgColor = "bg-yellow-50"
      borderColor = "border-yellow-200"
      icon = <Info className="w-6 h-6 text-yellow-600" />
      description = "Hay algunas áreas que podrían necesitar atención y cuidado."
    }

    // Análisis por categorías
    const categoryScores = {
      "Estado de Ánimo": 0,
      Ansiedad: 0,
      "Estrés Laboral": 0,
      "Sueño y Energía": 0,
      "Relaciones Sociales": 0,
      Autocuidado: 0,
    }

    const categoryCounts = {
      "Estado de Ánimo": 0,
      Ansiedad: 0,
      "Estrés Laboral": 0,
      "Sueño y Energía": 0,
      "Relaciones Sociales": 0,
      Autocuidado: 0,
    }

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions[Number.parseInt(questionId)]
      const option = question.options.find((opt) => opt.value === answer)
      if (option) {
        categoryScores[question.category] += option.score
        categoryCounts[question.category] += 1
      }
    })

    const categoryResults = Object.entries(categoryScores).map(([category, score]) => ({
      category,
      score,
      maxScore: categoryCounts[category] * 3,
      percentage: (score / (categoryCounts[category] * 3)) * 100,
    }))

    return {
      totalScore,
      maxScore,
      percentage,
      level,
      color,
      bgColor,
      borderColor,
      icon,
      description,
      categoryResults,
    }
  }

  const results = showResults ? calculateResults() : null

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults && results) {
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
          {/* Results Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados de tu Autodiagnóstico</h1>
            <p className="text-gray-600">Análisis completo de tu bienestar mental actual</p>
          </div>

          {/* Overall Result */}
          <Card className={`mb-8 ${results.borderColor} ${results.bgColor}`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">{results.icon}</div>
              <div className="text-center space-y-4">
                <h2 className={`text-2xl font-bold ${results.color}`}>Nivel de Riesgo: {results.level}</h2>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-gray-600">Puntuación:</span>
                  <span className={`text-xl font-semibold ${results.color}`}>
                    {results.totalScore}/{results.maxScore}
                  </span>
                  <span className="text-gray-500">({Math.round(results.percentage)}%)</span>
                </div>
                <Progress value={results.percentage} className="max-w-md mx-auto" />
                <p className="text-gray-700 max-w-2xl mx-auto">{results.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Análisis por Categorías</CardTitle>
              <CardDescription>Desglose detallado de tu bienestar en diferentes áreas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {results.categoryResults.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{category.category}</span>
                      <span className="text-sm text-gray-500">
                        {category.score}/{category.maxScore}
                      </span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {category.percentage < 30
                        ? "Bajo riesgo"
                        : category.percentage < 70
                          ? "Riesgo moderado"
                          : "Alto riesgo"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Recomendaciones Personalizadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.percentage >= 70 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Busca Apoyo Profesional</h4>
                      <p className="text-red-700 text-sm">
                        Te recomendamos encarecidamente que consultes con un profesional de la salud mental. Nuestro
                        equipo puede ayudarte a encontrar el apoyo adecuado.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Seguimiento Diario</h4>
                      <p className="text-green-700 text-sm">
                        Registra tu estado emocional diariamente para identificar patrones y triggers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Técnicas de Manejo del Estrés</h4>
                      <p className="text-blue-700 text-sm">
                        Practica técnicas de respiración y mindfulness para reducir el estrés laboral.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recomendaciones">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Ver Recomendaciones Personalizadas
              </Button>
            </Link>
            <Link href="/seguimiento">
              <Button size="lg" variant="outline">
                Comenzar Seguimiento Diario
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setShowResults(false)
                setCurrentQuestion(0)
                setAnswers({})
              }}
            >
              Repetir Evaluación
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Importante:</strong> Este autodiagnóstico es una herramienta de orientación y no reemplaza la
              evaluación de un profesional de la salud mental. Si tienes pensamientos de autolesión o suicidio, busca
              ayuda inmediata contactando servicios de emergencia o líneas de crisis.
            </p>
          </div>
        </div>
      </div>
    )
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Autodiagnóstico de Bienestar Mental</h1>
          <p className="text-gray-600">Evaluación personalizada para jóvenes profesionales</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progreso</span>
            <span className="text-sm text-gray-600">
              {currentQuestion + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {questions[currentQuestion].category}
              </Badge>
              <span className="text-sm text-gray-500">Pregunta {currentQuestion + 1}</span>
            </div>
            <CardTitle className="text-xl leading-relaxed">{questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswerChange} className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion]}
            className="bg-green-600 hover:bg-green-700"
          >
            {currentQuestion === questions.length - 1 ? "Ver Resultados" : "Siguiente"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-blue-100 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Información importante:</p>
                <p>
                  Tus respuestas son completamente confidenciales y se utilizan únicamente para generar recomendaciones
                  personalizadas. Este cuestionario no constituye un diagnóstico médico profesional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
