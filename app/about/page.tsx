"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { DeviceMockup } from "@/components/device-mockups"
import { Upload, Brain, FileText, BarChart3, Send, CheckCircle, ArrowRight } from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const processSteps = t("about.processSteps")
  const stepIcons = [Upload, Brain, FileText, BarChart3, Send]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {t("about.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">{t("about.subtitle")}</p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("about.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={ref} className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("about.processTitle")}</h2>
          </motion.div>

          {/* Process Flow */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {processSteps.map((step: any, index: number) => {
                const Icon = stepIcons[index]
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="relative"
                  >
                    <Card className="h-full border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center relative"
                        >
                          <Icon className="w-8 h-8 text-white" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                            {index + 1}
                          </div>
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>

                    {/* Arrow for desktop */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience comprehensive classroom analysis with our intuitive interface
            </p>
          </motion.div>

          <div className="flex justify-center">
            <DeviceMockup type="macbook" className="max-w-4xl">
              <div className="p-8 h-full bg-gradient-to-br from-blue-500 to-green-600 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Classroom Analysis Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-80">Teaching Quality</span>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold">92%</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-80">Engagement</span>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold">88%</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-80">Participation</span>
                      <Brain className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold">85%</div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex-1 text-white">
                  <h4 className="font-semibold mb-3">AI Insights & Recommendations</h4>
                  <div className="space-y-2 text-sm opacity-90">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-300" />
                      <span>Excellent use of visual aids to enhance understanding</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-300" />
                      <span>Strong student-teacher interaction observed</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 text-yellow-300" />
                      <span>Consider increasing wait time after questions</span>
                    </div>
                  </div>
                </div>
              </div>
            </DeviceMockup>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced AI Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the powerful features that make EffectiveClass AI the leading platform for classroom analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Deep Learning Analysis",
                description:
                  "Advanced neural networks analyze teaching patterns and student behavior with unprecedented accuracy",
              },
              {
                icon: FileText,
                title: "Multilingual Transcription",
                description: "Automatic transcription and analysis in Tajik, Russian, and English languages",
              },
              {
                icon: BarChart3,
                title: "Real-time Metrics",
                description: "Live tracking of engagement levels, participation rates, and learning effectiveness",
              },
              {
                icon: CheckCircle,
                title: "Quality Assurance",
                description: "Comprehensive evaluation of teaching methods and instructional delivery",
              },
              {
                icon: Send,
                title: "Instant Reports",
                description: "Professional feedback reports generated and delivered within minutes",
              },
              {
                icon: Upload,
                title: "Easy Integration",
                description: "Simple upload process with support for various video formats and qualities",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center"
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
