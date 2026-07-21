'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { token, isLoading } = useAuth()

  const isAuthPage = pathname === '/login' || pathname === '/signup'

  useEffect(() => {
    if (!isLoading && !token && !isAuthPage) {
      router.push('/login')
    }
  }, [token, isLoading, isAuthPage, router])

  if (isAuthPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading CRM Session...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

