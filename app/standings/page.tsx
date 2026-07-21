"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Trophy } from "lucide-react";

interface Standing {
  rank: number;
  name: string;
  team: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDiff: number;
}

const mockStandings: Standing[] = [
  {
    rank: 1,
    name: "Manchester City",
    team: "MCI",
    points: 89,
    played: 30,
    wins: 27,
    draws: 8,
    losses: 2,
    goalDiff: 68,
  },
  {
    rank: 2,
    name: "Liverpool FC",
    team: "LIV",
    points: 86,
    played: 30,
    wins: 26,
    draws: 8,
    losses: 3,
    goalDiff: 62,
  },
  {
    rank: 3,
    name: "Arsenal FC",
    team: "ARS",
    points: 82,
    played: 30,
    wins: 25,
    draws: 7,
    losses: 4,
    goalDiff: 58,
  },
  {
    rank: 4,
    name: "Tottenham",
    team: "TOT",
    points: 73,
    played: 30,
    wins: 22,
    draws: 7,
    losses: 6,
    goalDiff: 45,
  },
  {
    rank: 5,
    name: "Chelsea FC",
    team: "CHE",
    points: 68,
    played: 30,
    wins: 20,
    draws: 8,
    losses: 8,
    goalDiff: 38,
  },
  {
    rank: 6,
    name: "Manchester United",
    team: "MUN",
    points: 65,
    played: 30,
    wins: 19,
    draws: 8,
    losses: 9,
    goalDiff: 35,
  },
];

const getMedalColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-900";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900";
    case 3:
      return "bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900";
    default:
      return "bg-primary/20 text-primary";
  }
};

export default function StandingsPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold">League Table</h1>
        </div>
        <p className="text-foreground/60">Current season standings</p>
      </motion.div>

      {/* Standings table */}
      <GlassCard variant="default" animated={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/10 bg-white/3">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                  Pos
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground/70">
                  Team
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground/70">
                  Played
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground/70">
                  W
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground/70">
                  D
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground/70">
                  L
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground/70">
                  GD
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground/70">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {mockStandings.map((standing, idx) => (
                <motion.tr
                  key={standing.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-primary/10 hover:bg-white/3 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${getMedalColor(
                        standing.rank
                      )}`}
                    >
                      {standing.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{standing.name}</p>
                      <p className="text-xs text-foreground/50">{standing.team}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{standing.played}</td>
                  <td className="px-6 py-4 text-center text-green-400">
                    {standing.wins}
                  </td>
                  <td className="px-6 py-4 text-center text-blue-400">
                    {standing.draws}
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">
                    {standing.losses}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-primary">
                      {standing.goalDiff > 0
                        ? `+${standing.goalDiff}`
                        : standing.goalDiff}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-accent">
                      {standing.points}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}
