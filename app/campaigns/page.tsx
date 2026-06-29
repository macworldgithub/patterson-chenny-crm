// 'use client'

// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   Plus, Search, Filter, Download, MoreHorizontal,
//   ChevronRight, Users, Phone, Calendar, TrendingUp,
//   Play, Pause, CheckCircle2, Clock, X, Trash2, Edit2
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { StatusPill } from '@/components/ui/status-pill'
// import { Badge } from '@/components/ui/badge'
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuTrigger, DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// import {
//   Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
// } from '@/components/ui/sheet'
// import { Progress } from '@/components/ui/progress'
// import { mockCampaigns } from '@/lib/mock-data'
// import type { Campaign } from '@/types'
// import { cn } from '@/lib/utils'

// const typeLabels: Record<string, string> = {
//   service_reminder: 'Service Reminder',
//   upgrade_offer: 'Upgrade Offer',
//   reengagement: 'Re-engagement',
//   finance_renewal: 'Finance Renewal',
//   parts_upsell: 'Parts Upsell',
// }

// export default function CampaignsPage() {
//   const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
//   const [search, setSearch] = useState('')
//   const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
//   const [statusFilter, setStatusFilter] = useState<string>('all')

//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
//   const [formData, setFormData] = useState<Partial<Campaign>>({})

