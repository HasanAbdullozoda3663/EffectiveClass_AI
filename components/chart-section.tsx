"use client"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/contexts/language-context"

const data = [
  {
    name: "Teaching Clarity",
    before: 65,
    after: 92,
  },
  {
    name: "Student Engagement",
    before: 58,
    after: 88,
  },
  {
    name: "Participation Rate",
    before: 45,
    after: 85,
  },
  {
    name: "Learning Outcomes",
    before: 62,
    after: 90,
  },
]

export function ChartSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [animatedData, setAnimatedData] = useState(data.map((item) => ({ ...item, before: 0, after: 0 })))
  const { t } = useLanguage()

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedData(data)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t("sections.metricsTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("sections.metricsSubtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-sm" tick={{ fontSize: 12 }} />
                <YAxis className="text-sm" tick={{ fontSize: 12 }} />
                <Bar dataKey="before" fill="#ef4444" radius={[4, 4, 0, 0]} name="Before" />
                <Bar dataKey="after" fill="#10b981" radius={[4, 4, 0, 0]} name="After" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center space-x-8 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-muted-foreground">Before AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-muted-foreground">After AI Analysis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
