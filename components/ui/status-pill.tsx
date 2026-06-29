'use client'

import { cn } from '@/lib/utils'

type StatusVariant =
  | 'active' | 'paused' | 'completed' | 'scheduled' | 'draft' | 'failed'
  | 'booked' | 'not_interested' | 'callback_requested' | 'no_answer' | 'voicemail'
  | 'converted' | 'busy' | 'wrong_number'
  | 'positive' | 'neutral' | 'negative'
  | 'connected' | 'disconnected' | 'error' | 'pending'
  | 'online' | 'inactive' | 'suspended'

interface StatusPillProps {
  status: StatusVariant | string
  size?: 'sm' | 'md'
  dot?: boolean
}

const statusConfig: Record<string, { label: string; classes: string; dot?: string }> = {
  // Campaign statuses
  active: { label: 'Active', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
  paused: { label: 'Paused', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', dot: 'bg-amber-500' },
  completed: { label: 'Completed', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', dot: 'bg-blue-500' },
  scheduled: { label: 'Scheduled', classes: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400', dot: 'bg-purple-500' },
  draft: { label: 'Draft', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
  failed: { label: 'Failed', classes: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400', dot: 'bg-red-500' },

  // Call outcomes
  booked: { label: 'Booked', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
  converted: { label: 'Converted', classes: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400', dot: 'bg-cyan-500' },
  not_interested: { label: 'Not Interested', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
  callback_requested: { label: 'Callback', classes: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400', dot: 'bg-purple-500' },
  no_answer: { label: 'No Answer', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', dot: 'bg-amber-500' },
  voicemail: { label: 'Voicemail', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', dot: 'bg-blue-500' },
  busy: { label: 'Busy', classes: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400', dot: 'bg-orange-500' },
  wrong_number: { label: 'Wrong Number', classes: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400', dot: 'bg-red-500' },

  // Sentiment
  positive: { label: 'Positive', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
  neutral: { label: 'Neutral', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
  negative: { label: 'Negative', classes: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400', dot: 'bg-red-500' },

  // Integration statuses
  connected: { label: 'Connected', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
  disconnected: { label: 'Disconnected', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
  error: { label: 'Error', classes: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400', dot: 'bg-red-500' },
  pending: { label: 'Pending', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', dot: 'bg-amber-500' },

  // User statuses
  online: { label: 'Active', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
  suspended: { label: 'Suspended', classes: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400', dot: 'bg-red-500' },
}

export function StatusPill({ status, size = 'sm', dot = true }: StatusPillProps) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, ' '),
    classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium capitalize',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        config.classes
      )}
    >
      {dot && (
        <span className={cn('rounded-full shrink-0', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', config.dot)} />
      )}
      {config.label}
    </span>
  )
}
