"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassmorphicCard } from "@/components/glassmorphic-card"

type Props = {
  title: string
  issuer: string
  href?: string
  year?: string
}

export function CertificateCard({ title, issuer, href, year }: Props) {
  const enabled = Boolean(href)

  const ButtonInner = (
    <Button
      className="relative overflow-hidden bg-gradient-vice text-black font-semibold shadow-[0_0_26px_rgba(255,200,0,.16)] hover:shadow-[0_0_60px_rgba(255,200,0,.35)] group/button px-5 py-2 rounded-lg border border-black/5"
      aria-disabled={!enabled}
    >
      <span className="pointer-events-none absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover/button:opacity-40 [mask-image:linear-gradient(90deg,transparent,black,transparent)] transition-opacity duration-500" />
      <span>View Certificate</span>
      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
    </Button>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <div className="relative rounded-xl p-[1px] bg-gradient-to-br from-[var(--miami-sun)] via-[var(--miami-pink)] to-[var(--miami-aqua)] opacity-90">
        <GlassmorphicCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 text-sm text-zinc-200">
                <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-vice text-black font-bold shadow-sm">
                  {issuer?.[0] ?? "C"}
                </span>
                <span className="font-medium tracking-wide">{issuer}</span>
                {year && <span className="text-zinc-400">• {year}</span>}
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
              {title}
            </h3>

            <div className="mt-6">
              {enabled ? (
                <Link href={href as string} target="_blank" rel="noreferrer" className="inline-block">
                  {ButtonInner}
                </Link>
              ) : (
                <div className="inline-block cursor-not-allowed opacity-95" aria-disabled>
                  {ButtonInner}
                </div>
              )}
            </div>
          </div>
        </GlassmorphicCard>

        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-2xl bg-gradient-vice blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      </div>
    </motion.div>
  )
}
