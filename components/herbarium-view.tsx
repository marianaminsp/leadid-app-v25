"use client"

import { useState, useEffect } from "react"
import { SpecimenModal } from "@/components/specimen-modal"

const specimens = [
  {
    id: "1",
    commonName: "Paper Birch",
    scientificName: "Betula papyrifera",
    image: "/images/captura-20de-20pantalla-202025-12-23-20a-20las-209.png",
    nativeRegion: "Native to northern North America",
    properties: ["Deciduous", "White bark", "Cold hardy", "Pioneer species"],
  },
  {
    id: "2",
    commonName: "Sugar Maple",
    scientificName: "Acer saccharum",
    image: "/sugar-maple-leaf-autumn.jpg",
    nativeRegion: "Native to eastern North America",
    properties: ["Deciduous", "Maple syrup", "Fall color", "Long-lived"],
  },
  {
    id: "3",
    commonName: "White Oak",
    scientificName: "Quercus alba",
    image: "/images/captura-20de-20pantalla-202025-12-23-20a-20las-209.png",
    nativeRegion: "Native to eastern and central North America",
    properties: ["Deciduous", "Long-lived", "Wildlife habitat", "Strong wood"],
  },
  {
    id: "4",
    commonName: "Paper Birch",
    scientificName: "Betula papyrifera",
    image: "/paper-birch-trees-forest.jpg",
    nativeRegion: "Native to northern North America",
    properties: ["Deciduous", "White bark", "Cold hardy", "Pioneer species"],
  },
]

export function HerbariumView() {
  const [selectedSpecimen, setSelectedSpecimen] = useState<any>(null)
  const [savedSpecimens, setSavedSpecimens] = useState<any[]>([])

  useEffect(() => {
    const loadSavedSpecimens = () => {
      const saved = JSON.parse(localStorage.getItem("leaf_id_collection") || "[]")
      setSavedSpecimens(saved)
    }

    loadSavedSpecimens()

    window.addEventListener("storage", loadSavedSpecimens)
    return () => window.removeEventListener("storage", loadSavedSpecimens)
  }, [])

  const handleSpecimenSaved = () => {
    const saved = JSON.parse(localStorage.getItem("leaf_id_collection") || "[]")
    setSavedSpecimens(saved)
  }

  const allSpecimens = [...savedSpecimens.reverse(), ...specimens]

  return (
    <div className="px-6 py-8">
      <h1 className="mb-2 font-serif text-4xl text-white">My Herbarium</h1>
      <p className="mb-8 text-white/80">
        Your collection of identified leaves {savedSpecimens.length > 0 && `(${savedSpecimens.length} saved)`}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
        {allSpecimens.map((specimen, index) => (
          <button
            key={specimen.id || index}
            onClick={() => setSelectedSpecimen(specimen)}
            className="group overflow-hidden rounded-2xl glass shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={specimen.image || "/placeholder.svg"}
                alt={specimen.commonName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-left bg-black/30 backdrop-blur-sm">
              <h3 className="mb-1 font-serif text-xl text-white">{specimen.commonName}</h3>
              <p className="text-sm text-white/80">{specimen.scientificName}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedSpecimen && (
        <SpecimenModal
          specimen={selectedSpecimen}
          onClose={() => setSelectedSpecimen(null)}
          onSave={handleSpecimenSaved}
        />
      )}
    </div>
  )
}
