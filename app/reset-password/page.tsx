'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import {
  Zap,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'

function getPasswordStrength(pwd: string): { label: string; color: string; width: string } {
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

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tokenInvalid, setTokenInvalid] = useState(false)

  const strength = getPasswordStrength(newPassword)

  useEffect(() => {
    if (!token || !email) {
      setTokenInvalid(true)
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!newPassword) errs.newPassword = 'New password is required'
    else if (newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await apiClient<{ success: boolean; message: string }>('/auth/reset-password', {
        method: 'POST',
        body: { token, email, newPassword },
        skipAuth: true,
      })
      setSuccess(true)
    } catch (err: any) {
      const msg = err.message || 'Failed to reset password'
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
        setTokenInvalid(true)
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#060D1A] overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#0d2b56,transparent)] opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-md px-6 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500 mb-3"
            style={{ boxShadow: '0 0 30px rgba(0,180,216,0.5)' }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            OmniSuiteAI
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-slate-400 mt-1"
          >
            Patterson Cheney Automotive Group
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── INVALID TOKEN ── */}
          {tokenInvalid && (
            <motion.div
              key="invalid"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-[#0F1A2E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-center"
              style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.4)' }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 mx-auto mb-5">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Link Expired or Invalid</h2>
              <p className="text-sm text-slate-400 mb-8">
                This password reset link is either expired (links are valid for 1 hour) or has already been used.
                Please request a new one.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium text-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </motion.div>
          )}

          {/* ── SUCCESS ── */}
          {!tokenInvalid && success && (
            <motion.div
              key="success"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-[#0F1A2E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-center"
              style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.4)' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto mb-5"
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </motion.div>
              <h2 className="text-lg font-semibold text-white mb-2">Password Reset!</h2>
              <p className="text-sm text-slate-400 mb-8">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium text-sm transition-all cursor-pointer"
                style={{ boxShadow: '0 4px 20px rgba(0,180,216,0.3)' }}
              >
                Sign In
              </button>
            </motion.div>
          )}

          {/* ── RESET FORM ── */}
          {!tokenInvalid && !success && (
            <motion.div
              key="form"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-[#0F1A2E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
              style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.4)' }}
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 mb-5">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>

              <h2 className="text-lg font-semibold text-white mb-1">Choose a New Password</h2>
              {email && (
                <p className="text-sm text-slate-400 mb-6">
                  Resetting for <span className="text-cyan-400 font-medium">{email}</span>
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reset-new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors(p => ({ ...p, newPassword: '' })) }}
                      className={`block w-full pl-10 pr-11 py-2.5 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.newPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-white/10 focus:border-cyan-500 focus:ring-cyan-500'
                      }`}
                      placeholder="Min. 8 characters"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.newPassword}
                    </p>
                  )}
                  {/* Strength meter */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${strength.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: strength.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Strength:{' '}
                        <span className={`font-semibold ${
                          strength.label === 'Weak' ? 'text-red-400' :
                          strength.label === 'Fair' ? 'text-amber-400' :
                          strength.label === 'Good' ? 'text-cyan-400' :
                          'text-emerald-400'
                        }`}>
                          {strength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })) }}
                      className={`block w-full pl-10 pr-11 py-2.5 bg-white/5 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : confirmPassword && confirmPassword === newPassword
                            ? 'border-emerald-500 focus:ring-emerald-500'
                            : 'border-white/10 focus:border-cyan-500 focus:ring-cyan-500'
                      }`}
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                    </p>
                  )}
                  {confirmPassword && confirmPassword === newPassword && !errors.confirmPassword && (
                    <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  id="reset-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-600/50 text-white rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
                  style={{ boxShadow: '0 4px 20px rgba(0,180,216,0.3)' }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Reset Password</>
                  )}
                </button>
              </form>

              <Link
                href="/login"
                className="mt-5 flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#060D1A]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
