'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function SearchBar() {
  const { replace } = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleSearch(term: string) {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (term) params.set('q', term)
      else params.delete('q')
      replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="relative mb-8 w-full max-w-md mx-auto">
      {/* Input con gradiente y animación */}
      <input
        type="text"
        placeholder="Buscar receta por nombre..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-4 pl-12 text-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 shadow-md transition-all duration-300 hover:scale-[1.01]"
      />

      {/* Ícono de lupa */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>

      {/* Spinner moderno */}
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-blue-500 border-b-2 border-slate-400"></div>
        </div>
      )}
    </div>
  )
}
