import { apiFetch } from './api'
import type { Integration } from '@/types'

function normalise(i: any): Integration {
  return { ...i, id: i._id ?? i.id }
}

export async function fetchIntegrations(): Promise<Integration[]> {
  const res = await apiFetch('/integrations')
  return res.data.map(normalise)
}

export async function updateIntegration(id: string, payload: Partial<Integration>): Promise<Integration> {
  const res = await apiFetch(`/integrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
  return normalise(res.data)
}