//   const handleExport = () => {
//     const csvContent = "id,name,type,status,brand,location,totalContacts,bookings,conversions\n"
//       + campaigns.map(c => `"${c.id}","${c.name}","${c.type}","${c.status}","${c.brand}","${c.location}",${c.totalContacts},${c.bookings},${c.conversions}`).join("\n")
//     const blob = new Blob([csvContent], { type: 'text/csv' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = 'campaigns.csv'
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const handleDelete = (id: string) => {
//     setCampaigns(campaigns.filter(c => c.id !== id))
//     if (selectedCampaign?.id === id) setSelectedCampaign(null)
//   }

//   const handleSaveCampaign = () => {
//     if (editingCampaign) {
//       setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? { ...c, ...formData } as Campaign : c))
//     } else {
//       const newCampaign: Campaign = {
//         id: `camp-${Date.now()}`,
//         name: formData.name || 'New Campaign',
//         type: (formData.type as any) || 'service_reminder',
//         status: (formData.status as any) || 'draft',
//         brand: formData.brand || 'Toyota',
//         location: formData.location || 'HQ',
//         totalContacts: 0,
//         contactsAttempted: 0,
//         contactsReached: 0,
//         bookings: 0,
//         conversions: 0,
//         conversionRate: 0,
//         answerRate: 0,
//         startDate: formData.startDate || new Date().toISOString().split('T')[0],
//         endDate: formData.endDate || new Date().toISOString().split('T')[0],
//         scheduledTime: formData.scheduledTime || '09:00 AM - 05:00 PM',
//         maxAttempts: 3,
//         attemptsCompleted: 0,
//         revenueImpact: 0,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         aiAgentName: 'Aria',
//         script: '',
//         tags: [],
//       }
//       setCampaigns([newCampaign, ...campaigns])
//     }
//     setIsFormOpen(false)
//     setEditingCampaign(null)
//     setFormData({})
//   }

//   const openEditForm = (campaign: Campaign) => {
//     setEditingCampaign(campaign)
//     setFormData(campaign)
//     setIsFormOpen(true)
//   }

//   const filtered = campaigns.filter(c => {
//     const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
//       c.brand.toLowerCase().includes(search.toLowerCase())
//     const matchStatus = statusFilter === 'all' || c.status === statusFilter
//     return matchSearch && matchStatus
//   })

//   return (
//     <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground tracking-tight">Campaigns</h1>
//           <p className="text-sm text-muted-foreground mt-0.5">{campaigns.length} campaigns · {campaigns.filter(c => c.status === 'active').length} active</p>
//         </div>
//         <Button
//           className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 h-10"
//           onClick={() => { setEditingCampaign(null); setFormData({}); setIsFormOpen(true); }}
//         >
//           <Plus className="w-4 h-4" /> New Campaign
//         </Button>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center gap-3 flex-wrap">
//         <div className="relative flex-1 max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <Input
//             placeholder="Search campaigns..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="pl-9 h-9 rounded-xl text-sm border-border"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           {(['all', 'active', 'paused', 'completed', 'scheduled', 'draft'] as const).map(s => (
//             <button
//               key={s}
//               onClick={() => setStatusFilter(s)}
//               className={cn(
//                 'h-8 px-3 rounded-xl text-xs font-medium capitalize transition-colors',
//                 statusFilter === s
//                   ? 'bg-[#0C1E3C] text-white'
//                   : 'bg-muted text-muted-foreground hover:bg-muted/80'
//               )}
//             >
//               {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
//             </button>
//           ))}
//         </div>
//         <Button variant="outline" size="sm" className="ml-auto rounded-xl gap-2 h-9" onClick={handleExport}>
//           <Download className="w-3.5 h-3.5" /> Export CSV
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/30">
//                 <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Campaign</th>
//                 <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
//                 <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Progress</th>
//                 <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Conversion</th>
//                 <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">Revenue Impact</th>
//                 <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Schedule</th>
//                 <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {filtered.map((campaign, i) => {
//                 const progress = campaign.totalContacts > 0
//                   ? (campaign.contactsAttempted / campaign.totalContacts) * 100
//                   : 0

//                 return (
//                   <motion.tr
//                     key={campaign.id}
//                     initial={{ opacity: 0, y: 4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.05 }}
//                     onClick={() => setSelectedCampaign(campaign)}
//                     className="hover:bg-muted/30 cursor-pointer transition-colors"
//                   >
//                     {/* Campaign name */}
//                     <td className="px-4 py-3.5">
//                       <div className="flex items-center gap-3">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-foreground truncate max-w-[260px]">
//                             {campaign.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground mt-0.5">
//                             {campaign.brand} · {campaign.location}
//                             <span className="ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px]">
//                               {typeLabels[campaign.type]}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-4 py-3.5">
//                       <StatusPill status={campaign.status} />
//                     </td>

//                     {/* Progress */}
//                     <td className="px-4 py-3.5 hidden md:table-cell">
//                       <div className="flex items-center gap-2">
//                         <Progress value={progress} className="h-1.5 w-24" />
//                         <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
//                       </div>
//                       <p className="text-[11px] text-muted-foreground mt-1">
//                         {campaign.contactsAttempted.toLocaleString()} / {campaign.totalContacts.toLocaleString()}
//                       </p>
//                     </td>

//                     {/* Conversion */}
//                     <td className="px-4 py-3.5 hidden lg:table-cell">
//                       <div className="flex items-center gap-3">
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">{campaign.conversionRate}%</p>
//                           <p className="text-[11px] text-muted-foreground">{campaign.conversions} converted</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs font-medium text-foreground">{campaign.answerRate}%</p>
//                           <p className="text-[11px] text-muted-foreground">answer rate</p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Revenue */}
//                     <td className="px-4 py-3.5 hidden xl:table-cell">
//                       <p className="text-sm font-semibold text-foreground">
//                         {campaign.revenueImpact > 0
//                           ? `$${(campaign.revenueImpact / 1000).toFixed(0)}K`
//                           : '—'}
//                       </p>
//                       <p className="text-[11px] text-muted-foreground">{campaign.bookings} bookings</p>
//                     </td>

//                     {/* Schedule */}
//                     <td className="px-4 py-3.5 hidden lg:table-cell">
//                       <p className="text-xs text-foreground">{campaign.scheduledTime}</p>
//                       <p className="text-[11px] text-muted-foreground">
//                         {campaign.startDate} → {campaign.endDate}
//                       </p>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-4 py-3.5">
//                       <div className="flex items-center justify-end gap-1">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-7 w-7 p-0 rounded-lg"
//                               onClick={e => e.stopPropagation()}
//                             >
//                               <MoreHorizontal className="w-4 h-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent className="rounded-xl">
//                             <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>View Details</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => openEditForm(campaign)}>Edit Campaign</DropdownMenuItem>
//                             {campaign.status === 'active' ? (
//                               <DropdownMenuItem onClick={() => setCampaigns(campaigns.map(c => c.id === campaign.id ? { ...c, status: 'paused' } : c))}>Pause Campaign</DropdownMenuItem>
//                             ) : campaign.status === 'paused' ? (
//                               <DropdownMenuItem onClick={() => setCampaigns(campaigns.map(c => c.id === campaign.id ? { ...c, status: 'active' } : c))}>Resume Campaign</DropdownMenuItem>
//                             ) : null}
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(campaign.id)}>Delete</DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-7 px-2 rounded-lg text-xs"
//                           onClick={e => { e.stopPropagation(); setSelectedCampaign(campaign) }}
//                         >
//                           <ChevronRight className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Campaign Details Drawer */}
//       <Sheet open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
//         <SheetContent className="w-[420px] sm:max-w-[420px] p-0 overflow-y-auto">
//           {selectedCampaign && (
//             <>
//               {/* Header */}
//               <div className="bg-[#0C1E3C] p-6 text-white">
//                 <div className="flex items-start justify-between mb-4">
//                   <StatusPill status={selectedCampaign.status} />
//                   <button onClick={() => setSelectedCampaign(null)} className="text-white/60 hover:text-white">
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <h2 className="text-lg font-bold leading-snug mb-1">{selectedCampaign.name}</h2>
//                 <p className="text-white/60 text-sm">{selectedCampaign.brand} · {selectedCampaign.location}</p>
//               </div>

