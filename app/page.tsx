// "use client";

// import { motion } from "framer-motion";
// import {
//   Phone,
//   Calendar,
//   Percent,
//   UserPlus,
//   Users,
//   Layers,
//   Coins,
//   PhoneCall,
//   ChevronRight,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   PhoneMissed,
//   ArrowUpRight,
// } from "lucide-react";
// import { StatCard } from "@/components/ui/stat-card";
// import { StatusPill } from "@/components/ui/status-pill";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { fetchDashboardStats, fetchDailyMetrics } from '@/lib/analytics-api'
// import { fetchCallStats } from '@/lib/calls-api'
// import { fetchAuditLogs } from '@/lib/audit-api'
// import { fetchCampaigns } from '@/lib/campaigns-api'
// import { fetchCustomers } from '@/lib/customers-api'
// import { useEffect, useState } from 'react'
// import { cn } from '@/lib/utils'
// import { useAuth } from '@/contexts/AuthContext'

// interface TooltipPayload {
//   name: string;
//   value: string | number;
//   color: string;
// }

// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: TooltipPayload[];
//   label?: string | number;
// }

// const CustomTooltip = ({
//   active,
//   payload,
//   label,
// }: CustomTooltipProps) => {
//   if (!active || !payload?.length) {
//     return null;
//   }

//   return (
//     <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
//       <p className="font-semibold text-foreground mb-1">
//         {String(label)}
//       </p>

