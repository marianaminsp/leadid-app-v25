"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScanView } from "@/components/scan-view"
import { HerbariumView } from "@/components/herbarium-view"
import { ArboretumView } from "@/components/arboretum-view"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"

export default function Page() {
  const [activeTab, setActiveTab] = useState<"scan" | "herbarium" | "arboretum">("scan")
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      if (activeTab === "herbarium") setActiveTab("scan")
      else if (activeTab === "scan") setActiveTab("arboretum")
    }

    if (isRightSwipe) {
      if (activeTab === "arboretum") setActiveTab("scan")
      else if (activeTab === "scan") setActiveTab("herbarium")
    }
  }

  const getDirection = (tab: "scan" | "herbarium" | "arboretum") => {
    const order = { herbarium: 0, scan: 1, arboretum: 2 }
    const current = order[activeTab]
    const next = order[tab]
    return next > current ? 1 : -1
  }

  return (
    /* Using 100dvh for dynamic viewport height on mobile */
    <div
      className="flex min-h-[100dvh] flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Header />

      <main className="flex-1 pb-20 overflow-y-auto relative">
        <AnimatePresence mode="wait" custom={getDirection(activeTab)}>
          <motion.div
            key={activeTab}
            custom={getDirection(activeTab)}
            initial={(direction: number) => ({ opacity: 0, x: direction > 0 ? 100 : -100 })}
            animate={{ opacity: 1, x: 0 }}
            exit={(direction: number) => ({ opacity: 0, x: direction > 0 ? -100 : 100 })}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="min-h-full"
          >
            {activeTab === "scan" && <ScanView />}
            {activeTab === "herbarium" && <HerbariumView />}
            {activeTab === "arboretum" && <ArboretumView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
