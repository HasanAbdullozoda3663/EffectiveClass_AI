"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileVideo, CheckCircle, Loader2, FileText, BarChart3, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function AnimatedLaptopDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    { id: "upload", duration: 2000 },
    { id: "processing", duration: 3000 },
    { id: "analysis", duration: 2000 },
    { id: "feedback", duration: 3000 },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length)
        setIsAnimating(false)
      }, 500)
    }, steps[currentStep].duration)

    return () => clearInterval(interval)
  }, [currentStep])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See EffectiveClass AI in Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how our platform transforms classroom videos into actionable insights
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Animated Light Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            {/* Glowing particles around laptop */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + ((i * 60) % 80)}%`,
                  top: `${30 + ((i * 40) % 40)}%`,
                }}
                animate={{
                  scale: [0.5, 1.5, 0.5],
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              />
            ))}

            {/* Animated light rays */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
              <defs>
                <radialGradient id="lightGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </radialGradient>
              </defs>

              <motion.circle
                cx="400"
                cy="300"
                r="200"
                fill="url(#lightGradient)"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />

              {/* Light beams forming laptop shape */}
              <motion.path
                d="M200,250 L600,250 L580,350 L220,350 Z"
                stroke="url(#lightGradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 3, delay: 1 }}
              />

              <motion.path
                d="M250,250 L550,250 L550,200 L250,200 Z"
                stroke="url(#lightGradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 3, delay: 1.5 }}
              />
            </svg>
          </motion.div>

          {/* Laptop Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            {/* Laptop Screen */}
            <div className="relative mx-auto border-gray-800 dark:border-gray-600 bg-gray-800 dark:bg-gray-700 border-[8px] sm:border-[12px] rounded-t-xl h-[250px] sm:h-[300px] md:h-[400px] max-w-[350px] sm:max-w-[500px] md:max-w-[700px] shadow-2xl">
              <div className="rounded-lg overflow-hidden h-[234px] sm:h-[276px] md:h-[376px] bg-white dark:bg-gray-900 relative">
                {/* Animated Content Inside Laptop */}
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center"
                        >
                          <Upload className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-4">Upload Your Video</h3>
                        <p className="text-muted-foreground mb-6">Drag and drop your classroom recording</p>

                        <motion.div
                          className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 bg-blue-50 dark:bg-blue-950/20"
                          animate={{ borderColor: ["#93c5fd", "#3b82f6", "#93c5fd"] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <FileVideo className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                          <p className="text-sm text-blue-600 dark:text-blue-400">classroom_lesson.mp4</p>
                          <p className="text-xs text-muted-foreground">45.2 MB</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
                        >
                          <Loader2 className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-4">AI Processing</h3>
                        <p className="text-muted-foreground mb-6">Analyzing video content and speech patterns</p>

                        <div className="space-y-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 2.5, ease: "easeInOut" }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">Processing: 85%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center"
                        >
                          <Brain className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-4">Generating Analysis</h3>
                        <p className="text-muted-foreground mb-6">Creating comprehensive insights and metrics</p>

                        <div className="grid grid-cols-3 gap-3">
                          {["Teaching Quality", "Student Engagement", "Content Delivery"].map((metric, i) => (
                            <motion.div
                              key={metric}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.3 }}
                              className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3"
                            >
                              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                              <p className="text-xs font-medium">{metric}</p>
                              <motion.p
                                className="text-lg font-bold text-green-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.3 + 0.5 }}
                              >
                                {90 + i * 2}%
                              </motion.p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center"
                    >
                      <div className="h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">AI Feedback Report</h3>
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>

                        <div className="space-y-4 h-full overflow-y-auto">
                          <Card className="border-green-200 dark:border-green-800">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-sm">Excellent Teaching Clarity</h4>
                                  <motion.p
                                    className="text-xs text-muted-foreground mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    Your explanations were clear and well-structured. Students showed high engagement
                                    during key concepts.
                                  </motion.p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <BarChart3 className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-sm">Strong Student Interaction</h4>
                                  <motion.p
                                    className="text-xs text-muted-foreground mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                  >
                                    92% participation rate detected. Students actively responded to questions and
                                    discussions.
                                  </motion.p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-yellow-200 dark:border-yellow-800">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <FileText className="w-5 h-5 text-yellow-500 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-sm">Recommendation</h4>
                                  <motion.p
                                    className="text-xs text-muted-foreground mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                  >
                                    Consider adding more visual aids during complex explanations to enhance
                                    understanding.
                                  </motion.p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 }}
                            className="text-center pt-4"
                          >
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                              <FileText className="w-4 h-4 mr-2" />
                              Download Full Report
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Progress Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      animate={{
                        scale: index === currentStep ? 1.2 : 1,
                        opacity: index === currentStep ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Laptop Base */}
            <div className="relative mx-auto bg-gray-900 dark:bg-gray-600 rounded-b-xl rounded-t-sm h-[20px] max-w-[740px] shadow-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-700 dark:bg-gray-500 rounded-full"></div>
            </div>
            <div className="relative mx-auto bg-gray-800 dark:bg-gray-700 rounded-b-xl h-[8px] max-w-[680px]"></div>
          </motion.div>

          {/* Step Labels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center"
          >
            {[
              { icon: Upload, title: "Upload Video", desc: "Drag & drop classroom recording" },
              { icon: Brain, title: "AI Analysis", desc: "Advanced processing & insights" },
              { icon: BarChart3, title: "Generate Metrics", desc: "Comprehensive performance data" },
              { icon: FileText, title: "Receive Feedback", desc: "Professional multilingual reports" },
            ].map((step, index) => {
              // Extract the icon as a component
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-500 ${
                    index === currentStep
                      ? "bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800"
                      : "bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent"
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.05 : 1,
                    y: index === currentStep ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* render the icon component here */}
                  <Icon
                    className={`w-8 h-8 mx-auto mb-2 ${
                      index === currentStep ? "text-blue-500" : "text-muted-foreground"
                    }`}
                  />
                  <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
