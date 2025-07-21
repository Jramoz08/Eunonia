import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ["/dashboard", "/dashboard-admin", "/dashboard-psicologo"]
  const authRoutes = ["/auth/login", "/auth/register"]

  const { pathname } = request.nextUrl

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Obtener token de autenticación de las cookies
  const token = request.cookies.get("mentalwell_current_user")?.value

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Si está autenticado y trata de acceder a rutas de auth, redirigir al dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard-admin/:path*", "/dashboard-psicologo/:path*", "/auth/:path*"],
}
