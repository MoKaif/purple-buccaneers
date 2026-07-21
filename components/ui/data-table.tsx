"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { GlowButton } from "./glow-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search...",
  onRowClick,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <GlassCard variant="default" animated={false}>
      <div className="p-6">
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-primary/10 hover:bg-white/3 transition-colors"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-semibold text-foreground/70 uppercase tracking-wide"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onRowClick?.(row.original)}
                  className={`border-b border-primary/10 ${
                    onRowClick ? "cursor-pointer hover:bg-white/5" : ""
                  } transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-foreground/80"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mt-6 pt-6 border-t border-primary/10"
        >
          <div className="text-sm text-foreground/60">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex gap-2">
            <GlowButton
              size="sm"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </GlowButton>
            <GlowButton
              size="sm"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
