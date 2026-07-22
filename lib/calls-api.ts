import { apiFetch } from './api'
import type { Call } from '@/types'

function normalise(c: any): Call {
  return { ...c, id: c._id ?? c.id }
}

export interface GetCallsParams {
  page?: number
  limit?: number
  search?: string
  outcome?: string
  brand?: string
  campaignId?: string
  customerId?: string
}

export interface CallsResponse {
  data: Call[]
  total: number
  page: number
  totalPages: number
}

export async function fetchCalls(params: GetCallsParams = {}): Promise<CallsResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.outcome && params.outcome !== 'all') query.set('outcome', params.outcome)
  if (params.brand && params.brand !== 'all') query.set('brand', params.brand)
  if (params.campaignId) query.set('campaignId', params.campaignId)
  if (params.customerId) query.set('customerId', params.customerId)

  const res = await apiFetch(`/calls?${query.toString()}`)
  return { ...res, data: res.data.map(normalise) }
}

export async function fetchCallById(id: string): Promise<Call> {
  const res = await apiFetch(`/calls/${id}`)
  return normalise(res.data)
}

export async function fetchCallStats(): Promise<any> {
  const res = await apiFetch('/calls/stats')
  return res.data
}
