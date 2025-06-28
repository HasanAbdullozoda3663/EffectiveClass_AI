"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ConnectorLine() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 2 1000" preserveAspectRatio="none">
        <motion.path
          d="M1,0 Q1,250 1,500 Q1,750 1,1000"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          style={{ pathLength }}
          initial={{ pathLength: 0 }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
