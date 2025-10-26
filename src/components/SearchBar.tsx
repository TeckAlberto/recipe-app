'use client'

import { useState, useEffect, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'

export default function SearchBar() {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [text, setText] = useState(searchParams.get('q') || '')
  const [debouncedText] = useDebounce(text, 300)

  useEffect(() => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (debouncedText) params.set('q', debouncedText)
      else params.delete('q')
      replace(`${pathname}?${params.toString()}`)
    })
  }, [debouncedText, pathname, replace, searchParams])

  return (
    <div className="relative w-full max-w-md mb-8 mx-auto">
      <input
        type="text"
        placeholder="Buscar receta por nombre..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 pl-10 text-lg text-white bg-gray-800 border border-gray-700 rounded-lg
             focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
             focus-visible:ring-offset-slate-900"
      />

      {/* Ícono de lupa */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
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

      {/* Spinner */}
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div
            className="h-5 w-5 animate-spin rounded-full
                border-2 border-slate-300
                border-t-2 border-t-blue-500"
          ></div>
        </div>
      )}
    </div>
  )
}
