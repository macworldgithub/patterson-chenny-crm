'use client'

import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Search, User, Bot, Clock, Download, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusPill } from '@/components/ui/status-pill'
import { Badge } from '@/components/ui/badge'
import { fetchCallById } from '@/lib/calls-api'
import type { Call } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TranscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [call, setCall] = useState<Call | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCallById(id)
        setCall(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!call) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Call not found.
      </div>
    )
  }

  const filtered = (call.transcript || []).filter(seg =>
    seg.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Back */}
      <Link href="/calls" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit">
        <ChevronLeft className="w-4 h-4" /> Back to Calls
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Transcript */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-foreground">{call.customerName}</h1>
              <p className="text-sm text-muted-foreground">{call.campaignName}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill status={call.outcome} />
              <StatusPill status={call.sentiment} />
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transcript..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-sm border-border"
            />
          </div>

          {/* Transcript segments */}
          <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
            {filtered.map((seg, i) => {
              const isAgent = seg.speaker === 'agent'
              return (
                <motion.div
                  key={seg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn('flex gap-3', isAgent ? 'flex-row' : 'flex-row-reverse')}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-white text-xs font-bold',
                    isAgent ? 'bg-[#0C1E3C]' : 'bg-emerald-500'
                  )}>
                    {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div className={cn('flex flex-col max-w-[75%]', isAgent ? 'items-start' : 'items-end')}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-muted-foreground">{seg.speakerName}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />{formatTimestamp(seg.timestamp)}
                      </span>
                    </div>
                    <div className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                      isAgent
                        ? 'bg-[#0C1E3C]/8 dark:bg-cyan-500/10 text-foreground rounded-tl-sm'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 text-foreground rounded-tr-sm'
                    )}>
                      {search && seg.text.toLowerCase().includes(search.toLowerCase()) ? (
                        <span dangerouslySetInnerHTML={{
                          __html: seg.text.replace(
                            new RegExp(`(${search})`, 'gi'),
                            '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$1</mark>'
                          )
                        }} />
                      ) : seg.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusPill status={seg.sentiment} size="sm" />
                      <span className="text-[10px] text-muted-foreground">
                        {(seg.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right panel — AI extraction */}
        <div className="space-y-4">
          {/* AI Summary */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <h3 className="font-semibold text-sm text-foreground">AI Summary</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{call.aiSummary}</p>
          </div>

          {/* Key Extractions */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3">Key Extractions</h3>
            <div className="space-y-2.5">
              {call.keyExtractions?.bookingDate && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted-foreground">Booking Date</span>
                  <span className="text-xs font-semibold text-emerald-600">{call.keyExtractions.bookingDate}</span>
                </div>
              )}
              {call.keyExtractions?.bookingTime && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted-foreground">Booking Time</span>
                  <span className="text-xs font-semibold text-emerald-600">{call.keyExtractions.bookingTime}</span>
                </div>
              )}
              {call.keyExtractions?.vehicleInterest && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted-foreground">Vehicle Interest</span>
                  <span className="text-xs font-medium text-foreground text-right max-w-[150px]">{call.keyExtractions.vehicleInterest}</span>
                </div>
              )}
              {call.keyExtractions?.dealValue && call.keyExtractions.dealValue > 0 && (
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted-foreground">Deal Value</span>
                  <span className="text-xs font-semibold text-cyan-600">${call.keyExtractions.dealValue?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-xs text-muted-foreground">AI Confidence</span>
                <span className="text-xs font-semibold text-foreground">{(call.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Objections & Next Steps */}
          {call.keyExtractions?.objections && call.keyExtractions.objections.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Objections</h3>
              <ul className="space-y-1.5">
                {call.keyExtractions.objections.map((obj, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {call.keyExtractions?.nextSteps && call.keyExtractions.nextSteps.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Next Steps</h3>
              <ul className="space-y-1.5">
                {call.keyExtractions.nextSteps.map((step, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw JSON */}
          <details className="bg-card rounded-2xl border border-border p-4">
            <summary className="text-sm font-semibold text-foreground cursor-pointer">Structured JSON</summary>
            <pre className="mt-3 text-[10px] text-muted-foreground overflow-auto max-h-48 bg-muted rounded-xl p-3">
              {JSON.stringify(call.keyExtractions, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}
