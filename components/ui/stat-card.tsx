'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KPICard } from '@/types'

const colorMap = {
  navy: {
    bg: 'bg-[#0C1E3C]',
    icon: 'text-white',
    badge: 'bg-white/10 text-white',
  },
  cyan: {
    bg: 'bg-cyan-500',
    icon: 'text-white',
    badge: 'bg-white/20 text-white',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    icon: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    icon: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    icon: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  },
}

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changePeriod?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: React.ElementType
  color?: keyof typeof colorMap
  prefix?: string
  suffix?: string
  index?: number
  loading?: boolean
}

export function StatCard({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  changeType,
  icon: Icon,
  color = 'green',
  prefix = '',
  suffix = '',
  index = 0,
  loading = false,
}: StatCardProps) {
  const colors = colorMap[color]

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-5 border border-border card-shadow">
        <div className="shimmer h-4 w-24 rounded-lg mb-4" />
        <div className="shimmer h-8 w-32 rounded-lg mb-3" />
        <div className="shimmer h-3 w-20 rounded-lg" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
      className="bg-card rounded-2xl p-5 border border-border card-shadow cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn('flex items-center justify-center w-9 h-9 rounded-xl', colors.bg)}>
          <Icon className={cn('w-4.5 h-4.5', colors.icon)} />
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>

        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold',
            changeType === 'increase' && 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
            changeType === 'decrease' && 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
            changeType === 'neutral' && 'bg-muted text-muted-foreground',
          )}>
            {changeType === 'increase' && <TrendingUp className="w-3 h-3" />}
            {changeType === 'decrease' && <TrendingDown className="w-3 h-3" />}
            {changeType === 'neutral' && <Minus className="w-3 h-3" />}
            {changeType === 'increase' ? '+' : ''}{change}%
          </div>
        )}
      </div>

      {changePeriod && (
        <p className="text-xs text-muted-foreground mt-1">{changePeriod}</p>
      )}
    </motion.div>
  )
}
