"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { DeviceMockup } from "@/components/device-mockups"
import { Upload, FileVideo, CheckCircle, Loader2, Play, BarChart3, FileText, Download } from "lucide-react"

export default function GetStartedPage() {
  const { t } = useLanguage()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    lessonTheme: "",
    videoLanguage: "english",
    feedbackLanguage: "english",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsProcessing(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Simulate processing time
    setTimeout(() => {
      clearInterval(progressInterval)
      setUploadProgress(100)
      setTimeout(() => {
        setIsProcessing(false)
        setIsComplete(true)
      }, 1000)
    }, 3000)
  }

  if (isComplete) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t("getStarted.form.success")}
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Your classroom video has been analyzed successfully. Here's your comprehensive feedback report.
            </p>

            <div className="flex justify-center mb-12">
              <DeviceMockup type="ipad">
                <div className="p-6 h-full bg-gradient-to-br from-green-500 to-blue-600 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Analysis Report</h3>
                    <Download className="w-5 h-5" />
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Teaching Effectiveness</span>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Student Engagement</span>
                        <span className="text-sm font-bold">89%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Content Delivery</span>
                        <span className="text-sm font-bold">91%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: "91%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <h4 className="font-semibold mb-2 text-sm">Key Insights</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 text-green-300" />
                        <span>Excellent pacing and clarity</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 text-green-300" />
                        <span>Strong student interaction</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Play className="w-3 h-3 mt-0.5 text-yellow-300" />
                        <span>Consider more visual aids</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DeviceMockup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Detailed Analytics</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive metrics and insights</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Professional Report</h3>
                  <p className="text-sm text-muted-foreground">Multilingual feedback document</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Action Items</h3>
                  <p className="text-sm text-muted-foreground">Specific improvement recommendations</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 space-x-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Report
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsComplete(false)
                  setFile(null)
                  setFormData({
                    subject: "",
                    lessonTheme: "",
                    videoLanguage: "english",
                    feedbackLanguage: "english",
                  })
                }}
              >
                Analyze Another Video
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("getStarted.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("getStarted.subtitle")}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Upload Your Classroom Video</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label htmlFor="video-upload" className="text-lg font-semibold">
                    {t("getStarted.form.videoFile")}
                  </Label>

                  <motion.div
                    className={`relative border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : file
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {file ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <div>
                          <p className="text-lg font-semibold text-green-700 dark:text-green-400">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-semibold mb-2">{t("getStarted.form.dragDrop")}</p>
                          <p className="text-sm text-muted-foreground">
                            Supports MP4, AVI, MOV, and other video formats
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("getStarted.form.subject")}</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g., Mathematics, Physics, Literature"
                      className="h-10 sm:h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-theme">{t("getStarted.form.lessonTheme")}</Label>
                    <Input
                      id="lesson-theme"
                      value={formData.lessonTheme}
                      onChange={(e) => setFormData({ ...formData, lessonTheme: e.target.value })}
                      placeholder="e.g., Quadratic Equations, Photosynthesis"
                      className="h-10 sm:h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">{t("getStarted.form.videoLanguage")}</Label>
                    <RadioGroup
                      value={formData.videoLanguage}
                      onValueChange={(value) => setFormData({ ...formData, videoLanguage: value })}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="english" id="video-english" />
                        <Label htmlFor="video-english" className="cursor-pointer">
                          🇬🇧 {t("getStarted.languages.english")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="russian" id="video-russian" />
                        <Label htmlFor="video-russian" className="cursor-pointer">
                          🇷🇺 {t("getStarted.languages.russian")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tajik" id="video-tajik" />
                        <Label htmlFor="video-tajik" className="cursor-pointer">
                          🇹🇯 {t("getStarted.languages.tajik")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">{t("getStarted.form.feedbackLanguage")}</Label>
                    <Select
                      value={formData.feedbackLanguage}
                      onValueChange={(value) => setFormData({ ...formData, feedbackLanguage: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">🇬🇧 {t("getStarted.languages.english")}</SelectItem>
                        <SelectItem value="russian">🇷🇺 {t("getStarted.languages.russian")}</SelectItem>
                        <SelectItem value="tajik">🇹🇯 {t("getStarted.languages.tajik")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!file || isProcessing}
                    className="w-full px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("getStarted.form.processing")}
                      </>
                    ) : (
                      <>
                        <FileVideo className="w-5 h-5 mr-2" />
                        {t("getStarted.form.upload")}
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Progress Bar */}
                {isProcessing && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                      Processing: {Math.round(uploadProgress)}%
                    </p>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
