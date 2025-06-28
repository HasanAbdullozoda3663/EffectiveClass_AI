"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface DeviceMockupProps {
  children: ReactNode
  type: "iphone" | "macbook" | "ipad"
  className?: string
}

export function DeviceMockup({ children, type, className = "" }: DeviceMockupProps) {
  if (type === "iphone") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative ${className}`}
      >
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
          <div className="w-[148px] h-[18px] bg-gray-800 top-[18px] rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
          <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">{children}</div>
        </div>
      </motion.div>
    )
  }

  if (type === "macbook") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative ${className}`}
      >
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[400px] max-w-[600px] shadow-xl">
          <div className="rounded-lg overflow-hidden h-[384px] bg-white dark:bg-gray-800">{children}</div>
        </div>
        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[640px] shadow-sm"></div>
        <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[5px] max-w-[580px]"></div>
      </motion.div>
    )
  }

  if (type === "ipad") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative ${className}`}
      >
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[20px] rounded-[2rem] h-[500px] w-[380px] shadow-xl">
          <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[23px] top-[72px] rounded-s-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[23px] top-[124px] rounded-s-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[23px] top-[178px] rounded-s-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[23px] top-[142px] rounded-e-lg"></div>
          <div className="rounded-[1.5rem] overflow-hidden w-[340px] h-[460px] bg-white dark:bg-gray-800">
            {children}
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}
