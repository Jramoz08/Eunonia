"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import {
  type User,
  loginUserWithPassword,
  getUserById,
} from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      try {
        const cookieUserId = getCookie("Eunonia_current_user")
        if (cookieUserId) {
          const userData = await getUserById(cookieUserId)
          if (userData && userData.activo) {
            setUser(userData)
          } else {
            deleteCookie("Eunonia_current_user")
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        deleteCookie("Eunonia_current_user")
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const userData = await loginUserWithPassword(email, password)
      if (userData) {
        setUser(userData)
        setCookie("Eunonia_current_user", userData.id)
        return userData
      }
      return null
    } catch (error) {
      console.error("Error en login:", error)
      return null
    }
  }

  const logout = () => {
    setUser(null)
    deleteCookie("Eunonia_current_user")
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}

// ====================
// Cookie helpers
// ====================

function setCookie(name: string, value: string) {
  // Ajuste para cookie segura y con duración de 7 días
  const expires = new Date()
  expires.setDate(expires.getDate() + 7)
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  )
  return match ? decodeURIComponent(match[2]) : null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax`
}
