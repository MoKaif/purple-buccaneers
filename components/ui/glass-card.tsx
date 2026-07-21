import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "glow";
  animated?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  variant = "default",
  animated = true,
  onClick,
}: GlassCardProps) {
  const variants = {
    default: "glass",
    bordered: "glass border-2 border-primary/30",
    glow: "glass glow",
  };

  const baseClass = `${variants[variant]} ${className}`;

  const content = (
    <div className={baseClass}>
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={onClick}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
