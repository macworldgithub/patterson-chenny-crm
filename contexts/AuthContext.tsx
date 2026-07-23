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
  forgotPassword: (email: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
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
      const response = await apiClient<{ token?: string; accessToken?: string; user?: any; data?: any }>('/auth/login', {
        method: 'POST',
        body: { email, password },
        skipAuth: true,
      })

      const jwtToken = response.token || response.accessToken
      if (!jwtToken) {
        throw new Error('Invalid response: No token returned from server')
      }

      // Normalize the user object — MongoDB returns _id, our User type uses id
      const rawUser = response.user || response.data
      let loggedInUser: User
      if (rawUser) {
        const normalized = { ...rawUser }
        // Ensure `id` is always set to the real MongoDB ObjectId
        if (!normalized.id && normalized._id) {
          normalized.id = String(normalized._id)
        }
        loggedInUser = normalized as User
      } else {
        // Fallback (should not happen in production)
        loggedInUser = {
          id: '',
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
      await apiClient<User>('/users', {
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

  // POST /api/auth/forgot-password — public, no auth required
  const forgotPassword = async (email: string) => {
    await apiClient<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      skipAuth: true,
    })
  }

  // POST /api/auth/change-password — requires auth
  const changePassword = async (currentPassword: string, newPassword: string) => {
    await apiClient<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    })
  }

  // PUT /api/users/:id — update profile info (no password)
  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Not authenticated')

    // Prefer _id (raw MongoDB field) then id. If neither is a valid 24-char hex ObjectId,
    // fall back to /auth/me to recover the real ID (handles stale localStorage sessions).
    const isValidObjectId = (v: string) => /^[a-f\d]{24}$/i.test(v)
    let userId: string = (user as any)._id || user.id || ''

    if (!isValidObjectId(userId)) {
      const meResponse = await apiClient<{ success: boolean; data: any }>('/auth/me')
      const realUser = meResponse.data
      userId = String(realUser?._id || realUser?.id || '')
      if (!isValidObjectId(userId)) {
        throw new Error('Could not resolve a valid user ID. Please log in again.')
      }
      // Patch the in-memory user so subsequent calls don't repeat this
      const patched = { ...user, id: userId, _id: userId } as any
      setUser(patched)
      localStorage.setItem('patterson-crm-user', JSON.stringify(patched))
    }

    const response = await apiClient<{ success: boolean; data: any }>(`/users/${userId}`, {
      method: 'PUT',
      body: data,
    })
    if (response.success && response.data) {
      const raw = response.data
      // Normalize _id → id from fresh backend response
      if (!raw.id && raw._id) raw.id = String(raw._id)
      const updatedUser = { ...user, ...raw }
      setUser(updatedUser)
      localStorage.setItem('patterson-crm-user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, forgotPassword, changePassword, updateProfile }}>
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
