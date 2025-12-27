"use client"
import { useEffect, useState } from "react"
import { SpecimenModal } from "@/components/specimen-modal"

interface SavedSpecimen {
  id: string
  commonName: string
  scientificName: string
  image: string
  origin: string
  botanicalProperties: string
  coordinates?: { latitude: number; longitude: number } | null
  timestamp?: string
  location?: string
}

export function ArboretumView() {
  const [specimens, setSpecimens] = useState<SavedSpecimen[]>([])
  const [selectedSpecimen, setSelectedSpecimen] = useState<SavedSpecimen | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -34.6037, lng: -58.3816 })
  const [zoom, setZoom] = useState(13)

  const loadSpecimens = () => {
    const saved = JSON.parse(localStorage.getItem("leaf_id_collection") || "[]")
    const withCoordinates = saved.filter((s: SavedSpecimen) => s.coordinates)
    setSpecimens(withCoordinates)

    if (withCoordinates.length > 0) {
      const avgLat =
        withCoordinates.reduce((sum: number, s: SavedSpecimen) => sum + s.coordinates!.latitude, 0) /
        withCoordinates.length
      const avgLng =
        withCoordinates.reduce((sum: number, s: SavedSpecimen) => sum + s.coordinates!.longitude, 0) /
        withCoordinates.length
      setMapCenter({ lat: avgLat, lng: avgLng })
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        () => {
          // Keep default center if geolocation fails
        },
      )
    }
  }

  useEffect(() => {
    loadSpecimens()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "leaf_id_collection") {
        loadSpecimens()
      }
    }

    const handleCustomUpdate = () => {
      loadSpecimens()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("leaf_id_collection_updated", handleCustomUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("leaf_id_collection_updated", handleCustomUpdate)
    }
  }, [])

  const latLngToPixel = (lat: number, lng: number) => {
    // Calculate the bbox from the iframe
    const bboxWidth = 0.04 // Total longitude span in the iframe
    const bboxHeight = 0.04 // Total latitude span in the iframe

    // Calculate relative position within the bbox
    const relX = (lng - (mapCenter.lng - 0.02)) / bboxWidth
    const relY = (mapCenter.lat + 0.02 - lat) / bboxHeight

    // Convert to percentage (0-100)
    const x = relX * 100
    const y = relY * 100

    // Clamp values to keep markers on screen
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    }
  }

  const handleMarkerClick = (specimen: SavedSpecimen) => {
    setSelectedSpecimen(specimen)
  }

  return (
    <div className="px-6 py-8">
      <h1 className="mb-2 font-serif text-4xl text-[#2a2420]">The Arboretum</h1>
      <p className="mb-6 text-[#6B6558]">Explore where you found each leaf</p>

      <div className="relative h-[calc(100vh-250px)] overflow-hidden rounded-2xl glass shadow-lg border border-black/10">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.02},${mapCenter.lat - 0.02},${mapCenter.lng + 0.02},${mapCenter.lat + 0.02}&layer=mapnik`}
          className="w-full h-full border-0"
          title="Map"
        />

        <div className="absolute inset-0 pointer-events-none">
          {specimens.map((specimen) => {
            if (!specimen.coordinates) return null

            const pos = latLngToPixel(specimen.coordinates.latitude, specimen.coordinates.longitude)

            return (
              <button
                key={specimen.id}
                onClick={() => handleMarkerClick(specimen)}
                className="absolute pointer-events-auto transition-transform hover:scale-110 active:scale-95"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -100%)",
                  transformOrigin: "center bottom",
                }}
                aria-label={`View ${specimen.commonName}`}
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-3 border-white shadow-xl glass">
                  <img
                    src={specimen.image || "/placeholder.svg"}
                    alt={specimen.commonName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            )
          })}
        </div>

        {specimens.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center glass pointer-events-none border border-black/10">
            <div className="text-center px-6 bg-white/60 backdrop-blur-md rounded-2xl p-6">
              <p className="text-[#2a2420] font-medium mb-2">No specimens with location data yet</p>
              <p className="text-[#6B6558] text-sm">Scan and save plants to see them on the map</p>
            </div>
          </div>
        )}
      </div>
      {selectedSpecimen && <SpecimenModal specimen={selectedSpecimen} onClose={() => setSelectedSpecimen(null)} />}
    </div>
  )
}
