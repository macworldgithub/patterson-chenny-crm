import { apiFetch } from './api'
import type { Campaign } from '@/types'

function normalise(c: any): Campaign {
  return { ...c, id: c._id ?? c.id }
}

export interface GetCampaignsParams {
  status?: string
  brand?: string
  location?: string
  type?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CampaignsResponse {
  data: Campaign[]
  pagination: PaginationMeta
}

export async function fetchCampaigns(params: GetCampaignsParams = {}): Promise<CampaignsResponse> {
  const query = new URLSearchParams()
  if (params.status && params.status !== 'all') query.set('status', params.status)
  if (params.brand && params.brand !== 'all') query.set('brand', params.brand)
  if (params.location && params.location !== 'all') query.set('location', params.location)
  if (params.type && params.type !== 'all') query.set('type', params.type)
  if (params.search) query.set('search', params.search)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const res = await apiFetch(`/campaigns?${query.toString()}`)

  // The API returns: { success, data: [...], count, page, limit, total, totalPages }
  // Pagination fields are at the ROOT of the response, not inside a nested object.
  const items: Campaign[] = (Array.isArray(res.data) ? res.data : []).map(normalise)

  const pagination: PaginationMeta = {
    total:      res.total      ?? items.length,
    page:       res.page       ?? params.page ?? 1,
    limit:      res.limit      ?? params.limit ?? 10,
    totalPages: res.totalPages ?? 1,
  }

  return { data: items, pagination }
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
