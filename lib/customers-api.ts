import { apiFetch } from './api'
import type { Customer } from '@/types'

// Map MongoDB _id → id for frontend type compatibility
function normalise(c: any): Customer {
  return { ...c, id: c._id ?? c.id }
}

export interface GetCustomersParams {
  page?: number
  limit?: number
  search?: string
  brand?: string
  status?: string
}

export interface CustomersResponse {
  data: Customer[]
  total: number
  page: number
  totalPages: number
}

export async function fetchCustomers(params: GetCustomersParams = {}): Promise<CustomersResponse> {
  const query = new URLSearchParams()
  if (params.page)   query.set('page',   String(params.page))
  if (params.limit)  query.set('limit',  String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.brand && params.brand !== 'all') query.set('brand', params.brand)
  if (params.status && params.status !== 'all') query.set('status', params.status)
  const res = await apiFetch(`/customers?${query.toString()}`)
  return { ...res, data: res.data.map(normalise) }
}

export async function fetchCustomerById(id: string): Promise<Customer> {
  const res = await apiFetch(`/customers/${id}`)
  return normalise(res.data)
}

export async function createCustomer(payload: Partial<Customer>): Promise<Customer> {
  const res = await apiFetch('/customers', { method: 'POST', body: JSON.stringify(payload) })
  return normalise(res.data)
}

export async function updateCustomer(id: string, payload: Partial<Customer>): Promise<Customer> {
  const res = await apiFetch(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  return normalise(res.data)
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiFetch(`/customers/${id}`, { method: 'DELETE' })
}

export async function importCustomersCSV(file: File): Promise<{ message: string; data: Customer[] }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4030/api'}/customers/import`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) throw new Error('Import failed')
  const json = await res.json()
  return { ...json, data: json.data.map((c: any) => ({ ...c, id: c._id ?? c.id })) }
}

export async function exportCustomersCSV(): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4030/api'}/customers/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'customers.csv'
  a.click()
  URL.revokeObjectURL(url)
}