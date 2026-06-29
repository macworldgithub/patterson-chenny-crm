import type { Campaign, Customer } from '@/types'
import { mockCampaigns, mockCustomers } from './mock-data'

const CAMPAIGNS_KEY = 'patterson-crm-campaigns'
const CUSTOMERS_KEY = 'patterson-crm-customers'

// Initialize localStorage with mock data if empty
export function initializeStorage() {
  if (typeof window === 'undefined') return
  
  if (!localStorage.getItem(CAMPAIGNS_KEY)) {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(mockCampaigns))
  }
  
  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(mockCustomers))
  }
}

// Campaigns storage
export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return mockCampaigns
  const data = localStorage.getItem(CAMPAIGNS_KEY)
  return data ? JSON.parse(data) : mockCampaigns
}

export function setCampaigns(campaigns: Campaign[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns))
}

export function updateCampaign(id: string, updates: Partial<Campaign>): void {
  const campaigns = getCampaigns()
  const updated = campaigns.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
  setCampaigns(updated)
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns()
  const filtered = campaigns.filter(c => c.id !== id)
  setCampaigns(filtered)
}

// Customers storage
export function getCustomers(): Customer[] {
  if (typeof window === 'undefined') return mockCustomers
  const data = localStorage.getItem(CUSTOMERS_KEY)
  return data ? JSON.parse(data) : mockCustomers
}

export function setCustomers(customers: Customer[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
}

export function updateCustomer(id: string, updates: Partial<Customer>): void {
  const customers = getCustomers()
  const updated = customers.map(c => c.id === id ? { ...c, ...updates } : c)
  setCustomers(updated)
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers()
  const filtered = customers.filter(c => c.id !== id)
  setCustomers(filtered)
}
