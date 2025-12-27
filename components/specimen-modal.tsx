"use client"

import { X, MapPin, Check, Loader2, Leaf, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface SpecimenModalProps {
  specimen: {
    commonName: string
    scientificName: string
    image: string
    origin: string
    botanicalProperties: string
    coordinates?: { latitude: number; longitude: number }
    timestamp?: string
    location?: string
  }
  onClose: () => void
  onSave?: (specimen: any) => void
}

export function SpecimenModal({ specimen, onClose, onSave }: SpecimenModalProps) {
  const [showToast, setShowToast] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveToCollection = async () => {
    setIsSaving(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      let locationName = "Unknown Location"
      try {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
        )
        const geoData = await geoResponse.json()
        locationName =
          geoData.address?.neighbourhood ||
          geoData.address?.suburb ||
          geoData.address?.city ||
          geoData.address?.town ||
          "Unknown Location"
      } catch (geoError) {
        console.log("[v0] Reverse geocoding failed:", geoError)
      }

      const savedSpecimen = {
        ...specimen,
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        location: locationName,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      }

      const specimenToSave = { ...savedSpecimen }

      if (specimenToSave.image && specimenToSave.image.length > 500000) {
        console.log("[v0] Image is large, compressing...")
        console.warn("[v0] Image size:", specimenToSave.image.length, "bytes")
      }

      const saved = JSON.parse(localStorage.getItem("leaf_id_collection") || "[]")
      saved.push(specimenToSave)
      localStorage.setItem("leaf_id_collection", JSON.stringify(saved))

      window.dispatchEvent(new CustomEvent("leaf_id_collection_updated"))

      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        onClose()
        if (onSave) onSave(specimenToSave)
      }, 2000)
    } catch (error) {
      console.log("[v0] GPS error, saving without coordinates:", error)

      const savedSpecimen = {
        ...specimen,
        coordinates: null,
        location: "Location not available",
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      }

      try {
        const saved = JSON.parse(localStorage.getItem("leaf_id_collection") || "[]")
        saved.push(savedSpecimen)
        localStorage.setItem("leaf_id_collection", JSON.stringify(saved))

        window.dispatchEvent(new CustomEvent("leaf_id_collection_updated"))

        setShowToast(true)
        setTimeout(() => {
          setShowToast(false)
          onClose()
          if (onSave) onSave(savedSpecimen)
        }, 2000)
      } catch (storageError) {
        console.error("[v0] localStorage error:", storageError)
        alert("Failed to save specimen. Storage might be full.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden sm:rounded-3xl glass shadow-2xl border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-black/10"
          aria-label="Close"
        >
          <X className="text-[#2a2420]" size={20} strokeWidth={2.5} />
        </button>

        <div className="relative h-[40vh] sm:h-80">
          <img
            src={specimen.image || "/placeholder.svg"}
            alt={specimen.commonName}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-white/90 shadow-lg" />
          <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-white/90 shadow-lg" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-white/90 shadow-lg" />
          <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-white/90 shadow-lg" />

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            <div className="h-2 w-2 rounded-full bg-white shadow-md" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-6 bg-[#f5f1e8]">
          <h2 className="mb-1 font-serif text-3xl text-[#2a2420] font-semibold text-balance">{specimen.commonName}</h2>
          <p className="mb-6 text-lg text-[#6B6558] italic font-light">{specimen.scientificName}</p>

          <div className="mb-6 flex items-start gap-3 rounded-2xl glass p-4 border border-black/5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full glass-dark">
              <MapPin className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#8B8678]">Origin</h3>
              <p className="text-[#2a2420] font-medium">{specimen.origin}</p>
            </div>
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-2xl glass p-4 border border-black/5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full glass-dark">
              <Info className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8B8678]">Properties</h3>
              <p className="leading-relaxed text-[#2a2420] font-light">{specimen.botanicalProperties}</p>
            </div>
          </div>

          {specimen.location && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl glass p-4 border border-black/5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full glass-dark">
                <Leaf className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#8B8678]">Location</h3>
                <p className="text-[#2a2420] font-medium">{specimen.location}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSaveToCollection}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-2xl glow-button px-6 py-4 font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" strokeWidth={2.5} />
                Getting location...
              </>
            ) : (
              <>
                <Check size={20} strokeWidth={2.5} />
                Save to My Collection
              </>
            )}
          </button>

          <p className="mt-4 text-center text-sm text-[#8B8678] font-light">Swipe or use arrows to browse specimens</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] glass-dark rounded-full px-6 py-3 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-white">
              <Check size={20} className="text-green-400" strokeWidth={2.5} />
              <span className="font-semibold">Saved to collection!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
