'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft, Phone, Mail, MapPin, Car, Star, Clock,
  CalendarCheck, Mic, FileText, MessageSquare, User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusPill } from '@/components/ui/status-pill'
import { mockCustomers, mockCalls } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function UpgradeStars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={cn('w-4 h-4', i <= score ? 'text-amber-400 fill-amber-400' : 'text-muted/30')} />
      ))}
    </div>
  )
}

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const customer = mockCustomers.find(c => c.id === id) ?? mockCustomers[0]
  const customerCalls = mockCalls.filter(c => c.customerId === customer.id)

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Back */}
      <Link href="/customers" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ChevronLeft className="w-4 h-4" /> Back to Customers
      </Link>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border card-shadow overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0C1E3C] to-[#1A3A6B] p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {customer.firstName[0]}{customer.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{customer.fullName}</h1>
                <StatusPill status={customer.status} />
                {customer.doNotCall && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-medium">DNC</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="text-white/60 text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />{customer.email}
                </span>
                <span className="text-white/60 text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />{customer.mobilePhone}
                </span>
                <span className="text-white/60 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />{customer.suburb}, {customer.state}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <UpgradeStars score={customer.upgradeScore} />
                <span className="text-white/60 text-xs">Upgrade Score {customer.upgradeScore}/5</span>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-2 text-right shrink-0">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-white/60 text-xs">Lifetime Value</p>
                <p className="text-white text-xl font-bold">${(customer.lifetimeValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 divide-x divide-border border-t border-border">
          {[
            { label: 'Total Spend', value: `$${(customer.totalSpend / 1000).toFixed(1)}K` },
            { label: 'Last Contact', value: customer.lastContactDate },
            { label: 'Dealership', value: customer.assignedDealership.replace('Patterson Cheney ', '') },
            { label: 'Preferred Time', value: customer.preferredContactTime },
          ].map(s => (
            <div key={s.label} className="px-4 py-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — vehicle & details */}
        <div className="space-y-4">
          {/* Vehicle Card */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-4 h-4 text-cyan-500" />
              <h3 className="font-semibold text-sm text-foreground">Current Vehicle</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {customer.vehicle.year} {customer.vehicle.make} {customer.vehicle.model}
                  </p>
                  <p className="text-xs text-muted-foreground">{customer.vehicle.variant}</p>
                </div>
              </div>
              {[
                { label: 'Colour', value: customer.vehicle.color },
                { label: 'Reg Plate', value: customer.vehicle.regPlate },
                { label: 'Odometer', value: `${(customer.vehicle.odometer / 1000).toFixed(1)}k km` },
                { label: 'Purchase Date', value: customer.vehicle.purchaseDate },
                { label: 'Last Service', value: customer.vehicle.lastServiceDate },
                { label: 'Next Service', value: customer.vehicle.nextServiceDue },
                { label: 'Finance End', value: customer.vehicle.financeEndDate ?? 'N/A' },
                { label: 'Warranty', value: customer.vehicle.warrantyExpiry },
              ].map(d => (
                <div key={d.label} className="flex justify-between py-1 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground">{d.label}</span>
                  <span className="text-xs font-medium text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-5">
            <h3 className="font-semibold text-sm text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-[#0C1E3C]/8 dark:bg-cyan-500/10 text-[11px] font-medium text-[#0C1E3C] dark:text-cyan-400 capitalize">
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="calls" className="space-y-4">
            <TabsList className="h-10 rounded-xl bg-muted p-1">
              <TabsTrigger value="calls" className="rounded-lg text-xs">Call History</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-lg text-xs">Timeline</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-lg text-xs">Notes & AI Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="calls" className="space-y-3">
              {customerCalls.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-12 flex flex-col items-center gap-3">
                  <Phone className="w-10 h-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No calls recorded yet</p>
                </div>
              ) : (
                customerCalls.map((call) => (
                  <div key={call.id} className="bg-card rounded-2xl border border-border card-shadow p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StatusPill status={call.outcome} />
                          <StatusPill status={call.sentiment} />
                          <span className="text-xs text-muted-foreground">{new Date(call.startTime).toLocaleString('en-AU')}</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">{call.campaignName}</p>
                        <p className="text-xs text-muted-foreground mt-1">Duration: {call.duration}s · Agent: {call.agentName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {call.duration > 0 && (
                          <Link href={`/calls/${call.id}/transcript`}>
                            <Button variant="outline" size="sm" className="rounded-lg gap-1.5 text-xs h-8">
                              <FileText className="w-3 h-3" /> Transcript
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                    {call.aiSummary && (
                      <div className="mt-3 p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                        <p className="text-[11px] text-cyan-700 dark:text-cyan-300 leading-relaxed">{call.aiSummary}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="timeline">
              <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
                {[
                  { date: customer.lastContactDate, icon: Phone, text: 'Outbound call — ' + (customerCalls[0]?.outcome ?? 'N/A'), color: 'text-cyan-500' },
                  { date: customer.vehicle.lastServiceDate, icon: CalendarCheck, text: 'Vehicle service completed', color: 'text-emerald-500' },
                  { date: customer.vehicle.purchaseDate, icon: Car, text: `Purchased ${customer.vehicle.year} ${customer.vehicle.make} ${customer.vehicle.model}`, color: 'text-blue-500' },
                  { date: customer.createdAt.split('T')[0], icon: User, text: 'Customer record created', color: 'text-muted-foreground' },
                ].map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn('flex items-center justify-center w-8 h-8 rounded-xl bg-muted shrink-0', event.color)}>
                      <event.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-foreground">{event.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="space-y-3">
                {customerCalls[0]?.aiSummary && (
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-cyan-500" />
                      <h3 className="font-semibold text-sm text-foreground">Latest AI Summary</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{customerCalls[0].aiSummary}</p>
                  </div>
                )}
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-foreground" />
                    <h3 className="font-semibold text-sm text-foreground">Agent Notes</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{customer.notes}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
