"use client"

import { motion } from "framer-motion"

interface SectionHeadingProps {
  title: string
  subtitle: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="inline-block">
          <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-2">
            <span className="relative z-10 text-zinc-200">{subtitle}</span>
            <span className="absolute inset-0 rounded-full bg-gradient-vice opacity-20"></span>
          </div>
        </div>
      </motion.div>

      <motion.h2
        className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-vice tracking-tight leading-tight drop-shadow-[0_0_22px_rgba(255,200,0,0.25)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="relative mx-auto mt-6 w-28 h-[6px]"
      >
        <div className="absolute inset-0 blur-xl bg-gradient-vice opacity-40 rounded-full" />
        <div className="relative w-full h-full bg-gradient-vice rounded-full shadow-[0_0_18px_rgba(255,200,0,0.35)]" />
      </motion.div>
    </div>
  )
}
