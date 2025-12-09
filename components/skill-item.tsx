"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SkillItemProps {
  name: string
  icon: ReactNode
  level?: number
}

export function SkillItem({ name, icon, level }: SkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
    >
      <div className="relative overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-4 h-full transition-all duration-300 hover:border-primary/50">
        <div className="absolute -inset-1 bg-gradient-vice rounded-xl blur opacity-20 hover:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-secondary">
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-medium">{name}</div>
            {typeof level === "number" && (
              <div className="mt-2 h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-vice"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(Math.max(level, 0), 100)}%` }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
