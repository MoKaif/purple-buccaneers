"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DataTable } from "@/components/ui/data-table";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Mock data
interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  points: number;
  price: number;
  form: string;
}

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Erling Haaland",
    position: "Forward",
    team: "MCI",
    points: 245,
    price: 13.5,
    form: "Excellent",
  },
  {
    id: "2",
    name: "Harry Kane",
    position: "Forward",
    team: "TOT",
    points: 198,
    price: 10.8,
    form: "Good",
  },
  {
    id: "3",
    name: "Bruno Fernandes",
    position: "Midfielder",
    team: "MUN",
    points: 187,
    price: 11.2,
    form: "Good",
  },
  {
    id: "4",
    name: "Mohamed Salah",
    position: "Midfielder",
    team: "LIV",
    points: 192,
    price: 12.0,
    form: "Excellent",
  },
  {
    id: "5",
    name: "Ruben Dias",
    position: "Defender",
    team: "MCI",
    points: 156,
    price: 6.5,
    form: "Good",
  },
  {
    id: "6",
    name: "Luke Shaw",
    position: "Defender",
    team: "MUN",
    points: 128,
    price: 6.0,
    form: "Fair",
  },
  {
    id: "7",
    name: "David de Gea",
    position: "Goalkeeper",
    team: "MUN",
    points: 145,
    price: 5.5,
    form: "Good",
  },
];

const addPlayerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.enum(["Goalkeeper", "Defender", "Midfielder", "Forward"]),
  team: z.string().min(2),
  price: z.number().min(3.5).max(15),
});

type AddPlayerForm = z.infer<typeof addPlayerSchema>;

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset } = useForm<AddPlayerForm>({
    resolver: zodResolver(addPlayerSchema),
  });

  const onAddPlayer = (data: AddPlayerForm) => {
    const newPlayer: Player = {
      id: String(players.length + 1),
      ...data,
      points: Math.floor(Math.random() * 250),
      form: ["Excellent", "Good", "Fair"][Math.floor(Math.random() * 3)],
    };
    setPlayers([...players, newPlayer]);
    reset();
    setShowModal(false);
  };

  const columns: ColumnDef<Player>[] = [
    {
      accessorKey: "name",
      header: "Player Name",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "team",
      header: "Team",
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => (
        <span className="text-accent font-semibold">{row.original.points}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>${row.original.price.toFixed(1)}M</span>,
    },
    {
      accessorKey: "form",
      header: "Form",
      cell: ({ row }) => {
        const formColors = {
          Excellent: "bg-green-500/20 text-green-300",
          Good: "bg-primary/20 text-primary",
          Fair: "bg-yellow-500/20 text-yellow-300",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              formColors[row.original.form as keyof typeof formColors]
            }`}
          >
            {row.original.form}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Players</h1>
          <p className="text-foreground/60">
            Manage all players in your fantasy league
          </p>
        </div>
        <GlowButton
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Player
        </GlowButton>
      </motion.div>

      {/* Players table */}
      <DataTable columns={columns} data={players} searchPlaceholder="Search players..." />

      {/* Add Player Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <GlassCard variant="default" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Player</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onAddPlayer)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Player Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g., John Smith"
                    className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Position
                  </label>
                  <select
                    {...register("position")}
                    className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Team</label>
                  <input
                    {...register("team")}
                    placeholder="e.g., MCI"
                    className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (£M)
                  </label>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="3.5"
                    max="15"
                    placeholder="e.g., 10.5"
                    className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <GlowButton type="submit" variant="primary" className="flex-1">
                    Add Player
                  </GlowButton>
                  <GlowButton
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </GlowButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
