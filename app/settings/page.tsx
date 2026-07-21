"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import {
  Settings,
  Bell,
  Lock,
  Database,
  LogOut,
  Github,
  Mail,
} from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: SettingItem[];
}

interface SettingItem {
  label: string;
  type: "toggle" | "input" | "select";
  value?: boolean | string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    twoFactor: false,
  });

  const settingSections: SettingSection[] = [
    {
      id: "account",
      title: "Account Settings",
      description: "Manage your account and profile information",
      icon: <Settings className="w-6 h-6" />,
      items: [
        { label: "Email Address", type: "input" },
        { label: "Username", type: "input" },
        { label: "Full Name", type: "input" },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure how you receive updates",
      icon: <Bell className="w-6 h-6" />,
      items: [
        {
          label: "Push Notifications",
          type: "toggle",
          value: settings.notifications,
        },
        {
          label: "Email Updates",
          type: "toggle",
          value: settings.emailUpdates,
        },
        {
          label: "Notification Frequency",
          type: "select",
          value: "daily",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      description: "Protect your account with security settings",
      icon: <Lock className="w-6 h-6" />,
      items: [
        {
          label: "Two-Factor Authentication",
          type: "toggle",
          value: settings.twoFactor,
        },
        { label: "Change Password", type: "input" },
        { label: "Active Sessions", type: "select" },
      ],
    },
  ];

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-foreground/60">Manage your preferences and account</p>
      </motion.div>

      {/* Settings sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIdx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
          >
            <GlassCard variant="default" className="p-6">
              {/* Section header */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-primary/10">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p className="text-foreground/60">{section.description}</p>
                </div>
              </div>

              {/* Settings items */}
              <div className="space-y-4">
                {section.items.map((item, itemIdx) => (
                  <motion.div
                    key={itemIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIdx * 0.1) + (itemIdx * 0.05) }}
                    className="flex items-center justify-between p-4 bg-white/3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <label className="font-medium text-foreground cursor-pointer">
                      {item.label}
                    </label>

                    {item.type === "toggle" && (
                      <button
                        onClick={() =>
                          handleToggle(
                            item.label
                              .toLowerCase()
                              .replace(/\s+/g, "_")
                              .replace(/[^\w]/g, "")
                          )
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          item.value
                            ? "bg-primary"
                            : "bg-white/10"
                        }`}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            x: item.value ? 24 : 2,
                          }}
                          transition={{ type: "spring", stiffness: 500 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                        />
                      </button>
                    )}

                    {item.type === "input" && (
                      <input
                        type="text"
                        placeholder={item.label}
                        className="px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
                      />
                    )}

                    {item.type === "select" && (
                      <select className="px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                        <option>{item.value || "Select..."}</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </select>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Dangerous actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard variant="default" className="p-6 border border-red-500/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-300 mb-2">
                Danger Zone
              </h3>
              <p className="text-foreground/60">Irreversible actions</p>
            </div>

            <div className="flex gap-3">
              <GlowButton
                variant="outline"
                className="border-red-500 text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </GlowButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-3 justify-end"
      >
        <GlowButton variant="outline">Discard Changes</GlowButton>
        <GlowButton variant="primary">Save Settings</GlowButton>
      </motion.div>
    </DashboardLayout>
  );
}
