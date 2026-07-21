import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/glass-card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend = "neutral",
  index = 0,
}: StatCardProps) {
  const trendColor = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-primary",
  };

  return (
    <GlassCard
      variant="default"
      className="p-6"
      animated={true}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="space-y-3"
      >
        {/* Title and Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/70 uppercase tracking-wider">
            {title}
          </h3>
          {icon && (
            <div className="text-primary/60 bg-primary/10 p-2 rounded-lg">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline justify-between">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-3xl font-bold text-foreground"
          >
            {value}
          </motion.div>
        </div>

        {/* Change indicator */}
        {change && (
          <p className={`text-sm font-medium ${trendColor[trend]}`}>
            {trend === "up" && "↑ "}
            {trend === "down" && "↓ "}
            {change}
          </p>
        )}
      </motion.div>
    </GlassCard>
  );
}