//               {/* Stats grid */}
//               <div className="grid grid-cols-2 gap-px bg-border m-4 rounded-2xl overflow-hidden">
//                 {[
//                   { label: 'Total Contacts', value: selectedCampaign.totalContacts.toLocaleString() },
//                   { label: 'Contacted', value: selectedCampaign.contactsReached.toLocaleString() },
//                   { label: 'Bookings', value: selectedCampaign.bookings },
//                   { label: 'Conversions', value: selectedCampaign.conversions },
//                   { label: 'Answer Rate', value: `${selectedCampaign.answerRate}%` },
//                   { label: 'Conversion Rate', value: `${selectedCampaign.conversionRate}%` },
//                   { label: 'Revenue Impact', value: selectedCampaign.revenueImpact > 0 ? `$${(selectedCampaign.revenueImpact / 1000).toFixed(0)}K` : '—' },
//                   { label: 'Max Attempts', value: selectedCampaign.maxAttempts },
//                 ].map(s => (
//                   <div key={s.label} className="bg-card p-3">
//                     <p className="text-[11px] text-muted-foreground">{s.label}</p>
//                     <p className="text-base font-bold text-foreground mt-0.5">{s.value}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Progress */}
//               <div className="px-4 pb-4">
//                 <p className="text-xs font-medium text-foreground mb-2">Campaign Progress</p>
//                 <Progress
//                   value={selectedCampaign.totalContacts > 0
//                     ? (selectedCampaign.contactsAttempted / selectedCampaign.totalContacts) * 100
//                     : 0}
//                   className="h-2"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {selectedCampaign.contactsAttempted.toLocaleString()} of {selectedCampaign.totalContacts.toLocaleString()} contacts attempted
//                 </p>
//               </div>

