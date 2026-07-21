import React from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlowButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: GlowButtonProps) {
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow",
    secondary:
      "bg-gradient-to-r from-secondary to-primary text-white hover:shadow-glow",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        rounded-lg font-semibold transition-all duration-300
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
