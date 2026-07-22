'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, Download, Phone, Clock, ChevronRight,
  PhoneCall, PhoneMissed, Voicemail, Mic, MoreHorizontal, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusPill } from '@/components/ui/status-pill'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchCalls, fetchCallStats } from '@/lib/calls-api'
import type { Call } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function formatDuration(seconds: number): string {
  if (seconds === 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function ConfidenceBar({ score }: { score: number }) {
  if (score === 0) return <span className="text-xs text-muted-foreground">—</span>
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            score >= 0.9 ? 'bg-emerald-500' : score >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${score * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{(score * 100).toFixed(0)}%</span>
    </div>
  )
}

export default function CallsPage() {
  const [search, setSearch] = useState('')
  const [outcomeFilter, setOutcomeFilter] = useState('all')
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>({ total: 0, booked: 0, noAnswer: 0, avgDuration: 0 })

  const outcomes = ['all', 'booked', 'callback_requested', 'not_interested', 'no_answer', 'voicemail']

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [callsRes, statsRes] = await Promise.all([
          fetchCalls({ search, outcome: outcomeFilter }),
          fetchCallStats()
        ])
        setCalls(callsRes.data)
        setStats(statsRes)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    const timer = setTimeout(load, 300)
    return () => clearTimeout(timer)
  }, [search, outcomeFilter])

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Calls</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{stats.total} calls recorded</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 h-10">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Calls', value: stats.total, color: 'text-foreground' },
          { label: 'Booked', value: stats.booked, color: 'text-emerald-600' },
          { label: 'No Answer', value: stats.noAnswer, color: 'text-amber-600' },
          { label: 'Avg Duration', value: formatDuration(stats.avgDuration), color: 'text-cyan-600' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-4 card-shadow">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-1', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-sm border-border"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {outcomes.map(o => (
            <button
              key={o}
              onClick={() => setOutcomeFilter(o)}
              className={cn(
                'h-8 px-3 rounded-xl text-xs font-medium capitalize transition-colors',
                outcomeFilter === o
                  ? 'bg-[#0C1E3C] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {o === 'all' ? 'All Outcomes' : o.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Customer</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Outcome</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Duration</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Sentiment</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">AI Confidence</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Campaign</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Date</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading calls...
                  </div>
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No calls found
                </td>
              </tr>
            ) : calls.map((call, i) => (
              <motion.tr
                key={call.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {call.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{call.customerName}</p>
                      <p className="text-[11px] text-muted-foreground">{call.customerPhone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <StatusPill status={call.outcome} />
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{formatDuration(call.duration)}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <StatusPill status={call.sentiment} />
                </td>
                <td className="px-4 py-3.5 hidden xl:table-cell">
                  <ConfidenceBar score={call.confidenceScore} />
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <p className="text-xs text-foreground truncate max-w-[180px]">{call.campaignName}</p>
                  <p className="text-[11px] text-muted-foreground">{call.brand} · {call.dealershipLocation}</p>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <p className="text-xs text-foreground">{new Date(call.startTime).toLocaleDateString('en-AU')}</p>
                  <p className="text-[11px] text-muted-foreground">{new Date(call.startTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {call.duration > 0 && (
                      <Link href={`/calls/${call.id}/transcript`}>
                        <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg text-[11px] gap-1">
                          Transcript
                        </Button>
                      </Link>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
