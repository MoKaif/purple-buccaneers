"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Zap,
  TrendingUp,
  Trophy,
  AlertCircle,
  Target,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "milestone" | "record" | "alert" | "achievement";
  icon: React.ReactNode;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "New League Record",
    description: "Highest single gameweek score: 187 points!",
    timestamp: "2 hours ago",
    type: "record",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    id: "2",
    title: "Milestone Reached",
    description: "1000+ players have joined the league",
    timestamp: "5 hours ago",
    type: "milestone",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: "3",
    title: "Price Change Alert",
    description: "3 players had significant price changes",
    timestamp: "Yesterday",
    type: "alert",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    id: "4",
    title: "Achievement Unlocked",
    description: "Player completed perfect gameweek - 3 penalties saved!",
    timestamp: "2 days ago",
    type: "achievement",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "5",
    title: "New Record",
    description: "Fastest 50 point gap between 1st and 2nd place",
    timestamp: "3 days ago",
    type: "record",
    icon: <Zap className="w-5 h-5" />,
  },
];

const typeStyles = {
  milestone: "border-l-4 border-blue-500 bg-blue-500/5",
  record: "border-l-4 border-yellow-500 bg-yellow-500/5",
  alert: "border-l-4 border-red-500 bg-red-500/5",
  achievement: "border-l-4 border-green-500 bg-green-500/5",
};

const typeIcons = {
  milestone: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
  },
  record: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
  },
  alert: {
    bg: "bg-red-500/20",
    text: "text-red-300",
  },
  achievement: {
    bg: "bg-green-500/20",
    text: "text-green-300",
  },
};

export default function EventsPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold">Events Timeline</h1>
        </div>
        <p className="text-foreground/60">Recent league activities and updates</p>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-4">
        {mockEvents.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div
              className={`rounded-lg p-6 glass border-l-4 ${
                typeStyles[event.type]
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-lg ${typeIcons[event.type].bg} flex-shrink-0`}
                >
                  <div className={typeIcons[event.type].text}>
                    {event.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {event.title}
                  </h3>
                  <p className="text-foreground/70 mb-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wide">
                    {event.timestamp}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load more button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <button className="px-6 py-3 border-2 border-primary/50 text-primary rounded-lg font-medium hover:bg-primary/5 transition-all duration-300 hover:border-primary">
          Load More Events
        </button>
      </motion.div>
    </DashboardLayout>
  );
}
