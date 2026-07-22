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
import { fetchDashboardStats, fetchDailyMetrics } from '@/lib/analytics-api'
import { fetchCallStats } from '@/lib/calls-api'
import { fetchAuditLogs } from '@/lib/audit-api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface TooltipPayload {
  name: string;
  value: string | number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">
        {String(label)}
      </p>

      {payload.map((item: TooltipPayload, index: number) => (
        <div
          key={`${item.name}-${index}`}
          className="flex items-center gap-2"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">
            {item.name}:
          </span>
          <span className="font-medium">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null);
  const [callStats, setCallStats] = useState<any>(null);
  const [dailyMetrics, setDailyMetrics] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userName = user?.firstName ? `${user.firstName}` : 'Good Morning'
  const greetingText = user?.firstName ? `Good morning, ${user.firstName}` : 'Good Morning'

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, callStatsData, dailyData, auditData] = await Promise.all([
          fetchDashboardStats(),
          fetchCallStats(),
          fetchDailyMetrics(30),
          fetchAuditLogs({ limit: 6 })
        ]);
        setStats(statsData);
        setCallStats(callStatsData);
        setDailyMetrics(dailyData);
        setAuditLogs(auditData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats || !callStats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Calls",
      value: stats.totalCalls,
      change: 0,
      changeType: "neutral" as const,
      icon: Phone,
      color: "navy" as const,
      changePeriod: "total",
    },
    {
      title: "Answer Rate",
      value: `${stats.answerRate}%`,
      change: 0,
      changeType: "neutral" as const,
      icon: PhoneCall,
      color: "cyan" as const,
      changePeriod: "overall",
    },
    {
      title: "Bookings",
      value: stats.bookedCalls,
      change: 0,
      changeType: "neutral" as const,
      icon: Calendar,
      color: "green" as const,
      changePeriod: "total",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: 0,
      changeType: "neutral" as const,
      icon: Percent,
      color: "purple" as const,
      changePeriod: "overall",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      change: 0,
      changeType: "neutral" as const,
      icon: UserPlus,
      color: "amber" as const,
      changePeriod: "currently active",
    },
  ];

  const pieData = [
    { name: "Booked", value: callStats.booked, color: "#10B981" },
    { name: "No Answer", value: callStats.noAnswer, color: "#F59E0B" },
    { name: "Voicemail", value: callStats.voicemail, color: "#8B5CF6" },
    { name: "Other", value: Math.max(0, callStats.total - (callStats.booked + callStats.noAnswer + callStats.voicemail)), color: "#6B7280" },
  ];

  const recentActivity = auditLogs.map((log: any) => ({
    icon: CheckCircle2,
    color: "text-emerald-500",
    text: `${log.userName} ${log.action} ${log.resourceName || log.resource}`,
    time: new Date(log.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
  }));

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
            Sunday 29 June 2026 · {greetingText} 👋
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {stats.activeCampaigns} Active Campaigns
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                Call Performance — Last 30 Days
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
              data={dailyMetrics}
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
            Total distribution
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity Feed */}
        <motion.div
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
            {recentActivity.map((item: any, i: number) => {
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
        </motion.div>
      </div>
    </div>
  );
}
