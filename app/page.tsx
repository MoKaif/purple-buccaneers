"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { FeaturedLeague } from "@/components/dashboard/featured-league";
import {
  LayoutGrid,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/60">
          Welcome back! Here&apos;s what&apos;s happening with your leagues.
        </p>
      </motion.div>

      {/* Stat cards grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatCard
          title="Active Leagues"
          value="5"
          change="+2 this season"
          icon={<LayoutGrid className="w-5 h-5" />}
          trend="up"
          index={0}
        />
        <StatCard
          title="Total Players"
          value="1,247"
          change="+148 new"
          icon={<Users className="w-5 h-5" />}
          trend="up"
          index={1}
        />
        <StatCard
          title="Avg Points"
          value="58.4"
          change="+2.1 from last GW"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          index={2}
        />
        <StatCard
          title="Pending Actions"
          value="12"
          change="3 urgent"
          icon={<Zap className="w-5 h-5" />}
          trend="neutral"
          index={3}
        />
      </motion.div>

      {/* Featured league section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FeaturedLeague />
      </motion.div>
    </DashboardLayout>
  );
}
