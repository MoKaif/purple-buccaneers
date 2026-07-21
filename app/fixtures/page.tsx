"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar } from "lucide-react";

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  status: "upcoming" | "live" | "completed";
}

const mockFixtures: Fixture[] = [
  {
    id: "1",
    homeTeam: "MCI",
    awayTeam: "LIV",
    date: "2024-03-15 20:00",
    status: "completed",
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: "2",
    homeTeam: "MUN",
    awayTeam: "ARS",
    date: "2024-03-16 15:00",
    status: "completed",
    homeScore: 1,
    awayScore: 1,
  },
  {
    id: "3",
    homeTeam: "TOT",
    awayTeam: "CHE",
    date: "2024-03-17 12:30",
    status: "upcoming",
  },
  {
    id: "4",
    homeTeam: "LIV",
    awayTeam: "MUN",
    date: "2024-03-18 20:00",
    status: "upcoming",
  },
  {
    id: "5",
    homeTeam: "ARS",
    awayTeam: "MCI",
    date: "2024-03-19 15:00",
    status: "upcoming",
  },
];

const statusStyles = {
  upcoming: "bg-blue-500/20 text-blue-300",
  live: "bg-red-500/20 text-red-300 animate-pulse",
  completed: "bg-green-500/20 text-green-300",
};

const statusLabels = {
  upcoming: "Upcoming",
  live: "Live",
  completed: "Completed",
};

export default function FixturesPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Fixtures</h1>
        <p className="text-foreground/60">View all upcoming and completed matches</p>
      </motion.div>

      {/* Fixtures list */}
      <div className="space-y-4">
        {mockFixtures.map((fixture, idx) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard variant="default" className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Date and Status */}
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">
                      {new Date(fixture.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-medium">
                      {new Date(fixture.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-bold text-lg">{fixture.homeTeam}</p>
                  </div>

                  <div className="text-center">
                    {fixture.status === "completed" ? (
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {fixture.homeScore} - {fixture.awayScore}
                        </p>
                        <p className="text-xs text-foreground/60 uppercase">
                          Final
                        </p>
                      </div>
                    ) : fixture.status === "live" ? (
                      <div>
                        <p className="text-2xl font-bold text-red-400">●</p>
                        <p className="text-xs text-red-300 uppercase">Live</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-foreground/60 uppercase">
                          vs
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-lg">{fixture.awayTeam}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles[fixture.status]
                  }`}
                >
                  {statusLabels[fixture.status]}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
