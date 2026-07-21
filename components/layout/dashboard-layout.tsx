"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { AnimatedBackground } from "../ui/animated-background";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
