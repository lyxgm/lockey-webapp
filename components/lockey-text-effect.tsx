"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface LockeyTextEffectProps {
  onComplete: () => void
}

export function LockeyTextEffect({ onComplete }: LockeyTextEffectProps) {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 500)
    const timer2 = setTimeout(() => onComplete(), 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 z-50 flex items-center justify-center">
      {showText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-8"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent italic tracking-wide leading-none"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              style={{
                backgroundSize: "200% 200%",
                fontFamily: "'Inter', sans-serif",
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
              }}
            >
              Lockey
            </motion.h1>

            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold text-blue-500/10 italic tracking-wide blur-md leading-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Lockey
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -left-4 w-3 h-3 bg-blue-400 rounded-full opacity-60"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            />
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 mt-8 mx-auto max-w-sm rounded-full shadow-lg"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-blue-600/80 text-lg mt-6 font-medium tracking-wide"
          >
            Smart Door Security
          </motion.p>
        </motion.div>
      )}
    </div>
  )
}
