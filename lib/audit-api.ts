import { apiFetch } from './api'
import type { AuditLog } from '@/types'

function normalise(log: any): AuditLog {
  return { ...log, id: log._id ?? log.id }
}

export interface GetAuditLogsParams {
  page?: number
  limit?: number
  action?: string
  severity?: string
  userId?: string
  resource?: string
}

export interface AuditLogsResponse {
  data: AuditLog[]
  total: number
  page: number
  totalPages: number
}

export async function fetchAuditLogs(params: GetAuditLogsParams = {}): Promise<AuditLogsResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.action) query.set('action', params.action)
  if (params.severity) query.set('severity', params.severity)
  if (params.userId) query.set('userId', params.userId)
  if (params.resource) query.set('resource', params.resource)

  const res = await apiFetch(`/audit-logs?${query.toString()}`)
  return { ...res, data: res.data.map(normalise) }
}
