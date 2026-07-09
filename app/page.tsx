"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Calendar,
  Percent,
  UserPlus,
  Coins,
  PhoneCall,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneMissed,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { StatusPill } from "@/components/ui/status-pill";
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
} from "recharts";
import { mockDailyMetrics } from '@/lib/mock-data'

const kpiCards = [
  {
    title: "Today's Calls",
    value: 94,
    change: 12.4,
    changeType: "increase" as const,
    icon: Phone,
    color: "navy" as const,
    changePeriod: "vs yesterday",
  },
  {
    title: "Answer Rate",
    value: "70.2%",
    change: 2.1,
    changeType: "increase" as const,
    icon: PhoneCall,
    color: "cyan" as const,
    changePeriod: "vs last week",
  },
  {
    title: "Bookings Today",
    value: 14,
    change: 7.7,
    changeType: "increase" as const,
    icon: Calendar,
    color: "green" as const,
    changePeriod: "vs yesterday",
  },
  {
    title: "Conversion Rate",
    value: "16.7%",
    change: 1.2,
    changeType: "increase" as const,
    icon: Percent,
    color: "purple" as const,
    changePeriod: "vs last week",
  },
  {
    title: "Upgrade Leads",
    value: 28,
    change: 4.2,
    changeType: "increase" as const,
    icon: UserPlus,
    color: "amber" as const,
    changePeriod: "active pipeline",
  },
];

const pieData = [
  { name: "Booked", value: 134, color: "#10B981" },
  { name: "Callback", value: 89, color: "#8B5CF6" },
  { name: "Not Interested", value: 210, color: "#6B7280" },
  { name: "No Answer", value: 179, color: "#F59E0B" },
];

const aiInsights = [
  {
    title: "Peak Call Window Detected",
    body: "Answer rates are 23% higher between 10:00–11:30am on weekdays. Consider scheduling more calls in this window.",
    tag: "Optimisation",
    tagColor: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400",
  },
  {
    title: "Emma Chen — Upgrade Alert",
    body: "Customer Emma Chen (Mercedes C-Class) has a 5/5 upgrade score. Finance ends September 2026. Recommend immediate outreach.",
    tag: "Lead Alert",
    tagColor:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
  },
  {
    title: "Campaign Health Warning",
    body: "Isuzu D-Max Finance Renewal campaign has dropped below 50% answer rate. Review call scheduling and contact list quality.",
    tag: "Warning",
    tagColor: "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400",
  },
];

const recentActivity = [
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    text: "James Nguyen booked a service — HiLux SR5",
    time: "2 min ago",
  },
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    text: "Lisa Moran booked a service — RAV4 Hybrid",
    time: "28 min ago",
  },
  {
    icon: Phone,
    color: "text-blue-500",
    text: "Sarah Thompson — callback scheduled for 25 Jun",
    time: "45 min ago",
  },
  {
    icon: XCircle,
    color: "text-slate-400",
    text: "Michael Patel — not interested, follow up Aug",
    time: "1h ago",
  },
  {
    icon: PhoneMissed,
    color: "text-amber-500",
    text: "Emma Chen — no answer, retry attempt 2",
    time: "2h ago",
  },
  {
    icon: Sparkles,
    color: "text-cyan-500",
    text: "New campaign launched: HiLux Service Reminder Q2",
    time: "3h ago",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sunday 29 June 2026 · Good morning, Alex 👋
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              3 Active Campaigns
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => (
          <StatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main area chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-2xl p-4 lg:p-5 border border-border card-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Call Performance — June 2026
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Calls made, answered, and booked
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              {[
                { color: "#0C1E3C", label: "Calls" },
                { color: "#00B4D8", label: "Answered" },
                { color: "#10B981", label: "Booked" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={mockDailyMetrics}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0C1E3C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0C1E3C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBooked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#0C1E3C"
                strokeWidth={2}
                fill="url(#colorCalls)"
                name="Calls"
              />
              <Area
                type="monotone"
                dataKey="answered"
                stroke="#00B4D8"
                strokeWidth={2}
                fill="url(#colorAnswered)"
                name="Answered"
              />
              <Area
                type="monotone"
                dataKey="booked"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorBooked)"
                name="Booked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-card rounded-2xl p-5 border border-border card-shadow"
        >
          <h2 className="font-semibold text-sm text-foreground mb-1">
            Call Outcomes
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            This month distribution
          </p>
          <div className="flex justify-center">
            <PieChart width={180} height={180}>
              <Pie
                data={pieData}
                cx={90}
                cy={90}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, "Calls"]} />
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Campaigns */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-1 bg-card rounded-2xl border border-border card-shadow overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm text-foreground">Recent Campaigns</h2>
            <Link href="/campaigns" className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {mockCampaigns.slice(0, 4).map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{campaign.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{campaign.brand} · {campaign.location}</p>
                </div>
                <StatusPill status={campaign.status} />
              </Link>
            ))}
          </div>
        </motion.div> */}

        {/* Activity Feed */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="lg:col-span-1 bg-card rounded-2xl border border-border card-shadow overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm text-foreground">Recent Activity</h2>
            <Link href="/notifications" className="text-xs text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', item.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />{item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div> */}

        {/* AI Insights */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-1 bg-card rounded-2xl border border-border card-shadow overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <h2 className="font-semibold text-sm text-foreground">AI Insights</h2>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
              3 new
            </span>
          </div>
          <div className="divide-y divide-border">
            {aiInsights.map((insight, i) => (
              <div key={i} className="px-5 py-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', insight.tagColor)}>
                    {insight.tag}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground mb-1">{insight.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.body}</p>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </div>
  );
}
