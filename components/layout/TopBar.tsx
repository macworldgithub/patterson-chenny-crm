'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockNotifications } from '@/lib/mock-data'
import { useTheme } from '@/contexts/ThemeContext'
import { CommandPalette } from '@/components/layout/CommandPalette'

interface TopBarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function TopBar({ onMenuToggle, isSidebarOpen = false }: TopBarProps) {
  const { theme, toggleTheme } = useTheme()
  const [commandOpen, setCommandOpen] = useState(false)
  const unreadCount = mockNotifications.filter(n => !n.read).length

  return (
    <>
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 py-3 px-4 sm:px-6 sm:h-14 bg-white/80 dark:bg-[#0F1A2E]/80 backdrop-blur-md border-b border-border">
        {/* Hamburger menu button - show on max-lg */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden shrink-0"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Search trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="flex min-w-0 w-full items-center gap-2 h-9 px-3 rounded-xl bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors flex-1 sm:max-w-xs border border-border"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Campaign selector */}
        {/* <Select defaultValue={campaigns[0]}>
          <SelectTrigger className="h-9 w-[220px] text-xs border-border hidden lg:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((c) => (
              <SelectItem key={c} value={c} className="text-xs">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <div className="flex items-center gap-2 ml-auto">
          {/* Quick create */}
          {/* <Button
            size="sm"
            className="h-9 gap-1.5 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-xs font-medium px-4 hidden sm:flex"
          >
            <Plus className="w-3.5 h-3.5" />
            New Campaign
          </Button> */}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-background hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] font-bold"
                >
                  {unreadCount}
                </motion.span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-2xl p-2">
              <DropdownMenuLabel className="flex items-center justify-between px-2 pb-2">
                <span className="font-semibold text-sm">Notifications</span>
                <Badge variant="secondary" className="text-[10px]">{unreadCount} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockNotifications.slice(0, 4).map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 rounded-xl p-3 cursor-pointer">
                  <div className="flex items-center gap-2 w-full">
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${!n.read ? '' : 'text-muted-foreground ml-3.5'}`}>
                      {n.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 ml-3.5">{n.message}</p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/notifications" className="justify-center text-xs text-primary font-medium py-2 rounded-xl">
                  View all notifications
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] flex items-center justify-center text-white text-xs font-bold">
                AH
              </div>
              <span className="text-xs font-medium hidden sm:block">Alex Harrison</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 rounded-2xl p-2">
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">Alex Harrison</span>
                  <span className="text-xs text-muted-foreground">Super Admin · Group HQ</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg text-xs">Profile Settings</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg text-xs">Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg text-xs text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  )
}
