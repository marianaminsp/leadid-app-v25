export function Header() {
  return (
    <header className="glass-dark px-6 py-4 relative z-10">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 3.5C14 3.5 10.5 5.6 10.5 10.5C10.5 15.4 14 17.5 14 17.5C14 17.5 17.5 15.4 17.5 10.5C17.5 5.6 14 3.5 14 3.5Z"
              stroke="#F5F1E8"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M10.5 14C7 14 5.6 16.1 5.6 19.6C5.6 23.1 8.4 24.5 10.5 24.5"
              stroke="#F5F1E8"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M17.5 14C21 14 22.4 16.1 22.4 19.6C22.4 23.1 19.6 24.5 17.5 24.5"
              stroke="#F5F1E8"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <h1 className="font-serif text-2xl text-white font-semibold">Leaf ID</h1>
          <p className="text-xs uppercase tracking-wider text-white/70 font-medium">Botanical Archive</p>
        </div>
      </div>
    </header>
  )
}