//       {payload.map((item: TooltipPayload, index: number) => (
//         <div
//           key={`${item.name}-${index}`}
//           className="flex items-center gap-2"
//         >
//           <span
//             className="w-2 h-2 rounded-full"
//             style={{ backgroundColor: item.color }}
//           />
//           <span className="text-muted-foreground">
//             {item.name}:
//           </span>
//           <span className="font-medium">
//             {item.value}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default function DashboardPage() {
//   const { user } = useAuth()
//   const [stats, setStats] = useState<any>(null);
//   const [callStats, setCallStats] = useState<any>(null);
//   const [dailyMetrics, setDailyMetrics] = useState<any[]>([]);
//   const [campaignCount, setCampaignCount] = useState<number | null>(null);
//   const [customerCount, setCustomerCount] = useState<number | null>(null);
//   const [auditLogs, setAuditLogs] = useState<any[]>([]);
//   const [showAllActivity, setShowAllActivity] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const userName = user?.firstName ? `${user.firstName}` : 'Welcome'
//   const greetingText = user?.firstName ? `Welcome, ${user.firstName}` : 'Welcome '
//   const isSuperAdmin = user?.role && 'super_admin'

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const requests = [
//           fetchDashboardStats(),
//           fetchCallStats(),
//           fetchDailyMetrics(30),
//           fetchCampaigns(),
//           fetchCustomers({ limit: 1 }),
//         ]

//         if (isSuperAdmin) {
//           requests.push(
//             fetchAuditLogs({ limit: 6 }).catch(err => {
//               console.warn('Could not fetch audit logs:', err.message);
//               return { data: [] };
//             })
//           )
//         }

//         const results = await Promise.all(requests)
//         const [statsData, callStatsData, dailyData, campaignsData, customersData, auditData] = results

//         setStats(statsData);
//         setCallStats(callStatsData);
//         setDailyMetrics(dailyData);
//         setCampaignCount(Array.isArray(campaignsData) ? campaignsData.length : 0);
//         setCustomerCount(customersData?.total ?? 0);
//         setAuditLogs(isSuperAdmin ? auditData.data : []);
//       } catch (err: any) {
//         console.error(err);
//         setError(err?.message || 'Failed to load dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [isSuperAdmin]);

//   if (error) {
//     return (
//       <div className="p-8 flex items-center justify-center min-h-[500px]">
//         <div className="text-destructive font-medium">{error}</div>
//       </div>
//     );
//   }

//   if (loading || !stats || !callStats) {
//     return (
//       <div className="p-8 flex items-center justify-center min-h-[500px]">
//         <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   const kpiCards = [
//     {
//       title: "Total Calls",
//       value: stats.totalCalls,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: Phone,
//       color: "navy" as const,
//       changePeriod: "total",
//     },
//     {
//       title: "Answer Rate",
//       value: `${stats.answerRate}%`,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: PhoneCall,
//       color: "teal" as const,
//       changePeriod: "overall",
//     },
//     {
//       title: "Bookings",
//       value: stats.bookedCalls,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: Calendar,
//       color: "green" as const,
//       changePeriod: "total",
//     },
//     {
//       title: "Conversion Rate",
//       value: `${stats.conversionRate}%`,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: Percent,
//       color: "purple" as const,
//       changePeriod: "overall",
//     },
//     {
//       title: "Active Campaigns",
//       value: stats.activeCampaigns,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: UserPlus,
//       color: "amber" as const,
//       changePeriod: "currently active",
//     },
//     {
//       title: "Total Campaigns",
//       value: campaignCount ?? 0,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: Layers,
//       color: "purple" as const,
//       changePeriod: "all campaigns",
//     },
//     {
//       title: "Total Customers",
//       value: customerCount ?? 0,
//       change: 0,
//       changeType: "neutral" as const,
//       icon: Users,
//       color: "amber" as const,
//       changePeriod: "all customers",
//     },
//   ];

//   const pieData = [
//     { name: "Booked", value: callStats.booked, color: "#10B981" },
//     { name: "No Answer", value: callStats.noAnswer, color: "#F59E0B" },
//     { name: "Voicemail", value: callStats.voicemail, color: "#8B5CF6" },
//     { name: "Other", value: Math.max(0, callStats.total - (callStats.booked + callStats.noAnswer + callStats.voicemail)), color: "#6B7280" },
//   ];

//   const recentActivity = auditLogs.map((log: any) => ({
//     icon: CheckCircle2,
//     color: "text-emerald-500",
//     text: `${log.userName} ${log.action} ${log.resourceName || log.resource}`,
//     time: new Date(log.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
//   }));

//   const activityPreview = showAllActivity ? recentActivity : recentActivity.slice(0, 4);

//   return (
//     <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
//       >
//         <div>
//           <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
//             Dashboard
//           </h1>
//           <p className="text-sm text-muted-foreground mt-0.5">
//             Sunday 29 June 2026 · {greetingText}
//           </p>
//         </div>
//         <div className="flex flex-wrap items-center gap-2">
//           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//             <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
//               {stats.activeCampaigns} Active Campaigns
//             </span>
//           </div>
//         </div>
//       </motion.div>

//       {/* KPI Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//         {kpiCards.map((card, i) => (
//           <StatCard key={card.title} {...card} index={i} />
//         ))}
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Main area chart */}
//         {/* <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.3 }}
//           className="lg:col-span-2 bg-card rounded-2xl p-4 lg:p-5 border border-border card-shadow"
//         >
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
//             <div>
//               <h2 className="font-semibold text-sm text-foreground">
//                 Call Performance — Last 30 Days
//               </h2>
//               <p className="text-xs text-muted-foreground mt-0.5">
//                 Calls made, answered, and booked
//               </p>
//             </div>
//             <div className="flex items-center gap-4 text-[11px]">
//               {[
//                 { color: "#0C1E3C", label: "Calls" },
//                 { color: "#00B4D8", label: "Answered" },
//                 { color: "#10B981", label: "Booked" },
//               ].map((l) => (
//                 <div key={l.label} className="flex items-center gap-1.5">
//                   <span
//                     className="w-2.5 h-2.5 rounded-full"
//                     style={{ backgroundColor: l.color }}
//                   />
//                   <span className="text-muted-foreground">{l.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={220}>
//             <AreaChart
//               data={dailyMetrics}
//               margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#0C1E3C" stopOpacity={0.15} />
//                   <stop offset="95%" stopColor="#0C1E3C" stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.15} />
//                   <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient id="colorBooked" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
//                   <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
//               <XAxis
//                 dataKey="date"
//                 tick={{ fontSize: 10, fill: "#9CA3AF" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 10, fill: "#9CA3AF" }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Area
//                 type="monotone"
//                 dataKey="calls"
//                 stroke="#0C1E3C"
//                 strokeWidth={2}
//                 fill="url(#colorCalls)"
//                 name="Calls"
//               />
//               <Area
//                 type="monotone"
//                 dataKey="answered"
//                 stroke="#00B4D8"
//                 strokeWidth={2}
//                 fill="url(#colorAnswered)"
//                 name="Answered"
//               />
//               <Area
//                 type="monotone"
//                 dataKey="booked"
//                 stroke="#10B981"
//                 strokeWidth={2}
//                 fill="url(#colorBooked)"
//                 name="Booked"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </motion.div> */}

