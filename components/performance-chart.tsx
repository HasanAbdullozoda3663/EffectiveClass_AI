"use client"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceDot } from "recharts"
import { useLanguage } from "@/contexts/language-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const performanceData = [
  { day: "MON", teacher1: 85, teacher2: 78, teacher3: 72, teacher4: 88 },
  { day: "TUE", teacher1: 88, teacher2: 82, teacher3: 75, teacher4: 85 },
  { day: "WED", teacher1: 92, teacher2: 85, teacher3: 78, teacher4: 90 },
  { day: "THU", teacher1: 95, teacher2: 88, teacher3: 82, teacher4: 87 },
  { day: "FRI", teacher1: 89, teacher2: 91, teacher3: 85, teacher4: 92 },
  { day: "SAT", teacher1: 93, teacher2: 89, teacher3: 88, teacher4: 95 },
  { day: "SUN", teacher1: 91, teacher2: 86, teacher3: 90, teacher4: 89 },
]

const teachers = [
  { name: "Sarah", avatar: "/placeholder.svg?height=32&width=32", color: "#3b82f6", peak: { day: "THU", score: 95 } },
  { name: "Ahmed", avatar: "/placeholder.svg?height=32&width=32", color: "#10b981", peak: { day: "FRI", score: 91 } },
  { name: "Maria", avatar: "/placeholder.svg?height=32&width=32", color: "#f59e0b", peak: { day: "SUN", score: 90 } },
  { name: "David", avatar: "/placeholder.svg?height=32&width=32", color: "#8b5cf6", peak: { day: "SAT", score: 95 } },
]

export function PerformanceChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [animatedData, setAnimatedData] = useState(
    performanceData.map((item) => ({ ...item, teacher1: 0, teacher2: 0, teacher3: 0, teacher4: 0 })),
  )
  const { t } = useLanguage()

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedData(performanceData)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const bestScore = Math.max(...performanceData.flatMap((d) => [d.teacher1, d.teacher2, d.teacher3, d.teacher4]))
  const bestTeacher = teachers.find((t) => t.peak.score === bestScore)

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Weekly Teaching Performance</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track teaching effectiveness and student engagement across the week
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Chart Container with Gradient Background */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-8 text-white">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-2xl md:text-3xl font-bold mb-2"
                >
                  Best Performance
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-lg opacity-90"
                >
                  {bestScore}% Teaching Effectiveness
                </motion.p>
              </div>

              {/* Chart */}
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "white", fontSize: 12, opacity: 0.8 }}
                    />
                    <YAxis hide />

                    {/* Teacher Lines */}
                    <Line
                      type="monotone"
                      dataKey="teacher1"
                      stroke={teachers[0].color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: teachers[0].color }}
                    />
                    <Line
                      type="monotone"
                      dataKey="teacher2"
                      stroke={teachers[1].color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: teachers[1].color }}
                    />
                    <Line
                      type="monotone"
                      dataKey="teacher3"
                      stroke={teachers[2].color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: teachers[2].color }}
                    />
                    <Line
                      type="monotone"
                      dataKey="teacher4"
                      stroke={teachers[3].color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: teachers[3].color }}
                    />

                    {/* Peak Points with Avatars */}
                    {teachers.map((teacher, index) => {
                      const dataPoint = performanceData.find((d) => d.day === teacher.peak.day)
                      const xIndex = performanceData.findIndex((d) => d.day === teacher.peak.day)
                      return (
                        <ReferenceDot
                          key={teacher.name}
                          x={teacher.peak.day}
                          y={teacher.peak.score}
                          r={0}
                          fill="transparent"
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>

                {/* Floating Avatars */}
                {teachers.map((teacher, index) => {
                  const dayIndex = performanceData.findIndex((d) => d.day === teacher.peak.day)
                  const leftPosition = 8 + dayIndex * (84 / (performanceData.length - 1))
                  const topPosition = 20 + (100 - teacher.peak.score) * 0.6

                  return (
                    <motion.div
                      key={teacher.name}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                      className="absolute"
                      style={{
                        left: `${leftPosition}%`,
                        top: `${topPosition}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10 border-2 border-white shadow-lg">
                          <AvatarImage src={teacher.avatar || "/placeholder.svg"} alt={teacher.name} />
                          <AvatarFallback className="bg-white text-gray-800 font-semibold">
                            {teacher.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay: 1.5 + index * 0.2 }}
                          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                        >
                          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                            <p className="text-xs font-medium">{teacher.name}</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-wrap justify-center gap-6"
              >
                {teachers.map((teacher, index) => (
                  <div key={teacher.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teacher.color }} />
                    <span className="text-sm opacity-90">{teacher.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          {[
            { title: "Average Score", value: "89.2%", change: "+5.3%", color: "text-green-600" },
            { title: "Peak Performance", value: "95%", change: "+2.1%", color: "text-blue-600" },
            { title: "Consistency Rate", value: "92.8%", change: "+7.2%", color: "text-purple-600" },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
            >
              <Card className="border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{metric.title}</h4>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className={`text-sm font-medium ${metric.color}`}>{metric.change} from last week</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
