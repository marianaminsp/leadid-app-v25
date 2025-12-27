"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Camera, Upload, Key, AlertCircle } from "lucide-react"
import { SpecimenModal } from "@/components/specimen-modal"
import { LoadingAnimation } from "@/components/loading-animation"

const STORAGE_KEY = "leaf_id_api_key"
const COLLECTION_KEY = "leaf_id_collection"

const DEVELOPMENT_LOG = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                     LEAF ID APP - VERSION 1.0 SNAPSHOT                       ║
║                        FULLY FUNCTIONAL CORE LOCKED IN                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

PROJECT SCOPE:
- Designer in Latin America (Argentina) building plant identification app
- Responsive web app with Scan, Herbarium (Gallery), and Arboretum (Map) tabs
- AI-powered plant identification using Gemini API
- Save plants to local collection with GPS coordinates

═════════════════════════════════════════════════════════════════════════════════
WORKING API CONFIGURATION (MISSION CRITICAL):
═════════════════════════════════════════════════════════════════════════════════

✅ Model: gemini-flash-latest (NOT gemini-1.5-flash, NOT gemini-2.0-flash)
✅ API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent
✅ API Version: v1beta (NOT v1)
✅ Transport: Direct fetch() from browser (NO @google/generative-ai library)
✅ Key Management: apiKey.trim() is MANDATORY to remove whitespace
✅ Key Storage: localStorage persistence with STORAGE_KEY = "leaf_id_api_key"
✅ Auth Method: Browser demo mode (user pastes API key in UI input field)

═════════════════════════════════════════════════════════════════════════════════
DATA SCHEMA (EXACT GEMINI RESPONSE):
═════════════════════════════════════════════════════════════════════════════════

JSON Fields Expected from Gemini:
{
  "commonName": "English common name",
  "scientificName": "Genus species (with italics)",
  "origin": "Geographic native region",
  "botanicalProperties": "Detailed medicinal/ecological info (2-3 sentences)"
}

Gemini Prompt Template:
'Identify this plant and return the result as JSON with these exact fields:
{ "commonName": "...", "scientificName": "...", "origin": "...", "botanicalProperties": "..." }'

═════════════════════════════════════════════════════════════════════════════════
IMAGE PROCESSING (CRITICAL):
═════════════════════════════════════════════════════════════════════════════════

✅ Image Encoding: Base64 from FileReader.readAsDataURL()
✅ Base64 Data: Split on "," to extract data portion (without mime prefix)
✅ MIME Type: Detected from File.type (e.g., "image/jpeg", "image/png")
✅ Request Structure:
   {
     "contents": [{
       "parts": [
         { "text": "Gemini prompt here" },
         { "inline_data": { "mime_type": "image/jpeg", "data": "base64string" } }
       ]
     }]
   }
✅ Size Warnings: Images >500KB trigger console warnings (localStorage limits)

═════════════════════════════════════════════════════════════════════════════════
SAVE TO COLLECTION FLOW (GPS + REVERSE GEOCODING):
═════════════════════════════════════════════════════════════════════════════════

