"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutGrid,
  Users,
  Calendar,
  Trophy,
  Zap,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutGrid className="w-5 h-5" />,
    href: "/",
  },
  {
    label: "Players",
    icon: <Users className="w-5 h-5" />,
    href: "/players",
  },
  {
    label: "Fixtures",
    icon: <Calendar className="w-5 h-5" />,
    href: "/fixtures",
  },
  {
    label: "Standings",
    icon: <Trophy className="w-5 h-5" />,
    href: "/standings",
  },
  {
    label: "Events",
    icon: <Zap className="w-5 h-5" />,
    href: "/events",
  },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 glass rounded-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -400 }}
        animate={{ x: isOpen ? 0 : -400 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed left-0 top-0 z-40 h-screen w-72 glass border-r border-primary/20 lg:translate-x-0 lg:static lg:h-screen overflow-y-auto"
      >
        <div className="p-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              Purple
              <br />
              Buccaneers
            </h1>
          </motion.div>

          {/* Navigation items */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * (index + 1) }}
              >
                <Link href={item.href}>
                  <motion.div
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center justify-between p-3 rounded-lg transition-all duration-300
                      ${
                        isActive(item.href)
                          ? "bg-primary/20 text-primary"
                          : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-xs bg-accent/50 text-white px-2 py-1 rounded">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-8 left-8 right-8"
          >
            <div className="glass p-4 text-xs text-foreground/60 rounded-lg border border-primary/10">
              <p>Fantasy League Management System v1.0</p>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
