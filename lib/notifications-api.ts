import { apiFetch } from './api'
import type { Notification } from '@/types'

function normalise(n: any): Notification {
  return { ...n, id: n._id ?? n.id }
}

export interface NotificationsResponse {
  data: Notification[]
  unreadCount: number
}

export async function fetchNotifications(read?: boolean): Promise<NotificationsResponse> {
  const query = new URLSearchParams()
  if (read !== undefined) query.set('read', String(read))

  const res = await apiFetch(`/notifications?${query.toString()}`)
  return { ...res, data: res.data.map(normalise) }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' })
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiFetch('/notifications/mark-all-read', { method: 'PATCH' })
}