//         {/* Pie chart */}
//         {/* <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.35 }}
//           className="bg-card rounded-2xl p-5 border border-border card-shadow"
//         >
//           <h2 className="font-semibold text-sm text-foreground mb-1">
//             Call Outcomes
//           </h2>
//           <p className="text-xs text-muted-foreground mb-4">
//             Total distribution
//           </p>
//           <div className="flex justify-center">
//             <PieChart width={180} height={180}>
//               <Pie
//                 data={pieData}
//                 cx={90}
//                 cy={90}
//                 innerRadius={55}
//                 outerRadius={80}
//                 paddingAngle={3}
//                 dataKey="value"
//                 strokeWidth={0}
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={(v) => [v, "Calls"]} />
//             </PieChart>
//           </div>
//           <div className="space-y-2 mt-2">
//             {pieData.map((item) => (
//               <div
//                 key={item.name}
//                 className="flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-2">
//                   <span
//                     className="w-2.5 h-2.5 rounded-full"
//                     style={{ backgroundColor: item.color }}
//                   />
//                   <span className="text-xs text-muted-foreground">
//                     {item.name}
//                   </span>
//                 </div>
//                 <span className="text-xs font-semibold text-foreground">
//                   {item.value}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </motion.div> */}
//       </div>

//       {/* Bottom Row */}
//       {/* {isSuperAdmin && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.45 }}
//             className="lg:col-span-1 bg-card rounded-2xl border border-border card-shadow overflow-hidden"
//           >
//             <div className="flex items-center justify-between px-5 py-4 border-b border-border">
//               <h2 className="font-semibold text-sm text-foreground">Recent Activity</h2>
//               {recentActivity.length > 4 && (
//                 <button
//                   type="button"
//                   onClick={() => setShowAllActivity((value) => !value)}
//                   className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1 hover:underline"
//                 >
//                   {showAllActivity ? 'Show less' : 'View all'}
//                   <ChevronRight className="w-3 h-3" />
//                 </button>
//               )}
//             </div>
//             <div className="divide-y divide-border">
//               {activityPreview.map((item: any, i: number) => {
//                 const Icon = item.icon
//                 return (
//                   <div key={i} className="flex items-start gap-3 px-5 py-3">
//                     <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', item.color)} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs text-foreground leading-snug">{item.text}</p>
//                       <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
//                         <Clock className="w-2.5 h-2.5" />{item.time}
//                       </p>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </motion.div>
//         </div>
//       )} */}
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Calendar,
  Percent,
  PhoneCall,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  PhoneMissed,
  Star,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Users,
  Mic,
  ChevronRight,
  Car,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  fetchDashboardStats,
  fetchDailyMetrics,
  fetchOutcomeDistribution,
  fetchScenarioBreakdown,
  fetchBrandBreakdown,
  fetchTopObjections,
  fetchRecentCalls,
  fetchUpgradeFunnel,
  type DashboardStats,
  type DailyMetric,
  type OutcomeMetric,
  type ScenarioMetric,
  type BrandMetric,
  type ObjectionItem,
  type RecentCall,
  type UpgradeFunnelItem,
} from "@/lib/dashboard-api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const OUTCOME_COLORS: Record<string, string> = {
  service_booked: "#10B981",
  test_drive_booked: "#06B6D4",
  callback_scheduled: "#F59E0B",
  transferred_to_human: "#8B5CF6",
  info_provided: "#3B82F6",
  declined: "#EF4444",
  no_answer: "#9CA3AF",
  message_taken: "#F97316",
  escalated: "#DC2626",
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "#10B981",
  neutral: "#F59E0B",
  negative: "#EF4444",
};

