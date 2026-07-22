import { apiFetch } from './api'
import type { DailyMetric, LocationMetric, BrandMetric, FunnelStage } from '@/types'

export async function fetchDashboardStats(): Promise<any> {
  const res = await apiFetch('/analytics/dashboard')
  return res.data
}

export async function fetchDailyMetrics(days: number = 30): Promise<DailyMetric[]> {
  const res = await apiFetch(`/analytics/daily?days=${days}`)
  return res.data
}

export async function fetchLocationMetrics(): Promise<LocationMetric[]> {
  const res = await apiFetch('/analytics/by-location')
  return res.data
}

export async function fetchBrandMetrics(): Promise<BrandMetric[]> {
  const res = await apiFetch('/analytics/by-brand')
  return res.data
}

export async function fetchFunnelData(): Promise<FunnelStage[]> {
  const res = await apiFetch('/analytics/funnel')
  return res.data
}
