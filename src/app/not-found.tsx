'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [secretFound, setSecretFound] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleSecretClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 3) {
      setSecretFound(true)
      setClickCount(0)
    }

    setTimeout(() => setClickCount(0), 1000)
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center px-6 text-center bg-linear-to-b from-slate-50 to-slate-100">
      {/* 🌟 Easter Egg Trigger */}
      <div
        className="text-7xl mb-4 select-none cursor-pointer"
        onClick={handleSecretClick}
        title="👀"
      >
        😵
      </div>

      {!secretFound ? (
        <>
          <h1 className="text-3xl font-bold text-slate-800">Algo salió mal...</h1>
          <p className="mt-2 max-w-md text-base text-slate-600">
            Ocurrió un error inesperado mientras cargábamos esta página.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-500 transition-colors"
            >
              Reintentar
            </button>

            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-slate-700 text-white font-medium shadow-lg hover:bg-slate-600 transition-colors"
            >
              Inicio
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* 🥚 Easter Egg Content */}
          <h2 className="text-2xl font-bold text-blue-600 animate-pulse">
            🎉 ¡Receta Secreta Encontrada!
          </h2>
          <p className="mt-2 text-lg text-slate-700 max-w-md">
            “Pan Tostado Deluxe” 🥖✨ Ingredientes: pan, mantequilla… ¡y actitud!
          </p>

          <button
            onClick={() => setSecretFound(false)}
            className="mt-6 px-6 py-3 bg-green-600 rounded-full text-white font-medium shadow-lg hover:bg-green-500 transition-colors"
          >
            Guardar en mi recetario 💾
          </button>

          <p
            className="mt-4 text-sm cursor-pointer text-slate-500 hover:underline"
            onClick={() => setSecretFound(false)}
          >
            Volver al error
          </p>
        </>
      )}
    </main>
  )
}
