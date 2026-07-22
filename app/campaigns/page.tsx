"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Download,
  MoreHorizontal,
  ChevronRight,
  Pause,
  X,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
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
import { apiClient } from "@/lib/api-client";
import type { Campaign, CampaignStatus, CampaignType } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  service_reminder: "Service Reminder",
  upgrade_offer: "Upgrade Offer",
  reengagement: "Re-engagement",
  finance_renewal: "Finance Renewal",
  parts_upsell: "Parts Upsell",
};

const STATUS_OPTIONS = ["all", "active", "paused", "completed", "scheduled", "draft"] as const;
const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "service_reminder", label: "Service Reminder" },
  { value: "upgrade_offer", label: "Upgrade Offer" },
  { value: "reengagement", label: "Re-engagement" },
  { value: "finance_renewal", label: "Finance Renewal" },
  { value: "parts_upsell", label: "Parts Upsell" },
];

// ─── API response shape ───────────────────────────────────────────────────────

interface APICampaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  brand: string;
  location: string;
  totalContacts: number;
  contactsAttempted: number;
  contactsReached: number;
  bookings: number;
  conversions: number;
  conversionRate: number;
  answerRate: number;
  startDate: string;
  endDate: string;
  scheduledTime: string;
  maxAttempts: number;
  attemptsCompleted: number;
  revenueImpact: number;
  aiAgentName: string;
  script: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CampaignsResponse {
  success: boolean;
  data: APICampaign[];
  count: number;
}

