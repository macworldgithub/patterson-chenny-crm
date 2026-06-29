'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Download, Filter, ChevronRight, ChevronLeft,
  Star, Phone, Car, CalendarClock, MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusPill } from '@/components/ui/status-pill'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockCustomers } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import Link from 'next/link'

function UpgradeStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'w-3 h-3',
            i <= score ? 'text-amber-400 fill-amber-400' : 'text-muted/40'
          )}
        />
      ))}
    </div>
  )
}

const PAGE_SIZE = 10

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [brandFilter, setBrandFilter] = useState('all')

  const brands = ['all', 'Toyota', 'Mercedes-Benz', 'Isuzu UTE', 'Mahindra']

  const filtered = mockCustomers.filter(c => {
    const matchSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
      c.suburb.toLowerCase().includes(search.toLowerCase())
    const matchBrand = brandFilter === 'all' || c.brand === brandFilter
    return matchSearch && matchBrand
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{mockCustomers.length} customers in database</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 h-10">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers, vehicles..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 h-9 rounded-xl text-sm border-border"
          />
        </div>
        <div className="flex gap-2">
          {brands.map(b => (
            <button
              key={b}
              onClick={() => { setBrandFilter(b); setPage(1) }}
              className={cn(
                'h-8 px-3 rounded-xl text-xs font-medium transition-colors',
                brandFilter === b
                  ? 'bg-[#0C1E3C] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {b === 'all' ? 'All Brands' : b}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Vehicle</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Service Due</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Upgrade Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">LTV</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Customer */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.fullName}</p>
                        <p className="text-[11px] text-muted-foreground">{customer.mobilePhone} · {customer.suburb}</p>
                      </div>
                    </div>
                  </td>

                  {/* Vehicle */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {customer.vehicle.year} {customer.vehicle.make} {customer.vehicle.model}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{customer.vehicle.variant}</p>
                      </div>
                    </div>
                  </td>

                  {/* Service Due */}
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-3.5 h-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{customer.vehicle.nextServiceDue}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {(customer.vehicle.odometer / 1000).toFixed(1)}k km
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Upgrade Score */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <UpgradeStars score={customer.upgradeScore} />
                    <p className="text-[11px] text-muted-foreground mt-0.5">{customer.upgradeScore}/5</p>
                  </td>

                  {/* LTV */}
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    <p className="text-sm font-semibold text-foreground">
                      ${(customer.lifetimeValue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[11px] text-muted-foreground">lifetime value</p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusPill status={customer.status} />
                    {customer.doNotCall && (
                      <span className="ml-1 text-[10px] text-red-500 font-medium">DNC</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Call History</DropdownMenuItem>
                          <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Add Note</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} customers
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-lg"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'h-7 w-7 rounded-lg text-xs font-medium transition-colors',
                  page === p ? 'bg-[#0C1E3C] text-white' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                {p}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-lg"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
