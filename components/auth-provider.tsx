"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, authenticateUser, getUserById } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión activa
    const storedUserId = localStorage.getItem("mentalwell_current_user")
    if (storedUserId) {
      const userData = getUserById(storedUserId)
      if (userData && userData.activo) {
        setUser(userData)
      } else {
        localStorage.removeItem("mentalwell_current_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = authenticateUser(email, password)
      if (userData) {
        setUser(userData)
        localStorage.setItem("mentalwell_current_user", userData.id)
        return true
      }
      return false
    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mentalwell_current_user")
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
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
