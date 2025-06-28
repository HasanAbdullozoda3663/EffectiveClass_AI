"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/contexts/language-context"

// More data points to create smooth curves
const effectivenessData = [
  { stage: "Before AI", studentEngagement: 20, lessonClarity: 5, participation: 0, position: 0 },
  { stage: "Transition 1", studentEngagement: 25, lessonClarity: 12, participation: 8, position: 0.2 },
  { stage: "Transition 2", studentEngagement: 40, lessonClarity: 25, participation: 18, position: 0.4 },
  { stage: "Transition 3", studentEngagement: 60, lessonClarity: 45, participation: 32, position: 0.6 },
  { stage: "Transition 4", studentEngagement: 80, lessonClarity: 68, participation: 48, position: 0.8 },
  { stage: "After AI", studentEngagement: 98, lessonClarity: 85, participation: 58, position: 1 },
]

export function EffectivenessChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [animatedData, setAnimatedData] = useState(
    effectivenessData.map((item) => ({ ...item, studentEngagement: 0, lessonClarity: 0, participation: 0 })),
  )
  const { t } = useLanguage()

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedData(effectivenessData)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  // Custom tick formatter to show only "Before AI" and "After AI"
  const formatXAxisTick = (tickItem: string) => {
    if (tickItem === "Before AI") return t("sections.beforeAI")
    if (tickItem === "After AI") return t("sections.afterAI")
    return ""
  }

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("sections.effectivenessTitle")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("sections.effectivenessSubtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Chart Container with Gradient Background */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Gradient Background matching the uploaded image */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 dark:from-purple-900 dark:via-purple-800 dark:to-black" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-8 md:p-12 text-white">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-2xl md:text-3xl font-bold mb-4 text-white"
                >
                  {t("sections.effectivenessTitle")}
                </motion.h3>
              </div>

              {/* Chart */}
              <div className="h-64 sm:h-80 md:h-96 mb-6 sm:mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={animatedData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
                    <XAxis
                      dataKey="stage"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "white", fontSize: 12, fontWeight: "500" }}
                      tickFormatter={formatXAxisTick}
                      interval={0}
                      ticks={["Before AI", "After AI"]}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "white", fontSize: 10, opacity: 0.8 }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                      width={40}
                    />

                    {/* Student Engagement Line - Blue */}
                    <Line
                      type="monotone"
                      dataKey="studentEngagement"
                      stroke="#60a5fa"
                      strokeWidth={4}
                      dot={({ cx, cy, payload }) =>
                        payload.stage === "Before AI" || payload.stage === "After AI" ? (
                          <circle cx={cx} cy={cy} r={8} fill="#60a5fa" stroke="white" strokeWidth={2} />
                        ) : null
                      }
                      activeDot={{ r: 10, fill: "#60a5fa", stroke: "white", strokeWidth: 2 }}
                      animationDuration={2000}
                      animationBegin={1000}
                      connectNulls
                    />

                    {/* Lesson Clarity Line - Yellow */}
                    <Line
                      type="monotone"
                      dataKey="lessonClarity"
                      stroke="#fbbf24"
                      strokeWidth={4}
                      dot={({ cx, cy, payload }) =>
                        payload.stage === "Before AI" || payload.stage === "After AI" ? (
                          <circle cx={cx} cy={cy} r={8} fill="#fbbf24" stroke="white" strokeWidth={2} />
                        ) : null
                      }
                      activeDot={{ r: 10, fill: "#fbbf24", stroke: "white", strokeWidth: 2 }}
                      animationDuration={2000}
                      animationBegin={1400}
                      connectNulls
                    />

                    {/* Participation Line - Pink */}
                    <Line
                      type="monotone"
                      dataKey="participation"
                      stroke="#f472b6"
                      strokeWidth={4}
                      dot={({ cx, cy, payload }) =>
                        payload.stage === "Before AI" || payload.stage === "After AI" ? (
                          <circle cx={cx} cy={cy} r={8} fill="#f472b6" stroke="white" strokeWidth={2} />
                        ) : null
                      }
                      activeDot={{ r: 10, fill: "#f472b6", stroke: "white", strokeWidth: 2 }}
                      animationDuration={2000}
                      animationBegin={1800}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                  <span className="text-sm sm:text-lg font-medium text-white">{t("sections.studentEngagement")}</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <span className="text-sm sm:text-lg font-medium text-white">{t("sections.lessonClarity")}</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-pink-400"></div>
                  <span className="text-sm sm:text-lg font-medium text-white">{t("sections.participation")}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Improvement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          {[
            {
              title: t("sections.studentEngagement"),
              improvement: "+78%",
              color: "text-blue-500 dark:text-blue-400",
              bgColor: "bg-blue-50 dark:bg-blue-950/20",
              borderColor: "border-blue-200 dark:border-blue-800",
            },
            {
              title: t("sections.lessonClarity"),
              improvement: "+80%",
              color: "text-yellow-500 dark:text-yellow-400",
              bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
              borderColor: "border-yellow-200 dark:border-yellow-800",
            },
            {
              title: t("sections.participation"),
              improvement: "+58%",
              color: "text-pink-500 dark:text-pink-400",
              bgColor: "bg-pink-50 dark:bg-pink-950/20",
              borderColor: "border-pink-200 dark:border-pink-800",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg`}
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</h4>
              <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.improvement}</p>
              <p className="text-sm text-muted-foreground">Improvement with AI</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
