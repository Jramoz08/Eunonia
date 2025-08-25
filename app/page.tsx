"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Brain, Heart, Shield, Users, Zap, ArrowRight, Star, CheckCircle, Menu, X } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert("¡Gracias por tu interés! Te contactaremos pronto.")
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-15" />
              <span className="text-xl font-bold text-gray-900">Eunonia</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#funcionalidades" className="text-gray-600 hover:text-green-600 transition-colors">
                Funcionalidades
              </a>
              <a href="#como-funciona" className="text-gray-600 hover:text-green-600 transition-colors">
                Cómo Funciona
              </a>
              <a href="#testimonios" className="text-gray-600 hover:text-green-600 transition-colors">
                Testimonios
              </a>
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline">Iniciar Sesión</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-green-600 hover:bg-green-700">Registrarse</Button>
                </Link>
              </div>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-green-100">
            <div className="px-4 py-2 space-y-2">
              <a href="#funcionalidades" className="block py-2 text-gray-600">
                Funcionalidades
              </a>
              <a href="#como-funciona" className="block py-2 text-gray-600">
                Cómo Funciona
              </a>
              <a href="#testimonios" className="block py-2 text-gray-600">
                Testimonios
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Registrarse</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-10 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex md:grid flex-col-reverse flex lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  IA Personalizada para tu Bienestar
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Tu bienestar mental es nuestra{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    prioridad
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plataforma inteligente diseñada específicamente para jóvenes profesionales. Gestiona el estrés laboral
                  y mejora tu bienestar con recomendaciones personalizadas basadas en inteligencia artificial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-3 border-green-200 hover:bg-green-50 bg-transparent"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% Confidencial</span>
                </div>

                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/placeholder.webp?height=600&width=500"
                  alt="Espacio de bienestar y meditación"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Funcionalidades Diseñadas para Ti</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas inteligentes que se adaptan a tu estilo de vida profesional y te ayudan a mantener un
              equilibrio saludable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Seguimiento Emocional</CardTitle>
                <CardDescription>
                  Monitorea tu estado emocional diario con herramientas intuitivas y obtén insights sobre tus patrones
                  de bienestar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">IA Personalizada</CardTitle>
                <CardDescription>
                  Algoritmos de machine learning analizan tus datos para ofrecerte recomendaciones personalizadas y
                  efectivas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Gestión del Estrés</CardTitle>
                <CardDescription>
                  Técnicas especializadas para manejar el estrés laboral, adaptadas a las demandas de jóvenes
                  profesionales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Privacidad Total</CardTitle>
                <CardDescription>
                  Tus datos están protegidos con encriptación de nivel empresarial y nunca se comparten sin tu
                  consentimiento.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Comunidad de Apoyo</CardTitle>
                <CardDescription>
                  Conecta con otros profesionales que comparten experiencias similares en un entorno seguro y de apoyo
                  mutuo.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Recursos Profesionales</CardTitle>
                <CardDescription>
                  Acceso a contenido curado por psicólogos especializados en salud mental laboral y desarrollo
                  profesional.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Cómo Funciona Eunonia</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un proceso simple y efectivo diseñado para integrarse perfectamente en tu rutina profesional diaria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Evaluación Inicial</h3>
              <p className="text-gray-600">
                Completa un autodiagnóstico personalizado que nos ayuda a entender tu situación actual y objetivos de
                bienestar.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Seguimiento Diario</h3>
              <p className="text-gray-600">
                Registra tu estado emocional y actividades diarias. Nuestra IA aprende de tus patrones para ofrecerte
                mejores recomendaciones.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Crecimiento Continuo</h3>
              <p className="text-gray-600">
                Recibe recomendaciones personalizadas, accede a recursos especializados y conecta con una comunidad de
                apoyo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Comienza tu Viaje hacia el Bienestar Hoy</h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Únete a miles de jóvenes profesionales que ya están transformando su relación con el estrés y mejorando su
            calidad de vida.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-green-100"
              required
            />
            <Button type="submit" className="bg-white text-green-600 hover:bg-green-50">
              Comenzar Gratis
            </Button>
          </form>

          <p className="text-sm text-green-100">
            Sin tarjeta de crédito requerida • Cancela en cualquier momento • 100% confidencial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/eunonia_logo.svg" alt="eunonia logo" className="w-12 h-15" />
                <span className="text-xl font-bold">Eunonia</span>
              </div>
              <p className="text-gray-400">
                Transformando la salud mental de jóvenes profesionales a través de la tecnología.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guías
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Eunonia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
