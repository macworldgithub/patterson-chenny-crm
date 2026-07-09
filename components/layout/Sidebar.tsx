"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  section?: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone, section: "main" },
  { href: "/customers", label: "Customers", icon: Users, section: "main" },
  // { href: '/calls', label: 'Calls', icon: Phone, section: 'main' },
  {
    href: "/simulation",
    label: "Simulation Mode",
    icon: FlaskConical,
    section: "main",
  },
  // {
  //   href: "/integrations",
  //   label: "Integrations",
  //   icon: Plug,
  //   section: "admin",
  // },
  // { href: "/users", label: "Users", icon: UserCog, section: "admin" },
  // {
  //   href: "/roles",
  //   label: "Roles & Permissions",
  //   icon: ShieldCheck,
  //   section: "admin",
  // },
  // {
  //   href: "/audit-logs",
  //   label: "Audit Logs",
  //   icon: ScrollText,
  //   section: "admin",
  // },
  // { href: "/settings", label: "Settings", icon: Settings, section: "admin" },
];

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-collapse on max-lg screens
  useEffect(() => {
    const handleResize = () => {
      const isLgOrSmaller = window.innerWidth < 1024;
      setIsMobile(isLgOrSmaller);
      if (isLgOrSmaller) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <TooltipProvider>
      <motion.aside
        animate={{
          width: collapsed ? 72 : 240,
          x: isMobile ? (isOpen ? 0 : -240) : 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "relative flex flex-col h-screen bg-[#0C1E3C] border-r border-white/8 shrink-0 overflow-hidden z-30",
          isMobile && "fixed left-0 top-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500 shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col min-w-0"
              >
                <span className="text-white font-semibold text-sm leading-tight truncate">
                  OmniSuiteAI
                </span>
                <span className="text-slate-400 text-xs truncate">
                  Patterson Cheney
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin space-y-0.5">
          {/* Main section */}
          {!collapsed && (
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
              Main
            </p>
          )}
          {navItems
            .filter((i) => i.section === "main")
            .map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                collapsed={collapsed}
              />
            ))}

          <div className="my-3 mx-2 border-t border-white/8" />

          {/* Admin section */}
          {/* {!collapsed && (
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
              Admin
            </p>
          )} */}
          {navItems
            .filter((i) => i.section === "admin")
            .map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={
                  pathname === item.href || pathname.startsWith(item.href + "/")
                }
                collapsed={collapsed}
              />
            ))}
        </nav>

        {/* Collapse toggle - hide on mobile */}
        {!isMobile && (
          <div className="px-2 py-3 border-t border-white/8">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-full h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-2 w-full px-2">
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span className="text-xs">Collapse</span>
                </div>
              )}
            </button>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  );
}

function SidebarItem({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 group relative",
        isActive
          ? "bg-cyan-500/15 text-white border-l-2 border-cyan-400 pl-[10px]"
          : "text-slate-400 hover:text-white hover:bg-white/6 border-l-2 border-transparent",
      )}
    >
      <Icon
        className={cn(
          "w-4.5 h-4.5 shrink-0 transition-colors",
          isActive
            ? "text-cyan-400"
            : "text-slate-400 group-hover:text-slate-200",
        )}
      />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex-1 truncate font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <Badge
          variant="secondary"
          className="ml-auto bg-cyan-500/20 text-cyan-400 border-0 text-[10px] h-4 px-1.5 font-semibold"
        >
          {item.badge}
        </Badge>
      )}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-cyan-500/10 -z-10"
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
        />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>{content}</TooltipTrigger>
        <TooltipContent className="text-xs">
          {item.label}
          {item.badge && ` (${item.badge})`}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
