// ─── Campaign Types ────────────────────────────────────────────────────────────

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'scheduled' | 'draft' | 'failed'
export type CampaignType = 'service_reminder' | 'upgrade_offer' | 'reengagement' | 'finance_renewal' | 'parts_upsell'

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  brand: string
  location: string
  totalContacts: number
  contactsAttempted: number
  contactsReached: number
  bookings: number
  conversions: number
  conversionRate: number
  answerRate: number
  startDate: string
  endDate: string
  scheduledTime: string
  maxAttempts: number
  attemptsCompleted: number
  revenueImpact: number
  createdAt: string
  updatedAt: string
  aiAgentName: string
  script: string
  tags: string[]
}

// ─── Customer Types ────────────────────────────────────────────────────────────

export type CustomerStatus = 'active' | 'inactive' | 'prospect' | 'churned'
export type UpgradeScore = 1 | 2 | 3 | 4 | 5

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  variant: string
  color: string
  vin: string
  regPlate: string
  odometer: number
  purchaseDate: string
  lastServiceDate: string
  nextServiceDue: string
  financeEndDate?: string
  warrantyExpiry: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  mobilePhone: string
  address: string
  suburb: string
  state: string
  postcode: string
  status: CustomerStatus
  upgradeScore: UpgradeScore
  vehicle: Vehicle
  previousVehicles: Vehicle[]
  assignedDealership: string
  brand: string
  totalSpend: number
  lifetimeValue: number
  campaignHistory: string[]
  lastContactDate: string
  preferredContactTime: string
  notes: string
  createdAt: string
  doNotCall: boolean
  tags: string[]
}

// ─── Call Types ────────────────────────────────────────────────────────────────

export type CallOutcome = 'booked' | 'not_interested' | 'callback_requested' | 'no_answer' | 'voicemail' | 'wrong_number' | 'busy' | 'converted'
export type CallSentiment = 'positive' | 'neutral' | 'negative'
export type CallDirection = 'outbound' | 'inbound'

export interface TranscriptSegment {
  id: string
  speaker: 'agent' | 'customer'
  speakerName: string
  text: string
  timestamp: number
  sentiment: CallSentiment
  confidence: number
}

export interface CallRecording {
  url: string
  duration: number
  fileSize: number
}

export interface Call {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  campaignId: string
  campaignName: string
  direction: CallDirection
  outcome: CallOutcome
  sentiment: CallSentiment
  duration: number
  startTime: string
  endTime: string
  recording: CallRecording
  transcript: TranscriptSegment[]
  aiSummary: string
  keyExtractions: {
    bookingDate?: string
    bookingTime?: string
    vehicleInterest?: string
    objections?: string[]
    nextSteps?: string[]
    dealValue?: number
  }
  confidenceScore: number
  agentName: string
  dealershipLocation: string
  brand: string
  createdAt: string
}

// ─── Analytics Types ───────────────────────────────────────────────────────────

export interface DailyMetric {
  date: string
  calls: number
  answered: number
  booked: number
  converted: number
  revenue: number
  answerRate: number
  conversionRate: number
}

export interface LocationMetric {
  location: string
  calls: number
  conversions: number
  revenue: number
  answerRate: number
}

export interface BrandMetric {
  brand: string
  campaigns: number
  calls: number
  conversions: number
  revenue: number
  avgUpgradeScore: number
}

export interface FunnelStage {
  stage: string
  count: number
  percentage: number
}

// ─── User & Auth Types ─────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer' | 'finance'
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string
  dealership: string
  brand: string
  lastLogin: string
  createdAt: string
  permissions: Permission[]
  activityCount: number
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export'
export type PermissionResource = 'campaigns' | 'customers' | 'calls' | 'analytics' | 'users' | 'roles' | 'audit_logs' | 'settings' | 'integrations' | 'simulation'

export interface Permission {
  resource: PermissionResource
  actions: PermissionAction[]
}

export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissions: Permission[]
  isSystemRole: boolean
  createdAt: string
}

// ─── Audit Log Types ───────────────────────────────────────────────────────────

export type AuditAction = 'created' | 'updated' | 'deleted' | 'viewed' | 'exported' | 'login' | 'logout' | 'permission_changed' | 'campaign_started' | 'campaign_paused'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: AuditAction
  resource: string
  resourceId: string
  resourceName: string
  details: string
  ipAddress: string
  userAgent: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
}

// ─── Notification Types ────────────────────────────────────────────────────────

export type NotificationType = 'booking' | 'upgrade_alert' | 'campaign_complete' | 'error' | 'info' | 'warning' | 'failure'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  relatedId?: string
  metadata?: Record<string, unknown>
}

// ─── Integration Types ─────────────────────────────────────────────────────────

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending'

export interface Integration {
  id: string
  name: string
  description: string
  logo: string
  status: IntegrationStatus
  lastSync?: string
  config?: Record<string, unknown>
}

// ─── KPI / Dashboard Types ─────────────────────────────────────────────────────

export interface KPICard {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  changePeriod: string
  icon: string
  color: 'navy' | 'cyan' | 'green' | 'amber' | 'red' | 'purple'
  prefix?: string
  suffix?: string
}

// ─── Simulation Types ──────────────────────────────────────────────────────────

export type SimulationScenario = 'service_due' | 'upgrade_opportunity' | 'finance_renewal' | 'objection_handling' | 'callback_follow_up'

export interface SimulationMessage {
  id: string
  role: 'agent' | 'customer'
  content: string
  timestamp: Date
  sentiment?: CallSentiment
  audioUrl?: string
}

export interface MockCustomer {
  name: string
  vehicle: string
  suburb: string
  scenario: SimulationScenario
  lastService: string
  upgradeScore: number
}
