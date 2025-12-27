"use client"

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative h-32 w-32">
        {/* Animated growing plant */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Stem */}
            <div className="absolute bottom-0 left-1/2 h-20 w-1 -translate-x-1/2 bg-[#4A5E42] origin-bottom animate-grow" />

            {/* Leaves - animated to unfold */}
            <div className="absolute left-1/2 top-8 h-8 w-8 -translate-x-1/2 origin-bottom animate-leaf-left">
              <svg viewBox="0 0 40 40" fill="none" className="text-[#5A7A4F]">
                <path
                  d="M20 5C20 5 15 8 15 15C15 22 20 25 20 25C20 25 25 22 25 15C25 8 20 5 20 5Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="absolute left-1/2 top-4 h-8 w-8 -translate-x-1/2 origin-bottom animate-leaf-right">
              <svg viewBox="0 0 40 40" fill="none" className="text-[#6B8B5F]">
                <path
                  d="M20 5C20 5 15 8 15 15C15 22 20 25 20 25C20 25 25 22 25 15C25 8 20 5 20 5Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 origin-bottom animate-leaf-center">
              <svg viewBox="0 0 40 40" fill="none" className="text-[#4A5E42]">
                <path
                  d="M20 5C20 5 15 8 15 15C15 22 20 25 20 25C20 25 25 22 25 15C25 8 20 5 20 5Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Rotating circle */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="h-full w-full rounded-full border-4 border-[#8B8678]/20 border-t-[#4A5E42]" />
        </div>
      </div>

      <div className="text-center">
        <h2 className="mb-2 font-serif text-2xl text-[#3A4A36]">Identifying Species</h2>
        <p className="text-[#6B6558]">Analyzing botanical characteristics...</p>
      </div>

      <div className="flex gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#4A5E42]" style={{ animationDelay: "0ms" }} />
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#4A5E42]" style={{ animationDelay: "200ms" }} />
        <div className="h-2 w-2 animate-pulse rounded-full bg-[#4A5E42]" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  )
}
