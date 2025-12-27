import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    // Use Gemini 2.5 Flash to identify the leaf
    const { text } = await generateText({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: image,
            },
            {
              type: "text",
              text: `Identify this tree leaf. Provide the following information in a structured format:

1. Common Name (just the name)
2. Scientific Name (just the name in italics format)
3. Native Region (where it's naturally from)
4. Key Properties (2-4 key characteristics as comma-separated tags like "Deciduous", "Cold hardy", "Fast growing")
5. Description (2 sentences about the tree's properties and characteristics)

Format your response exactly like this:
COMMON_NAME: [name]
SCIENTIFIC_NAME: [name]
NATIVE_REGION: [region]
PROPERTIES: [property1, property2, property3]
DESCRIPTION: [2 sentences]`,
            },
          ],
        },
      ],
    })

    console.log("[v0] AI Response:", text)

    // Parse the AI response
    const lines = text.split("\n").filter((line) => line.trim())
    const data: Record<string, string> = {}

    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(":")
      if (key && valueParts.length > 0) {
        data[key.trim()] = valueParts.join(":").trim()
      }
    })

    // Extract properties as array
    const properties = data.PROPERTIES?.split(",").map((p) => p.trim()) || ["Deciduous", "Native species"]

    return Response.json({
      commonName: data.COMMON_NAME || "Unknown Tree",
      scientificName: data.SCIENTIFIC_NAME || "Species unknown",
      nativeRegion: data.NATIVE_REGION || "Unknown region",
      properties: properties,
      description: data.DESCRIPTION || "Properties unavailable",
    })
  } catch (error) {
    console.error("[v0] Error in identify-leaf API:", error)
    return Response.json({ error: "Failed to identify leaf" }, { status: 500 })
  }
}