//               {/* Details */}
//               <div className="px-4 pb-4 space-y-3">
//                 {[
//                   { label: 'AI Agent', value: selectedCampaign.aiAgentName },
//                   { label: 'Schedule', value: selectedCampaign.scheduledTime },
//                   { label: 'Start Date', value: selectedCampaign.startDate },
//                   { label: 'End Date', value: selectedCampaign.endDate },
//                   { label: 'Campaign Type', value: typeLabels[selectedCampaign.type] },
//                   { label: 'Tags', value: selectedCampaign.tags.join(', ') },
//                 ].map(d => (
//                   <div key={d.label} className="flex justify-between">
//                     <span className="text-xs text-muted-foreground">{d.label}</span>
//                     <span className="text-xs font-medium text-foreground text-right max-w-[200px]">{d.value}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Actions */}
//               <div className="flex gap-2 px-4 pb-6">
//                 <Button className="flex-1 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm">
//                   View Full Details
//                 </Button>
//                 {selectedCampaign.status === 'active' && (
//                   <Button variant="outline" className="rounded-xl gap-2 text-sm">
//                     <Pause className="w-3.5 h-3.5" /> Pause
//                   </Button>
//                 )}
//               </div>
//             </>
//           )}
//         </SheetContent>
//       {/* Create/Edit Campaign Sheet */}
//       <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
//         <SheetContent className="w-[420px] sm:max-w-[420px] p-0 overflow-y-auto">
//           <div className="p-6">
//             <SheetHeader className="mb-6">
//               <SheetTitle>{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</SheetTitle>
//               <SheetDescription>
//                 {editingCampaign ? 'Update the campaign details below.' : 'Create a new AI voice campaign.'}
//               </SheetDescription>
//             </SheetHeader>

//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium mb-1 block">Campaign Name</label>
//                 <Input
//                   value={formData.name || ''}
//                   onChange={e => setFormData({ ...formData, name: e.target.value })}
//                   placeholder="e.g. Winter Service Drive"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-1 block">Brand</label>
//                 <select
//                   className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//                   value={formData.brand || 'Toyota'}
//                   onChange={e => setFormData({ ...formData, brand: e.target.value })}
//                 >
//                   <option value="Toyota">Toyota</option>
//                   <option value="Mercedes-Benz">Mercedes-Benz</option>
//                   <option value="Isuzu UTE">Isuzu UTE</option>
//                   <option value="Mahindra">Mahindra</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-1 block">Campaign Type</label>
//                 <select
//                   className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//                   value={formData.type || 'service_reminder'}
//                   onChange={e => setFormData({ ...formData, type: e.target.value as any })}
//                 >
//                   <option value="service_reminder">Service Reminder</option>
//                   <option value="upgrade_offer">Upgrade Offer</option>
//                   <option value="finance_renewal">Finance Renewal</option>
//                   <option value="reengagement">Re-engagement</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-1 block">Status</label>
//                 <select
//                   className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//                   value={formData.status || 'draft'}
//                   onChange={e => setFormData({ ...formData, status: e.target.value as any })}
//                 >
//                   <option value="draft">Draft</option>
//                   <option value="active">Active</option>
//                   <option value="paused">Paused</option>
//                   <option value="scheduled">Scheduled</option>
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">Start Date</label>
//                   <Input
//                     type="date"
//                     value={formData.startDate || ''}
//                     onChange={e => setFormData({ ...formData, startDate: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-1 block">End Date</label>
//                   <Input
//                     type="date"
//                     value={formData.endDate || ''}
//                     onChange={e => setFormData({ ...formData, endDate: e.target.value })}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex gap-3">
//               <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
//                 Cancel
//               </Button>
//               <Button className="flex-1 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white" onClick={handleSaveCampaign}>
//                 {editingCampaign ? 'Save Changes' : 'Create Campaign'}
//               </Button>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronRight,
  Users,
  Phone,
  Calendar,
  TrendingUp,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  X,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { mockCampaigns } from "@/lib/mock-data";