1. User clicks "Save to My Collection" button
2. Request GPS coordinates with { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
3. If GPS success:
   - Reverse geocode using Nominatim: https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json
   - Extract: neighbourhood > suburb > city > town (fallback: "Unknown Location")
   - Save specimen with coordinates and location name
4. If GPS timeout/denied (FALLBACK - DON'T STOP SAVE):
   - Save specimen anyway with coordinates: null
   - location: "Location not available"
5. Store in localStorage["leaf_id_collection"] as JSON array
6. Dispatch CustomEvent("leaf_id_collection_updated") to notify other components
7. Show success toast for 2 seconds, then close modal

═════════════════════════════════════════════════════════════════════════════════
ARBORETUM MAP IMPLEMENTATION:
═════════════════════════════════════════════════════════════════════════════════

✅ Map Library: None (removed Leaflet due to SSR incompatibility)
✅ Map Solution: Embedded OpenStreetMap iframe with HTML overlay markers
✅ Iframe Source: https://www.openstreetmap.org/export/embed.html?bbox={bbox}&layer=mapnik
✅ BBox Format: lon1,lat1,lon2,lat2 (example: -58.40,-34.65,-58.38,-34.60)
✅ Map Center: Auto-calculate average of all saved specimens
✅ Fallback Center: Buenos Aires (-34.6037, -58.3816) if no specimens
✅ Markers: Custom circular photo thumbnails with white border (14px size)
✅ Marker Positioning: CSS top/left as percentage within iframe container
✅ Coordinate Conversion: latLngToPixel() function accounts for bbox offset
✅ Interaction: Click marker to open botanical card modal

═════════════════════════════════════════════════════════════════════════════════
ROUTE STRUCTURE & COMPONENTS:
═════════════════════════════════════════════════════════════════════════════════

/app/layout.tsx - Root layout with fonts and globals
/app/page.tsx - Main app wrapper with tab navigation state
/app/globals.css - Tailwind + design tokens (liquid glass, colors)

/components/header.tsx - Top header with Leaf ID logo
/components/bottom-nav.tsx - Bottom navigation (Herbarium | Scan | Arboretum)
/components/scan-view.tsx - THIS FILE: Camera/upload + API key input
/components/specimen-modal.tsx - Botanical card modal with save button
/components/herbarium-view.tsx - Gallery grid of saved plants
/components/arboretum-view.tsx - Map view with GPS markers
/components/loading-animation.tsx - Botanical leaf animation during AI thinking

═════════════════════════════════════════════════════════════════════════════════
TESTED SUCCESSFUL SCENARIOS:
═════════════════════════════════════════════════════════════════════════════════

✅ Scan: Upload an image → Gemini identifies plant → Shows botanical card
✅ Save: Click "Save to Collection" → Gets GPS → Saves to localStorage
✅ GPS Fallback: Geolocation denied → Saves without coordinates anyway
✅ Map: New specimen → CustomEvent fires → Arboretum updates without refresh
✅ Herbarium: Gallery grid loads all saved plants from localStorage
✅ Tab Navigation: Smooth transitions between Scan/Arboretum/Herbarium
✅ API Key: Persists across page refresh using localStorage
✅ Error Handling: Full error objects displayed on screen for debugging

═════════════════════════════════════════════════════════════════════════════════
FAILED APPROACHES (DON'T REPEAT):
═════════════════════════════════════════════════════════════════════════════════

❌ @google/generative-ai library - Library compatibility issues with Next.js
❌ v1 endpoint with gemini-1.5-flash - Returns 404 NOT_FOUND
❌ v1beta with gemini-1.5-flash - Model not available in free tier
❌ User-Agent headers in fetch - Google blocks browser requests with them
❌ Leaflet + react-leaflet - SSR incompatibility, window undefined errors
❌ Manual URL construction with variables - Use template literals properly
❌ Not trimming API key - Extra whitespace breaks authentication
❌ Saving GPS promise without fallback - Geolocation timeout breaks save flow

═════════════════════════════════════════════════════════════════════════════════
KNOWN LIMITATIONS & NOTES:
═════════════════════════════════════════════════════════════════════════════════

- Free tier gemini-flash-latest has rate limits (429 errors if hammering API)
- Reverse geocoding (Nominatim) has accuracy limitations in rural areas
- localStorage has ~5MB limit per domain (compress images if needed)
- Map bbox hardcoded as ±0.02° (roughly 2km radius) - adjust as needed
- Browser geolocation requires HTTPS in production
- API key stored in browser (acceptable for demo mode, not production)

═════════════════════════════════════════════════════════════════════════════════
NEXT PHASE: AESTHETIC POLISH
═════════════════════════════════════════════════════════════════════════════════

Ready to apply:
✓ Liquid Glass effects (backdrop-filter blur, borders, shadows)
✓ Airbnb animation standards (Framer Motion transitions)
✓ Nature-inspired color refinement
✓ Typography polish (serif headings, sans body)

BACKUP CREATED: VERSION_1_0_FUNCTIONAL_BACKUP as reference for entire working core
`

export function ScanView() {
  const [apiKey, setApiKey] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [identifiedSpecimen, setIdentifiedSpecimen] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY)
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    if (value.trim()) {
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  const handleImageSelect = async (file: File) => {
    if (!apiKey.trim()) {
      alert("Please enter your Gemini API key first to identify plants.")
      return
    }

    setError(null)

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result as string
      setSelectedImage(base64Image)
      setIsLoading(true)

      try {
        const trimmedKey = apiKey.trim()
        console.log("[v0] Using Key:", trimmedKey.substring(0, 5) + "...")

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${trimmedKey}`

        const base64Data = base64Image.split(",")[1]

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Identify this plant and return the result as JSON with these exact fields:
{
  "commonName": "Common name of the plant",
  "scientificName": "Scientific name in italics",
  "origin": "Geographic origin or native region",
  "botanicalProperties": "Detailed medicinal, ecological, or botanical information (2-3 sentences)"
}`,
                  },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`)
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"

        console.log("[v0] Gemini response:", text)

        let parsedData
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0])
          }
        } catch (e) {
          console.log("[v0] JSON parsing failed, using text parsing fallback")
        }

        const commonName =
          parsedData?.commonName || text.match(/Common Name[:\\s]+(.+?)(?:\\n|$)/i)?.[1]?.trim() || "Unknown Plant"
        const scientificName =
          parsedData?.scientificName ||
          text
            .match(/Scientific Name[:\\s]+(.+?)(?:\\n|$)/i)?.[1]
            ?.trim()
            .replace(/\*/g, "") ||
          "Unknown Species"
        const origin = parsedData?.origin || "Unknown Origin"
        const botanicalProperties = parsedData?.botanicalProperties || "Botanical information being processed..."

        setIdentifiedSpecimen({
          commonName,
          scientificName,
          image: base64Image,
          origin,
          botanicalProperties,
        })

        setIsLoading(false)
        setShowModal(true)
      } catch (error: any) {
        console.error("[v0] Error identifying leaf:", error)
        const errorMessage = error?.message || "Unknown error"
        const errorDetails = JSON.stringify(error, null, 2)
        setError(`Error: ${errorMessage}\n\nFull details:\n${errorDetails}`)
        setIsLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleScanClick = () => {
    cameraInputRef.current?.click()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  return (
    <div className="flex min-h-full flex-col px-6 py-8">
      <div className="mb-6 glass rounded-2xl px-6 py-4 border border-black/5">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Key className="text-[#6B6558]" size={20} />
          <input
            type="password"
            placeholder="Enter your Gemini API Key (saved securely in browser)"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="flex-1 rounded-lg border border-black/10 glass px-4 py-2 text-sm text-[#2a2420] placeholder:text-[#8B8678]/60 focus:border-[#6aa84f] focus:outline-none focus:ring-2 focus:ring-[#6aa84f]/20 transition-all duration-200"
          />
          <span className="text-xs text-[#6B6558] font-medium">Demo Mode</span>
        </div>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="flex flex-1 flex-col items-center justify-center py-12">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <>
            {error && (
              <div className="mb-6 w-full max-w-2xl rounded-xl glass border-2 border-red-400 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 flex-shrink-0 text-red-600" size={20} />
                  <div className="flex-1">
                    <h3 className="mb-2 font-semibold text-red-800">Identification Error</h3>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-red-700 font-mono">{error}</pre>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 transition-colors">
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="mb-8 flex items-center gap-3">
              <div className="text-[#8B8678]">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 5C20 5 15 8 15 15C15 22 20 25 20 25C20 25 25 22 25 15C25 8 20 5 20 5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M15 20C10 20 8 23 8 28C8 33 12 35 15 35" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    d="M25 20C30 20 32 23 32 28C32 33 28 35 25 35"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="h-12 w-px bg-[#8B8678]/30" />
              <div className="text-[#8B8678]">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 5C20 5 15 8 15 15C15 22 20 25 20 25C20 25 25 22 25 15C25 8 20 5 20 5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path d="M15 20C10 20 8 23 8 28C8 33 12 35 15 35" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path
                    d="M25 20C30 20 32 23 32 28C32 33 28 35 25 35"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-3 text-center font-serif text-4xl text-[#2a2420]">Identify Your Leaf</h1>
            <p className="mb-12 text-center text-[#6B6558] text-balance">
              Take a photo or upload an image to discover the tree species
            </p>

            <div className="mb-6 flex items-center gap-8">
              <div className="h-px w-24 bg-[#8B8678]/30" />
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-[#8B8678]/30" />
                <div className="h-2 w-2 rounded-full bg-[#8B8678]" />
                <div className="h-2 w-2 rounded-full bg-[#8B8678]/30" />
              </div>
              <div className="h-px w-24 bg-[#8B8678]/30" />
            </div>

            <div className="mb-6 w-full max-w-md rounded-xl border-2 border-dashed border-[#8B8678]/40 glass p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                {selectedImage ? (
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected leaf"
                    className="max-h-48 w-full rounded-xl object-contain shadow-lg"
                  />
                ) : (
                  <>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full glass-dark">
                      <Camera className="text-white" size={36} />
                    </div>
                    <p className="text-center text-[#6B6558]">No specimen selected</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex w-full max-w-md gap-4">
              <button
                onClick={handleScanClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl glow-button px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Camera size={20} />
                Scan Leaf
              </button>
              <button
                onClick={handleUploadClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl glass-dark border border-black/10 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <Upload size={20} />
                Upload Photo
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && identifiedSpecimen && (
        <SpecimenModal
          specimen={identifiedSpecimen}
          onClose={() => {
            setShowModal(false)
            setSelectedImage(null)
            setIdentifiedSpecimen(null)
          }}
          onSave={() => {
            setShowModal(false)
            setSelectedImage(null)
            setIdentifiedSpecimen(null)
          }}
        />
      )}
    </div>
  )
}
