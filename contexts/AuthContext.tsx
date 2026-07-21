'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('patterson-crm-token')
      const storedUser = localStorage.getItem('patterson-crm-user')

      if (storedToken) {
        setToken(storedToken)
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (_) {
          localStorage.removeItem('patterson-crm-user')
        }
      }
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient<{ token?: string; accessToken?: string; user?: User }>('api/auth/login', {
        method: 'POST',
        body: { email, password },
        skipAuth: true,
      })

      const jwtToken = response.token || response.accessToken
      if (!jwtToken) {
        throw new Error('Invalid response: No token returned from server')
      }

      // Handle fallback user if the API only returns a token
      const loggedInUser: User = response.user || {
        id: 'u-' + Math.random().toString(36).substring(2, 11),
        firstName: email.split('@')[0],
        lastName: 'User',
        fullName: email.split('@')[0],
        email: email,
        role: 'super_admin',
        status: 'active',
        dealership: 'Patterson Cheney Head Office',
        brand: 'Toyota',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        permissions: [],
        activityCount: 1,
      }

      setToken(jwtToken)
      setUser(loggedInUser)

      localStorage.setItem('patterson-crm-token', jwtToken)
      localStorage.setItem('patterson-crm-user', JSON.stringify(loggedInUser))

      router.push('/')
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: any) => {
    setIsLoading(true)
    try {
      await apiClient<User>('api/users', {
        method: 'POST',
        body: data,
        skipAuth: true,
      })
      router.push('/login')
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('patterson-crm-token')
    localStorage.removeItem('patterson-crm-user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