import type { Campaign } from "@/types";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  service_reminder: "Service Reminder",
  upgrade_offer: "Upgrade Offer",
  reengagement: "Re-engagement",
  finance_renewal: "Finance Renewal",
  parts_upsell: "Parts Upsell",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Partial<Campaign>>({});

  const handleExport = () => {
    const csvContent =
      "id,name,type,status,brand,location,totalContacts,bookings,conversions\n" +
      campaigns
        .map(
          (c) =>
            `"${c.id}","${c.name}","${c.type}","${c.status}","${c.brand}","${c.location}",${c.totalContacts},${c.bookings},${c.conversions}`,
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    if (selectedCampaign?.id === id) setSelectedCampaign(null);
  };

  const handleSaveCampaign = () => {
    if (editingCampaign) {
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingCampaign.id ? ({ ...c, ...formData } as Campaign) : c,
        ),
      );
    } else {
      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        name: formData.name || "New Campaign",
        type: (formData.type as any) || "service_reminder",
        status: (formData.status as any) || "draft",
        brand: formData.brand || "Toyota",
        location: formData.location || "HQ",
        totalContacts: 0,
        contactsAttempted: 0,
        contactsReached: 0,
        bookings: 0,
        conversions: 0,
        conversionRate: 0,
        answerRate: 0,
        startDate: formData.startDate || new Date().toISOString().split("T")[0],
        endDate: formData.endDate || new Date().toISOString().split("T")[0],
        scheduledTime: formData.scheduledTime || "09:00 AM - 05:00 PM",
        maxAttempts: 3,
        attemptsCompleted: 0,
        revenueImpact: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiAgentName: "Aria",
        script: "",
        tags: [],
      };
      setCampaigns([newCampaign, ...campaigns]);
    }
    setIsFormOpen(false);
    setEditingCampaign(null);
    setFormData({});
  };

  const openEditForm = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData(campaign);
    setIsFormOpen(true);
  };

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Campaigns
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {campaigns.length} campaigns ·{" "}
            {campaigns.filter((c) => c.status === "active").length} active
          </p>
        </div>
        <Button
          className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 h-10"
          onClick={() => {
            setEditingCampaign(null);
            setFormData({});
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Button>
      </div>
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-sm border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          {(
            [
              "all",
              "active",
              "paused",
              "completed",
              "scheduled",
              "draft",
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "h-8 px-3 rounded-xl text-xs font-medium capitalize transition-colors",
                statusFilter === s
                  ? "bg-[#0C1E3C] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto rounded-xl gap-2 h-9"
          onClick={handleExport}
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>
      {/* Table */}
      <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">
                  Campaign
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">
                  Progress
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">
                  Conversion
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">
                  Revenue Impact
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">
                  Schedule
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((campaign, i) => {
                const progress =
                  campaign.totalContacts > 0
                    ? (campaign.contactsAttempted / campaign.totalContacts) *
                      100
                    : 0;

                return (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCampaign(campaign)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    {/* Campaign name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate max-w-[260px]">
                            {campaign.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {campaign.brand} · {campaign.location}
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px]">
                              {typeLabels[campaign.type]}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusPill status={campaign.status} />
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 w-24" />
                        <span className="text-xs text-muted-foreground">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {campaign.contactsAttempted.toLocaleString()} /{" "}
                        {campaign.totalContacts.toLocaleString()}
                      </p>
                    </td>

                    {/* Conversion */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {campaign.conversionRate}%
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {campaign.conversions} converted
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-foreground">
                            {campaign.answerRate}%
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            answer rate
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-3.5 hidden xl:table-cell">
                      <p className="text-sm font-semibold text-foreground">
                        {campaign.revenueImpact > 0
                          ? `$${(campaign.revenueImpact / 1000).toFixed(0)}K`
                          : "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {campaign.bookings} bookings
                      </p>
                    </td>

                    {/* Schedule */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-foreground">
                        {campaign.scheduledTime}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {campaign.startDate} → {campaign.endDate}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-xl">
                            <DropdownMenuItem
                              onClick={() => setSelectedCampaign(campaign)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditForm(campaign)}
                            >
                              Edit Campaign
                            </DropdownMenuItem>
                            {campaign.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setCampaigns(
                                    campaigns.map((c) =>
                                      c.id === campaign.id
                                        ? { ...c, status: "paused" }
                                        : c,
                                    ),
                                  )
                                }
                              >
                                Pause Campaign
                              </DropdownMenuItem>
                            ) : campaign.status === "paused" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  setCampaigns(
                                    campaigns.map((c) =>
                                      c.id === campaign.id
                                        ? { ...c, status: "active" }
                                        : c,
                                    ),
                                  )
                                }
                              >
                                Resume Campaign
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(campaign.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 rounded-lg text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCampaign(campaign);
                          }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Campaign Details Drawer */}
      <Sheet
        open={!!selectedCampaign}
        onOpenChange={() => setSelectedCampaign(null)}
      >
        <SheetContent className="w-[420px] sm:max-w-[420px] p-0 overflow-y-auto">
          {selectedCampaign && (
            <>
              {/* Header */}
              <div className="bg-[#0C1E3C] p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <StatusPill status={selectedCampaign.status} />
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-lg font-bold leading-snug mb-1">
                  {selectedCampaign.name}
                </h2>
                <p className="text-white/60 text-sm">
                  {selectedCampaign.brand} · {selectedCampaign.location}
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-px bg-border m-4 rounded-2xl overflow-hidden">
                {[
                  {
                    label: "Total Contacts",
                    value: selectedCampaign.totalContacts.toLocaleString(),
                  },
                  {
                    label: "Contacted",
                    value: selectedCampaign.contactsReached.toLocaleString(),
                  },
                  { label: "Bookings", value: selectedCampaign.bookings },
                  { label: "Conversions", value: selectedCampaign.conversions },
                  {
                    label: "Answer Rate",
                    value: `${selectedCampaign.answerRate}%`,
                  },
                  {
                    label: "Conversion Rate",
                    value: `${selectedCampaign.conversionRate}%`,
                  },
                  {
                    label: "Revenue Impact",
                    value:
                      selectedCampaign.revenueImpact > 0
                        ? `$${(selectedCampaign.revenueImpact / 1000).toFixed(0)}K`
                        : "—",
                  },
                  {
                    label: "Max Attempts",
                    value: selectedCampaign.maxAttempts,
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="text-base font-bold text-foreground mt-0.5">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="px-4 pb-4">
                <p className="text-xs font-medium text-foreground mb-2">
                  Campaign Progress
                </p>
                <Progress
                  value={
                    selectedCampaign.totalContacts > 0
                      ? (selectedCampaign.contactsAttempted /
                          selectedCampaign.totalContacts) *
                        100
                      : 0
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCampaign.contactsAttempted.toLocaleString()} of{" "}
                  {selectedCampaign.totalContacts.toLocaleString()} contacts
                  attempted
                </p>
              </div>

              {/* Details */}
              <div className="px-4 pb-4 space-y-3">
                {[
                  { label: "AI Agent", value: selectedCampaign.aiAgentName },
                  { label: "Schedule", value: selectedCampaign.scheduledTime },
                  { label: "Start Date", value: selectedCampaign.startDate },
                  { label: "End Date", value: selectedCampaign.endDate },
                  {
                    label: "Campaign Type",
                    value: typeLabels[selectedCampaign.type],
                  },
                  { label: "Tags", value: selectedCampaign.tags.join(", ") },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      {d.label}
                    </span>
                    <span className="text-xs font-medium text-foreground text-right max-w-[200px]">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 px-4 pb-6">
                <Button className="flex-1 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm">
                  View Full Details
                </Button>
                {selectedCampaign.status === "active" && (
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2 text-sm"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>{" "}
      {/* ← was missing; Edit Sheet was incorrectly nested inside here */}
      {/* Create/Edit Campaign Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-[420px] sm:max-w-[420px] p-0 overflow-y-auto">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>
                {editingCampaign ? "Edit Campaign" : "New Campaign"}
              </SheetTitle>
              <SheetDescription>
                {editingCampaign
                  ? "Update the campaign details below."
                  : "Create a new AI voice campaign."}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Campaign Name
                </label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Winter Service Drive"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Brand</label>
                <select
                  className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.brand || "Toyota"}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                >
                  <option value="Toyota">Toyota</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Isuzu UTE">Isuzu UTE</option>
                  <option value="Mahindra">Mahindra</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Campaign Type
                </label>
                <select
                  className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type || "service_reminder"}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                >
                  <option value="service_reminder">Service Reminder</option>
                  <option value="upgrade_offer">Upgrade Offer</option>
                  <option value="finance_renewal">Finance Renewal</option>
                  <option value="reengagement">Re-engagement</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select
                  className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status || "draft"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white"
                onClick={handleSaveCampaign}
              >
                {editingCampaign ? "Save Changes" : "Create Campaign"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
