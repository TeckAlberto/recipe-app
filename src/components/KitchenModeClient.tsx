'use client'

import { useState, useEffect } from 'react'
import { type RecipeWithSteps } from '@/app/kitchen/[id]/page'

type Props = {
  recipe: RecipeWithSteps
}

export default function KitchenModeClient({ recipe }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await (navigator as Navigator).wakeLock.request('screen')
        } catch {}
      }
    }

    requestWakeLock()

    return () => {
      if (wakeLock) wakeLock.release().then(() => (wakeLock = null))
    }
  }, [])

  const currentStep = recipe.steps[currentStepIndex]

  const goToNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) setCurrentStepIndex(currentStepIndex + 1)
  }

  const goToPrevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1)
  }

  return (
    <div className="relative flex h-screen w-full flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Contenedor Video */}
      <div className="relative flex h-2/5 w-full items-center justify-center overflow-hidden bg-slate-900 shadow-lg">
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold transition-opacity duration-300">
          Video para: {currentStep.video_clip_url}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-inner transition-all duration-300">
          <p className="text-lg leading-relaxed text-slate-800">{currentStep.instructions}</p>
        </div>
      </div>

      {/* Indicador de pasos (dots) */}
      <div className="flex justify-center gap-2 py-2">
        {recipe.steps.map((_, idx) => (
          <span
            key={idx}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              idx === currentStepIndex ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      {/* Botones flotantes */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
        <button
          onClick={goToPrevStep}
          disabled={currentStepIndex === 0}
          className="rounded-full bg-slate-700 px-5 py-3 text-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          ◀
        </button>
        <button
          onClick={goToNextStep}
          disabled={currentStepIndex === recipe.steps.length - 1}
          className="rounded-full bg-blue-600 px-5 py-3 text-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
