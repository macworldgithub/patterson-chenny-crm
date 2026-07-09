"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Phone,
  FlaskConical,
  BarChart3,
  Bell,
  Plug,
  UserCog,
  ShieldCheck,
  ScrollText,
  Settings,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const pages = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview & KPIs",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    description: "Manage outbound campaigns",
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    description: "Customer database",
  },
  // { label: 'Calls', href: '/calls', icon: Phone, description: 'Call history & recordings' },
  {
    label: "Simulation Mode",
    href: "/simulation",
    icon: FlaskConical,
    description: "Test AI scenarios",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Reports & charts",
  },
  { label: 'Notifications', href: '/notifications', icon: Bell, description: 'Activity feed' },
  { label: 'Integrations', href: '/integrations', icon: Plug, description: 'Connect tools & APIs' },
  { label: 'Users', href: '/users', icon: UserCog, description: 'User management' },
  { label: 'Roles & Permissions', href: '/roles', icon: ShieldCheck, description: 'Access control' },
  { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText, description: 'Activity history' },
  { label: 'Settings', href: '/settings', icon: Settings, description: 'Platform settings' },
];

const quickActions = [
  { label: "Create New Campaign", href: "/campaigns", shortcut: "N" },
  { label: "Run Simulation", href: "/simulation", shortcut: "S" },
  { label: "Export Customers", href: "/customers", shortcut: "E" },
  { label: "View Analytics Report", href: "/analytics", shortcut: "A" },
];

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter();

  const down = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, setOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [down]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search pages, customers, campaigns..."
        className="text-sm"
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <span className="text-3xl">🔍</span>
            <p className="text-sm text-muted-foreground">No results found.</p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.label}
              onSelect={() => navigate(action.href)}
              className="flex items-center justify-between rounded-xl"
            >
              <span className="text-sm">{action.label}</span>
              <kbd className="flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
                ⌘{action.shortcut}
              </kbd>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <CommandItem
                key={page.href}
                onSelect={() => navigate(page.href)}
                className="flex items-center gap-3 rounded-xl"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{page.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {page.description}
                  </span>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
