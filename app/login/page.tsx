"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Zap,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

type Mode = "login" | "forgot" | "forgot-success";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, forgotPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Successfully logged in!");
    } catch (error: any) {
      toast.error(
        error.message || "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(forgotEmail);
      setMode("forgot-success");
    } catch (error: any) {
      // Show generic success even on 404 to avoid user enumeration
      setMode("forgot-success");
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#060D1A] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,#0d2b56,transparent)] opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-md px-6 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500 cyan-glow mb-3"
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            Welcome to Patterson Cheney
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

        {/* Animated Card */}
        <AnimatePresence mode="wait">
          {/* ── SIGN IN ── */}
          {mode === "login" && (
            <motion.div
              key="login"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-[#0F1A2E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 card-shadow"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Sign In</h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="name@dealership.com.au"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setMode("forgot");
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-11 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-600/50 text-white rounded-xl font-medium text-sm transition-all duration-150 shadow-[0_4px_20px_rgba(0,180,216,0.3)] hover:shadow-[0_4px_25px_rgba(0,180,216,0.5)] cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Continue <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                >
                  Signup
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === "forgot" && (
            <motion.div
              key="forgot"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-[#0F1A2E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 card-shadow"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 mb-5">
                <KeyRound className="w-5 h-5 text-cyan-400" />
              </div>

              <h2 className="text-lg font-semibold text-white mb-1">
                Reset Your Password
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Enter the email linked to your account and we'll send you a
                reset link.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="name@dealership.com.au"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-600/50 text-white rounded-xl font-medium text-sm transition-all duration-150 shadow-[0_4px_20px_rgba(0,180,216,0.3)] hover:shadow-[0_4px_25px_rgba(0,180,216,0.5)] cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setMode("login")}
                className="mt-5 flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </motion.div>
          )}

          {/* ── FORGOT SUCCESS ── */}
          {mode === "forgot-success" && (
            <motion.div
              key="forgot-success"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-[#0F1A2E]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 card-shadow text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto mb-5"
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </motion.div>

              <h2 className="text-lg font-semibold text-white mb-2">
                Check Your Inbox
              </h2>
              <p className="text-sm text-slate-400 mb-1">
                If{" "}
                <span className="text-cyan-400 font-medium">{forgotEmail}</span>{" "}
                is registered, a password reset link has been sent.
              </p>
              <p className="text-xs text-slate-500 mb-8">
                Didn't receive it? Check your spam folder or try again.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail("");
                    setMode("forgot");
                  }}
                  className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium text-sm transition-all cursor-pointer"
                >
                  Try a Different Email
                </button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
