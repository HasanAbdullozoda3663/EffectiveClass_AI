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
import { Upload, FileVideo, CheckCircle, Loader2, Play, BarChart3, FileText, Download, AlertCircle } from "lucide-react"
import { apiService, ProcessingStatusResponse, GetFeedbackResponse } from "@/lib/api"
import { toast } from "sonner"

// Subject options that match backend enum
const SUBJECT_OPTIONS = [
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "literature", label: "Literature" },
  { value: "language", label: "Language" },
  { value: "computer_science", label: "Computer Science" },
  { value: "art", label: "Art" },
  { value: "music", label: "Music" },
  { value: "physical_education", label: "Physical Education" },
  { value: "other", label: "Other" },
]

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
  const [currentStatus, setCurrentStatus] = useState<ProcessingStatusResponse | null>(null)
  const [feedbackData, setFeedbackData] = useState<GetFeedbackResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        setError(null)
      } else {
        setError("Please select a valid video file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please select a valid video file")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!file) {
      setError("Please select a video file")
      return
    }

    if (!formData.subject) {
      setError("Please select a subject")
      return
    }

    if (!formData.lessonTheme.trim()) {
      setError("Please enter a lesson theme")
      return
    }

    setIsProcessing(true)
    setUploadProgress(0)
    setError(null)

    try {
      console.log("Starting upload with data:", {
        subject: formData.subject,
        theme: formData.lessonTheme,
        language: formData.videoLanguage
      })

      // Upload video
      setUploadProgress(10)
      const uploadResponse = await apiService.uploadVideo(
        file,
        formData.subject,
        formData.lessonTheme,
        formData.videoLanguage,
        formData.feedbackLanguage
      )

      console.log("Upload response:", uploadResponse)
      setUploadProgress(30)
      toast.success("Video uploaded successfully! Processing started...")

      // Poll for status updates
      const finalStatus = await apiService.pollStatus(
        uploadResponse.id,
        (status) => {
          console.log("Status update:", status)
          setCurrentStatus(status)
          setUploadProgress(30 + (status.progress * 60)) // 30-90% based on progress
        }
      )

      console.log("Final status:", finalStatus)

      if (finalStatus.status === 'failed') {
        throw new Error(finalStatus.error_message || 'Processing failed')
      }

      setUploadProgress(90)

      // Get feedback results
      const feedback = await apiService.getFeedback(uploadResponse.id)
      console.log("Feedback response:", feedback)
      setFeedbackData(feedback)
      setUploadProgress(100)

      toast.success("Analysis completed successfully!")
      setIsComplete(true)

    } catch (err) {
      console.error('Error processing video:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during processing'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isComplete && feedbackData) {
    // Language mapping from frontend to backend
    const languageMap: { [key: string]: string } = {
      'english': 'en',
      'russian': 'ru', 
      'tajik': 'tj'
    }
    
    // Get the primary feedback (first one or matching the selected language)
    const backendLanguage = languageMap[formData.feedbackLanguage] || 'en'
    const primaryFeedback = feedbackData.feedbacks.find(f => f.language === backendLanguage) || feedbackData.feedbacks[0]
    
    console.log("Selected language:", formData.feedbackLanguage, "Backend language:", backendLanguage)
    console.log("Available feedbacks:", feedbackData.feedbacks.map(f => f.language))
    console.log("Primary feedback:", primaryFeedback)
    
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
              Analysis Complete!
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
                        <span className="text-sm">Teaching Quality</span>
                        <span className="text-sm font-bold">{Math.round(primaryFeedback.teaching_quality_score * 10)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full" 
                          style={{ width: `${primaryFeedback.teaching_quality_score * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Student Engagement</span>
                        <span className="text-sm font-bold">{Math.round(primaryFeedback.student_engagement_score * 10)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full" 
                          style={{ width: `${primaryFeedback.student_engagement_score * 10}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Overall Score</span>
                        <span className="text-sm font-bold">{Math.round(primaryFeedback.overall_score * 10)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full" 
                          style={{ width: `${primaryFeedback.overall_score * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <h4 className="font-semibold mb-2 text-sm">Key Insights</h4>
                    <div className="space-y-1 text-xs max-h-20 overflow-y-auto">
                      {primaryFeedback.strengths.split('. ').slice(0, 2).map((strength, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 text-green-300 flex-shrink-0" />
                          <span>{strength}</span>
                        </div>
                      ))}
                      {primaryFeedback.areas_for_improvement.split('. ').slice(0, 1).map((improvement, index) => (
                        <div key={`improvement-${index}`} className="flex items-start space-x-2">
                          <Play className="w-3 h-3 mt-0.5 text-yellow-300 flex-shrink-0" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DeviceMockup>
            </div>

            {/* Detailed Feedback Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {primaryFeedback.strengths}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2 text-blue-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {primaryFeedback.areas_for_improvement}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-purple-200 dark:border-purple-800 mb-12">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Specific Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {primaryFeedback.specific_recommendations}
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setIsComplete(false)
                  setFeedbackData(null)
                  setFile(null)
                  setFormData({
                    subject: "",
                    lessonTheme: "",
                    videoLanguage: "english",
                    feedbackLanguage: "english",
                  })
                }}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Analyze Another Video
              </Button>
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Download Report
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center"
          >
            <BarChart3 className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t("getStarted.title")}
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("")}
          </p>

          {/* Upload Form */}
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
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
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECT_OPTIONS.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-theme">{t("getStarted.form.lessonTheme")}</Label>
                    <Input
                      id="lesson-theme"
                      value={formData.lessonTheme}
                      onChange={(e) => setFormData({ ...formData, lessonTheme: e.target.value })}
                      placeholder="e.g., Quadratic Equations, Photosynthesis"
                      className="h-12"
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

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                  </motion.div>
                )}

                {/* Progress Display */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {currentStatus?.current_task || "Processing video..."}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(uploadProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}

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
                        {currentStatus?.current_task || "Processing..."}
                      </>
                    ) : (
                      <>
                        <FileVideo className="w-5 h-5 mr-2" />
                        {formData.feedbackLanguage === 'english' ? 'Get Feedback' : 
                         formData.feedbackLanguage === 'russian' ? 'Получить отзыв' : 
                         'Баҳо гиред'}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