// Map API shape → Campaign type (replaces _id with id)
function mapCampaign(c: APICampaign): Campaign {
  return {
    id: c._id,
    name: c.name,
    type: c.type as CampaignType,
    status: c.status as CampaignStatus,
    brand: c.brand,
    location: c.location,
    totalContacts: c.totalContacts,
    contactsAttempted: c.contactsAttempted,
    contactsReached: c.contactsReached,
    bookings: c.bookings,
    conversions: c.conversions,
    conversionRate: c.conversionRate,
    answerRate: c.answerRate,
    startDate: c.startDate,
    endDate: c.endDate,
    scheduledTime: c.scheduledTime,
    maxAttempts: c.maxAttempts,
    attemptsCompleted: c.attemptsCompleted,
    revenueImpact: c.revenueImpact,
    aiAgentName: c.aiAgentName,
    script: c.script,
    tags: c.tags ?? [],
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

// ─── Filter state ─────────────────────────────────────────────────────────────

interface Filters {
  search: string;
  status: string;
  brand: string;
  location: string;
  type: string;
}

// ─── Select component ─────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 rounded-xl text-xs font-medium border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none cursor-pointer min-w-[130px]"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-muted-foreground">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Partial<Campaign>>({});
  const [formLoading, setFormLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    brand: "",
    location: "",
    type: "",
  });

  // Debounce search input
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchCampaigns = useCallback(async (f: Filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.search)   params.set("search",   f.search);
      if (f.status)   params.set("status",   f.status);
      if (f.brand)    params.set("brand",    f.brand);
      if (f.location) params.set("location", f.location);
      if (f.type)     params.set("type",     f.type);

      const qs = params.toString();
      const res = await apiClient<CampaignsResponse>(
        `api/campaigns${qs ? `?${qs}` : ""}`
      );

      if (res.success) {
        setCampaigns(res.data.map(mapCampaign));
        setTotal(res.count);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on filter change (debounce search)
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      fetchCampaigns(filters);
    }, filters.search ? 400 : 0);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [filters, fetchCampaigns]);

  // ─── Filter helpers ───────────────────────────────────────────────────────

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", brand: "", location: "", type: "" });
  };

  const hasActiveFilters =
    filters.search || filters.status || filters.brand || filters.location || filters.type;

  // ─── CSV Export ───────────────────────────────────────────────────────────

  const handleExport = () => {
    const headers = "id,name,type,status,brand,location,totalContacts,bookings,conversions,conversionRate,answerRate\n";
    const rows = campaigns
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.type}","${c.status}","${c.brand}","${c.location}",${c.totalContacts},${c.bookings},${c.conversions},${c.conversionRate},${c.answerRate}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Form save ────────────────────────────────────────────────────────────

  const handleSaveCampaign = async () => {
    setFormLoading(true);
    try {
      if (editingCampaign) {
        await apiClient(`api/campaigns/${editingCampaign.id}`, {
          method: "PATCH",
          body: formData,
        });
        toast.success("Campaign updated");
      } else {
        await apiClient("api/campaigns", {
          method: "POST",
          body: formData,
        });
        toast.success("Campaign created");
      }
      setIsFormOpen(false);
      setEditingCampaign(null);
      setFormData({});
      fetchCampaigns(filters);
    } catch (err: any) {
      toast.error(err.message || "Failed to save campaign");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditForm = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData(campaign);
    setIsFormOpen(true);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
            Campaigns
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Loading..." : `${total} campaigns · ${campaigns.filter((c) => c.status === "active").length} active`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 h-9"
            onClick={() => fetchCampaigns(filters)}
            disabled={loading}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 h-9 w-full sm:w-auto"
            onClick={() => {
              setEditingCampaign(null);
              setFormData({});
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* Search input */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns by name..."
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="pl-9 h-9 rounded-xl text-sm border-border pr-8"
            />
            {filters.search && (
              <button
                onClick={() => setFilter("search", "")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filter:</span>
            </div>

            {/* Status pills */}
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter("status", s === "all" ? "" : s)}
                className={cn(
                  "h-9 px-3 rounded-xl text-xs font-medium capitalize transition-colors whitespace-nowrap",
                  (s === "all" ? !filters.status : filters.status === s)
                    ? "bg-[#0C1E3C] text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* Type dropdown */}
            <FilterSelect
              label="All Types"
              value={filters.type}
              onChange={(v) => setFilter("type", v)}
              options={TYPE_OPTIONS.filter((o) => o.value)}
            />

            {/* Brand text filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Brand"
                value={filters.brand}
                onChange={(e) => setFilter("brand", e.target.value)}
                className="h-9 pl-3 pr-3 rounded-xl text-xs font-medium border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all w-28"
              />
            </div>

            {/* Location text filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilter("location", e.target.value)}
                className="h-9 pl-3 pr-3 rounded-xl text-xs font-medium border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all w-28"
              />
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 h-9"
              onClick={handleExport}
              disabled={campaigns.length === 0}
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <p className="text-sm text-muted-foreground">Fetching campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No campaigns found</p>
            <p className="text-xs text-muted-foreground">
              {hasActiveFilters ? "Try adjusting your filters." : "Create your first campaign to get started."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-cyan-600 hover:underline mt-1"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] md:min-w-0">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Campaign</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Progress</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Conversion</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">Revenue</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Schedule</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3 w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {campaigns.map((campaign, i) => {
                    const progress =
                      campaign.totalContacts > 0
                        ? (campaign.contactsAttempted / campaign.totalContacts) * 100
                        : 0;
                    return (
                      <motion.tr
                        key={campaign.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedCampaign(campaign)}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        {/* Campaign name */}
                        <td className="px-4 py-3.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate max-w-xs">
                              {campaign.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-1.5">
                              <span>{campaign.brand}</span>
                              <span className="opacity-40">·</span>
                              <span>{campaign.location}</span>
                              <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-[10px]">
                                {typeLabels[campaign.type] ?? campaign.type}
                              </span>
                            </p>
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
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 whitespace-nowrap">
                            {campaign.contactsAttempted.toLocaleString()} / {campaign.totalContacts.toLocaleString()}
                          </p>
                        </td>

                        {/* Conversion */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <p className="text-sm font-semibold text-foreground">{campaign.conversionRate}%</p>
                          <p className="text-[11px] text-muted-foreground">{campaign.conversions} converted</p>
                        </td>

                        {/* Revenue */}
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <p className="text-sm font-semibold text-foreground">
                            {campaign.revenueImpact > 0 ? `$${(campaign.revenueImpact / 1000).toFixed(0)}K` : "—"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{campaign.bookings} bookings</p>
                        </td>

                        {/* Schedule */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <p className="text-xs text-foreground">{campaign.scheduledTime}</p>
                          <p className="text-[11px] text-muted-foreground whitespace-nowrap">
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
                                <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditForm(campaign)}>
                                  Edit Campaign
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.info("Delete coming soon");
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-lg hidden sm:flex"
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
                </AnimatePresence>
              </tbody>
            </table>
            {campaigns.length > 0 && (
              <div className="md:hidden text-center py-2 text-[10px] text-muted-foreground border-t">
                Scroll horizontally to see more columns
              </div>
            )}
          </div>
        )}
      </div>

      {/* Campaign Details Drawer */}
      <Sheet open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <SheetContent className="w-full sm:w-[420px] sm:max-w-[420px] p-0 overflow-y-auto">
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
                  { label: "Total Contacts", value: selectedCampaign.totalContacts.toLocaleString() },
                  { label: "Contacted", value: selectedCampaign.contactsReached.toLocaleString() },
                  { label: "Bookings", value: selectedCampaign.bookings },
                  { label: "Conversions", value: selectedCampaign.conversions },
                  { label: "Answer Rate", value: `${selectedCampaign.answerRate}%` },
                  { label: "Conversion Rate", value: `${selectedCampaign.conversionRate}%` },
                  {
                    label: "Revenue Impact",
                    value:
                      selectedCampaign.revenueImpact > 0
                        ? `$${(selectedCampaign.revenueImpact / 1000).toFixed(0)}K`
                        : "—",
                  },
                  { label: "Max Attempts", value: selectedCampaign.maxAttempts },
                ].map((s) => (
                  <div key={s.label} className="bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="px-4 pb-4">
                <p className="text-xs font-medium text-foreground mb-2">Campaign Progress</p>
                <Progress
                  value={
                    selectedCampaign.totalContacts > 0
                      ? (selectedCampaign.contactsAttempted / selectedCampaign.totalContacts) * 100
                      : 0
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCampaign.contactsAttempted.toLocaleString()} of{" "}
                  {selectedCampaign.totalContacts.toLocaleString()} contacts attempted
                </p>
              </div>

              {/* Details */}
              <div className="px-4 pb-4 space-y-3">
                {[
                  { label: "AI Agent", value: selectedCampaign.aiAgentName },
                  { label: "Schedule", value: selectedCampaign.scheduledTime },
                  { label: "Start Date", value: selectedCampaign.startDate },
                  { label: "End Date", value: selectedCampaign.endDate },
                  { label: "Campaign Type", value: typeLabels[selectedCampaign.type] ?? selectedCampaign.type },
                  { label: "Tags", value: selectedCampaign.tags?.join(", ") || "—" },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between">
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                    <span className="text-xs font-medium text-foreground text-right max-w-[200px]">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 px-4 pb-6">
                <Button
                  className="flex-1 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm"
                  onClick={() => openEditForm(selectedCampaign)}
                >
                  Edit Campaign
                </Button>
                {selectedCampaign.status === "active" && (
                  <Button variant="outline" className="rounded-xl gap-2 text-sm">
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create / Edit Campaign Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:w-[420px] sm:max-w-[420px] p-0 overflow-y-auto">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>{editingCampaign ? "Edit Campaign" : "New Campaign"}</SheetTitle>
              <SheetDescription>
                {editingCampaign ? "Update the campaign details below." : "Create a new AI voice campaign."}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Campaign Name</label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Winter Service Drive"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Brand</label>
                <Input
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Toyota, Mercedes-Benz, etc."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Keysborough"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Campaign Type</label>
                <select
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.type || "service_reminder"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CampaignType })}
                >
                  <option value="service_reminder">Service Reminder</option>
                  <option value="upgrade_offer">Upgrade Offer</option>
                  <option value="finance_renewal">Finance Renewal</option>
                  <option value="reengagement">Re-engagement</option>
                  <option value="parts_upsell">Parts Upsell</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <select
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.status || "draft"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsFormOpen(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white gap-2"
                onClick={handleSaveCampaign}
                disabled={formLoading}
              >
                {formLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {editingCampaign ? "Save Changes" : "Create Campaign"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
