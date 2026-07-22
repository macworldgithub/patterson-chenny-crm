import { apiFetch } from './api'
import type { Campaign } from '@/types'

function normalise(c: any): Campaign {
  return { ...c, id: c._id ?? c.id }
}

export interface GetCampaignsParams {
  status?: string
  brand?: string
  type?: string
  search?: string
}

export async function fetchCampaigns(params: GetCampaignsParams = {}): Promise<Campaign[]> {
  const query = new URLSearchParams()
  if (params.status && params.status !== 'all') query.set('status', params.status)
  if (params.brand && params.brand !== 'all') query.set('brand', params.brand)
  if (params.type && params.type !== 'all') query.set('type', params.type)
  if (params.search) query.set('search', params.search)
  
  const res = await apiFetch(`/campaigns?${query.toString()}`)
  return res.data.map(normalise)
}

export async function fetchCampaignById(id: string): Promise<Campaign> {
  const res = await apiFetch(`/campaigns/${id}`)
  return normalise(res.data)
}

export async function createCampaign(payload: Partial<Campaign>): Promise<Campaign> {
  const res = await apiFetch('/campaigns', { method: 'POST', body: JSON.stringify(payload) })
  return normalise(res.data)
}

export async function updateCampaign(id: string, payload: Partial<Campaign>): Promise<Campaign> {
  const res = await apiFetch(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  return normalise(res.data)
}

export async function updateCampaignStatus(id: string, status: string): Promise<Campaign> {
  const res = await apiFetch(`/campaigns/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return normalise(res.data)
}

export async function deleteCampaign(id: string): Promise<void> {
  await apiFetch(`/campaigns/${id}`, { method: 'DELETE' })
}
