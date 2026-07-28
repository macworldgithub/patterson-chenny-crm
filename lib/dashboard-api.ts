/**
 * dashboard-api.ts
 * Typed client for all /api/dashboard/* endpoints added to server.js.
 * Drop this in src/lib/ (or wherever your other *-api files live).
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "https://patterson-voice.omnisuiteai.com";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Dashboard API ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalCalls: number;
  answeredCalls: number;
  answerRate: number;
  bookedCalls: number;
  conversionRate: number;
  escalations: number;
  positiveSentiment: number;
  negativeSentiment: number;
  neutralSentiment: number;
  avgDurationSeconds: number;
  totalBookings: number;
  callbackScheduled: number;
  callbackRate: number;
  upgradeInterest: number;
  activeCampaigns: number;
}

export interface DailyMetric {
  date: string;
  calls: number;
  answered: number;
  booked: number;
  declined: number;
  noAnswer: number;
  avgDuration: number;
  answerRate: number;
  conversionRate: number;
}

export interface OutcomeMetric {
  outcome: string;
  count: number;
}

export interface ScenarioMetric {
  scenario: string;
  total: number;
  booked: number;
  answered: number;
  conversionRate: number;
  positiveSentimentRate: number;
}

export interface BrandMetric {
  brand: string;
  total: number;
  booked: number;
  answered: number;
  conversionRate: number;
  answerRate: number;
  positiveSentimentRate: number;
  avgDurationSeconds: number;
}

export interface SentimentData {
  distribution: Array<{ sentiment: string; count: number }>;
}

export interface ObjectionItem {
  objection: string;
  count: number;
}

export interface RecentCall {
  _id: string;
  caller_name: string | null;
  vehicle_interest: string | null;
  outcome: string;
  sentiment: string;
  scenario: string | null;
  brand: string | null;
  duration_seconds: number | null;
  ai_summary: string | null;
  createdAt: string;
  booking?: {
    date: string | null;
    time: string | null;
    type: string | null;
    booking_ref: string | null;
  };
}

export interface UpgradeFunnelItem {
  level: string;
  count: number;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const fetchDashboardStats = () =>
  fetchJson<DashboardStats>("/api/dashboard/stats");

export const fetchDailyMetrics = (days = 30) =>
  fetchJson<DailyMetric[]>(`/api/dashboard/daily?days=${days}`);

export const fetchOutcomeDistribution = () =>
  fetchJson<OutcomeMetric[]>("/api/dashboard/outcomes");

export const fetchScenarioBreakdown = () =>
  fetchJson<ScenarioMetric[]>("/api/dashboard/scenarios");

export const fetchBrandBreakdown = () =>
  fetchJson<BrandMetric[]>("/api/dashboard/brands");

export const fetchSentimentData = () =>
  fetchJson<SentimentData>("/api/dashboard/sentiments");

export const fetchTopObjections = () =>
  fetchJson<ObjectionItem[]>("/api/dashboard/objections");

export const fetchRecentCalls = (limit = 8) =>
  fetchJson<RecentCall[]>(`/api/dashboard/recent-calls?limit=${limit}`);

export const fetchUpgradeFunnel = () =>
  fetchJson<UpgradeFunnelItem[]>("/api/dashboard/upgrade-funnel");