const BRAND_COLORS: Record<string, string> = {
  Toyota: "#EB0A1E",
  "Mercedes-Benz": "#333333",
  Isuzu: "#003087",
  Unknown: "#9CA3AF",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent: string;
  index: number;
}

function KpiCard({ title, value, subtitle, icon: Icon, accent, index }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-card rounded-2xl border border-border p-4 card-shadow flex flex-col gap-2"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground leading-none tracking-tight">{value}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  className,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("bg-card rounded-2xl border border-border card-shadow p-5", className)}
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  formatter?: (val: number, name: string) => string;
}

function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
      {label && <p className="font-semibold text-foreground mb-1.5">{label}</p>}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2 leading-relaxed">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-muted-foreground">{item.name}:</span>
          <span className="font-medium">{formatter ? formatter(item.value, item.name) : item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Sentiment Pill ───────────────────────────────────────────────────────────

function SentimentPill({ sentiment }: { sentiment: string }) {
  const map: Record<string, string> = {
    positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    negative: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    neutral: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  };
  return (
    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", map[sentiment] || map.neutral)}>
      {sentiment}
    </span>
  );
}

// ─── Outcome Pill ─────────────────────────────────────────────────────────────

function OutcomePill({ outcome }: { outcome: string }) {
  const positive = ["service_booked", "test_drive_booked"];
  const warning = ["callback_scheduled", "transferred_to_human", "message_taken"];
  const negative = ["declined", "no_answer", "escalated"];
  const cls = positive.includes(outcome)
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
    : negative.includes(outcome)
    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
    : warning.includes(outcome)
    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
    : "bg-muted text-muted-foreground";
  return (
    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap", cls)}>
      {humanize(outcome)}
    </span>
  );
}

// ─── Brand dot ────────────────────────────────────────────────────────────────

function BrandDot({ brand }: { brand: string | null }) {
  const color = BRAND_COLORS[brand || ""] || BRAND_COLORS.Unknown;
  return <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [daily, setDaily] = useState<DailyMetric[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeMetric[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioMetric[]>([]);
  const [brands, setBrands] = useState<BrandMetric[]>([]);
  const [objections, setObjections] = useState<ObjectionItem[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [upgradeFunnel, setUpgradeFunnel] = useState<UpgradeFunnelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        statsData,
        dailyData,
        outcomesData,
        scenariosData,
        brandsData,
        objectionsData,
        recentData,
        funnelData,
      ] = await Promise.all([
        fetchDashboardStats(),
        fetchDailyMetrics(30),
        fetchOutcomeDistribution(),
        fetchScenarioBreakdown(),
        fetchBrandBreakdown(),
        fetchTopObjections(),
        fetchRecentCalls(8),
        fetchUpgradeFunnel(),
      ]);
      setStats(statsData);
      setDaily(dailyData);
      setOutcomes(outcomesData);
      setScenarios(scenariosData);
      setBrands(brandsData);
      setObjections(objectionsData);
      setRecentCalls(recentData);
      setUpgradeFunnel(funnelData);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Sentiment distribution for pie
  const sentimentPieData =
    stats
      ? [
          { name: "Positive", value: stats.positiveSentiment, color: SENTIMENT_COLORS.positive },
          { name: "Neutral", value: stats.neutralSentiment, color: SENTIMENT_COLORS.neutral },
          { name: "Negative", value: stats.negativeSentiment, color: SENTIMENT_COLORS.negative },
        ].filter((d) => d.value > 0)
      : [];

  // Outcome pie data
  const outcomePieData = outcomes.map((o) => ({
    name: humanize(o.outcome),
    value: o.count,
    color: OUTCOME_COLORS[o.outcome] || "#9CA3AF",
  }));

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px] gap-4">
        <p className="text-destructive font-medium text-sm">{error}</p>
        <Button variant="outline" className="rounded-xl gap-2" onClick={load}>
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // ─── KPI cards config ────────────────────────────────────────────────────────

  const kpiCards = [
    {
      title: "Total Calls",
      value: stats.totalCalls,
      subtitle: "All simulation sessions",
      icon: Phone,
      accent: "bg-[#0C1E3C]/10 text-[#0C1E3C] dark:bg-[#00B4D8]/10 dark:text-[#00B4D8]",
    },
    {
      title: "Answer Rate",
      value: `${stats.answerRate}%`,
      subtitle: `${stats.answeredCalls} of ${stats.totalCalls} answered`,
      icon: PhoneCall,
      accent: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
    },
    {
      title: "Bookings",
      value: stats.bookedCalls,
      subtitle: `+ ${stats.totalBookings} in calendar`,
      icon: Calendar,
      accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      subtitle: "Booked / answered",
      icon: Percent,
      accent: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    },
    {
      title: "Avg Call Duration",
      value: fmtDuration(stats.avgDurationSeconds),
      subtitle: "Across all sessions",
      icon: Clock,
      accent: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Callbacks Scheduled",
      value: stats.callbackScheduled,
      subtitle: `${stats.callbackRate}% callback rate`,
      icon: PhoneMissed,
      accent: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    },
    {
      title: "Escalations",
      value: stats.escalations,
      subtitle: "Transferred to staff",
      icon: AlertTriangle,
      accent: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    },
    {
      title: "Upgrade Interest",
      value: stats.upgradeInterest,
      subtitle: "Medium + high propensity",
      icon: TrendingUp,
      accent: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Voice Agent Analytics · refreshed {lastRefresh.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {stats.totalCalls} calls logged
            </span>
          </div>
          <Button variant="outline" className="rounded-xl gap-2 h-9" onClick={load}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpiCards.map((card, i) => (
          <KpiCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* ── Row 1: Area chart + Outcome pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Area: Call Performance */}
        <SectionCard
          title="Call Performance — Last 30 Days"
          subtitle="Daily calls made, answered, and booked"
          className="lg:col-span-2"
          delay={0.2}
        >
          <div className="flex items-center gap-4 text-[11px] mb-4">
            {[
              { color: "#0C1E3C", label: "Calls" },
              { color: "#00B4D8", label: "Answered" },
              { color: "#10B981", label: "Booked" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0C1E3C" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0C1E3C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gAnswered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBooked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="calls" stroke="#0C1E3C" strokeWidth={2} fill="url(#gCalls)" name="Calls" />
              <Area type="monotone" dataKey="answered" stroke="#00B4D8" strokeWidth={2} fill="url(#gAnswered)" name="Answered" />
              <Area type="monotone" dataKey="booked" stroke="#10B981" strokeWidth={2} fill="url(#gBooked)" name="Booked" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Pie: Outcomes */}
        <SectionCard title="Call Outcomes" subtitle="Distribution of results" delay={0.25}>
          {outcomePieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <BarChart3 className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-xs">No data yet</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-2">
                <PieChart width={160} height={160}>
                  <Pie data={outcomePieData} cx={80} cy={80} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {outcomePieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Calls"]} />
                </PieChart>
              </div>
              <div className="space-y-1.5">
                {outcomePieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground ml-2">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* ── Row 2: Sentiment + Upgrade Funnel + Objections ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Sentiment breakdown */}
        <SectionCard title="Customer Sentiment" subtitle="Across all calls" delay={0.3}>
          {sentimentPieData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">No data yet</div>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                <PieChart width={140} height={140}>
                  <Pie data={sentimentPieData} cx={70} cy={70} innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {sentimentPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Calls"]} />
                </PieChart>
              </div>
              <div className="space-y-2">
                {sentimentPieData.map((item) => {
                  const total = sentimentPieData.reduce((s, d) => s + d.value, 0);
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SectionCard>

        {/* Upgrade Interest Funnel */}
        <SectionCard title="Upgrade Interest Funnel" subtitle="Customer propensity levels" delay={0.32}>
          {upgradeFunnel.every((d) => d.count === 0) ? (
            <div className="py-8 text-center text-muted-foreground text-xs">No data yet</div>
          ) : (
            <div className="space-y-3 pt-1">
              {upgradeFunnel.map((item) => {
                const total = Math.max(...upgradeFunnel.map((f) => f.count), 1);
                const pct = Math.round((item.count / total) * 100);
                const colors: Record<string, string> = {
                  none: "#9CA3AF",
                  low: "#F59E0B",
                  medium: "#3B82F6",
                  high: "#10B981",
                };
                return (
                  <div key={item.level} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium capitalize" style={{ color: colors[item.level] || "#9CA3AF" }}>
                        {item.level}
                      </span>
                      <span className="text-muted-foreground font-semibold">{item.count} calls</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: colors[item.level] || "#9CA3AF" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Top Objections */}
        <SectionCard title="Top Objections" subtitle="Most common customer pushback" delay={0.34}>
          {objections.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">No objections logged yet</div>
          ) : (
            <div className="space-y-2">
              {objections.slice(0, 7).map((item, i) => {
                const max = objections[0].count;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground truncate max-w-[70%] capitalize">{item.objection}</span>
                      <span className="text-muted-foreground font-semibold shrink-0 ml-2">{item.count}×</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[#0C1E3C] dark:bg-[#00B4D8] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Row 3: Scenario breakdown + Brand breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Scenario bar chart */}
        <SectionCard title="Performance by Scenario" subtitle="Calls, answered, and booked per scenario" delay={0.36}>
          {scenarios.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scenarios.map((s) => ({ ...s, scenario: humanize(s.scenario) }))} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="scenario" tick={{ fontSize: 9, fill: "#9CA3AF" }} angle={-30} textAnchor="end" axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="total" name="Total" fill="#0C1E3C" opacity={0.7} radius={[3, 3, 0, 0]} />
                <Bar dataKey="answered" name="Answered" fill="#00B4D8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="booked" name="Booked" fill="#10B981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        {/* Brand table */}
        <SectionCard title="Performance by Brand" subtitle="Toyota · Mercedes-Benz · Isuzu" delay={0.38}>
          {brands.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-xs">No brand data yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-3 font-medium text-muted-foreground">Brand</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Calls</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Answer %</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Conv %</th>
                    <th className="text-right py-2 pl-2 font-medium text-muted-foreground">Avg Dur</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((b, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <BrandDot brand={b.brand} />
                          <span className="font-medium truncate">{b.brand}</span>
                        </div>
                      </td>
                      <td className="text-right py-2.5 px-2 font-semibold">{b.total}</td>
                      <td className="text-right py-2.5 px-2">
                        <span className={b.answerRate >= 50 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>
                          {b.answerRate}%
                        </span>
                      </td>
                      <td className="text-right py-2.5 px-2">
                        <span className={b.conversionRate >= 30 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>
                          {b.conversionRate}%
                        </span>
                      </td>
                      <td className="text-right py-2.5 pl-2 text-muted-foreground">
                        {fmtDuration(b.avgDurationSeconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Row 4: Conversion Rate trend + Answer Rate trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Conversion Rate Trend" subtitle="Daily bookings / answered (%)" delay={0.4}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
              <Area type="monotone" dataKey="conversionRate" stroke="#8B5CF6" strokeWidth={2} fill="url(#gConv)" name="Conversion %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Answer Rate Trend" subtitle="Daily answered / total calls (%)" delay={0.42}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gAnswer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
              <Area type="monotone" dataKey="answerRate" stroke="#00B4D8" strokeWidth={2} fill="url(#gAnswer)" name="Answer %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ── Row 5: Recent Calls feed ── */}
      <SectionCard title="Recent Calls" subtitle="Latest simulation sessions" delay={0.44}>
        {recentCalls.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <Mic className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No calls recorded yet — run a simulation to see data here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Scenario</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Outcome</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Sentiment</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Duration</th>
                  <th className="text-right py-2 pl-2 font-medium text-muted-foreground">When</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call, i) => (
                  <tr key={call._id || i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <BrandDot brand={call.brand} />
                        <span className="font-medium truncate max-w-[100px]">{call.caller_name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-muted-foreground max-w-[120px]">
                      <span className="truncate block">{call.vehicle_interest || "—"}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md">{humanize(call.scenario)}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <OutcomePill outcome={call.outcome} />
                    </td>
                    <td className="py-2.5 px-2">
                      <SentimentPill sentiment={call.sentiment} />
                    </td>
                    <td className="py-2.5 px-2 text-right text-muted-foreground">{fmtDuration(call.duration_seconds)}</td>
                    <td className="py-2.5 pl-2 text-right text-muted-foreground whitespace-nowrap">{fmtDate(call.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

    </div>
  );
}
