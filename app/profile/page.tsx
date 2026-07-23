'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  User,
  Lock,
  Mail,
  Building2,
  Car,
  Save,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Tab = 'profile' | 'security'

interface FieldError {
  [key: string]: string
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth()
  const router = useRouter()

  // ── Tab ──
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  // ── Profile form state ──
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dealership, setDealership] = useState('')
  const [brand, setBrand] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileErrors, setProfileErrors] = useState<FieldError>({})

  // ── Security form state ──
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [securityLoading, setSecurityLoading] = useState(false)
  const [securityErrors, setSecurityErrors] = useState<FieldError>({})

  // Seed form from context user
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setDealership(user.dealership || '')
      setBrand(user.brand || '')
    }
  }, [user])

  // ── Password strength ──
  const getPasswordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: '', color: '', width: '0%' }
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' }
    if (score === 2) return { label: 'Fair', color: 'bg-amber-400', width: '50%' }
    if (score === 3) return { label: 'Good', color: 'bg-cyan-400', width: '75%' }
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' }
  }

  const strength = getPasswordStrength(newPassword)

  // ── Profile submit ──
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: FieldError = {}
    if (!firstName.trim()) errors.firstName = 'First name is required'
    if (!lastName.trim()) errors.lastName = 'Last name is required'
    if (Object.keys(errors).length) { setProfileErrors(errors); return }
    setProfileErrors({})
    setProfileLoading(true)
    try {
      await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), dealership: dealership.trim(), brand: brand.trim() } as any)
      toast.success('Profile updated successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Security submit ──
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: FieldError = {}
    if (!currentPassword) errors.currentPassword = 'Current password is required'
    if (!newPassword) errors.newPassword = 'New password is required'
    else if (newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters'
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your new password'
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (Object.keys(errors).length) { setSecurityErrors(errors); return }
    setSecurityErrors({})
    setSecurityLoading(true)
    try {
      await changePassword(currentPassword, newPassword)
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password')
      if (err.message?.toLowerCase().includes('current')) {
        setSecurityErrors({ currentPassword: 'Current password is incorrect' })
      }
    } finally {
      setSecurityLoading(false)
    }
  }

  const tabVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
  }

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Page header */}
        <div className="flex items-center gap-4 mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user ? `${user.firstName} ${user.lastName}` : 'Profile'}
            </h1>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role?.replace('_', ' ')} · {user?.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
          {(['profile', 'security'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-background shadow-sm rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab === 'profile' ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {tab === 'profile' ? 'Profile' : 'Security'}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleProfileSave}>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-1">Personal Information</h2>
                    <p className="text-xs text-muted-foreground">Update your name and dealership details.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="profile-first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => { setFirstName(e.target.value); setProfileErrors(p => ({ ...p, firstName: '' })) }}
                          className={`block w-full pl-9 pr-4 py-2.5 bg-background border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                            profileErrors.firstName
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          placeholder="John"
                        />
                      </div>
                      {profileErrors.firstName && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {profileErrors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="profile-last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => { setLastName(e.target.value); setProfileErrors(p => ({ ...p, lastName: '' })) }}
                          className={`block w-full pl-9 pr-4 py-2.5 bg-background border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                            profileErrors.lastName
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          placeholder="Smith"
                        />
                      </div>
                      {profileErrors.lastName && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {profileErrors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Email Address <span className="normal-case text-muted-foreground/60 font-normal ml-1">(cannot be changed)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          className="block w-full pl-9 pr-4 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Dealership */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Dealership
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          id="profile-dealership"
                          type="text"
                          value={dealership}
                          onChange={(e) => setDealership(e.target.value)}
                          className="block w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Patterson Cheney Head Office"
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Brand
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Car className="w-4 h-4" />
                        </div>
                        <input
                          id="profile-brand"
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="block w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Toyota"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end mt-4">
                  <button
                    id="profile-save"
                    type="submit"
                    disabled={profileLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                  >
                    {profileLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handlePasswordChange}>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-1">Change Password</h2>
                    <p className="text-xs text-muted-foreground">
                      Use a strong password with at least 8 characters, mixing letters, numbers and symbols.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="security-current-password"
                          type={showCurrent ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => { setCurrentPassword(e.target.value); setSecurityErrors(p => ({ ...p, currentPassword: '' })) }}
                          className={`block w-full pl-9 pr-11 py-2.5 bg-background border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                            securityErrors.currentPassword
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {securityErrors.currentPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {securityErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="security-new-password"
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); setSecurityErrors(p => ({ ...p, newPassword: '' })) }}
                          className={`block w-full pl-9 pr-11 py-2.5 bg-background border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                            securityErrors.newPassword
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          placeholder="Min. 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {securityErrors.newPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {securityErrors.newPassword}
                        </p>
                      )}
                      {/* Strength meter */}
                      {newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${strength.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: strength.width }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Password strength:{' '}
                            <span className={`font-semibold ${
                              strength.label === 'Weak' ? 'text-red-500' :
                              strength.label === 'Fair' ? 'text-amber-400' :
                              strength.label === 'Good' ? 'text-cyan-400' :
                              'text-emerald-500'
                            }`}>
                              {strength.label}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="security-confirm-password"
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setSecurityErrors(p => ({ ...p, confirmPassword: '' })) }}
                          className={`block w-full pl-9 pr-11 py-2.5 bg-background border rounded-xl text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 transition-all ${
                            securityErrors.confirmPassword
                              ? 'border-red-500 focus:ring-red-500'
                              : confirmPassword && confirmPassword === newPassword
                                ? 'border-emerald-500 focus:ring-emerald-500'
                                : 'border-border focus:border-primary focus:ring-primary'
                          }`}
                          placeholder="Re-enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {securityErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {securityErrors.confirmPassword}
                        </p>
                      )}
                      {confirmPassword && confirmPassword === newPassword && !securityErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Passwords match
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Security tip */}
                  <div className="flex gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Never share your password. After changing it, you'll remain logged in on this device.
                    </p>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end mt-4">
                  <button
                    id="security-save"
                    type="submit"
                    disabled={securityLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                  >
                    {securityLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
