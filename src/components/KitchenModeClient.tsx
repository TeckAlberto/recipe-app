'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { type RecipeWithSteps } from '@/app/kitchen/[id]/page'
import ReactMarkdown from 'react-markdown'

type Props = {
  recipe: RecipeWithSteps
}

export default function KitchenModeClient({ recipe }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [, setIsFullscreen] = useState(false)

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

  const goToNextStep = useCallback(() => {
    if (currentStepIndex < recipe.steps.length - 1) setCurrentStepIndex((s) => s + 1)
  }, [currentStepIndex, recipe.steps.length])

  const goToPrevStep = useCallback(() => {
    if (currentStepIndex > 0) setCurrentStepIndex((s) => s - 1)
  }, [currentStepIndex])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-linear-to-b from-slate-50 to-slate-100 px-4 py-6">
      <div
        id="video-container"
        className="w-full max-w-3xl transition-all duration-300 rounded-lg overflow-hidden"
      >
        <KitchenVideoPlayer
          key={currentStep.id}
          currentStep={currentStep}
          onNextStep={goToNextStep}
          onPrevStep={goToPrevStep}
          isLastStep={currentStepIndex === recipe.steps.length - 1}
          setIsFullscreen={setIsFullscreen}
        />
      </div>

      <div className="w-full max-w-3xl flex-1 overflow-y-auto mt-4">
        <div className="rounded-lg border border-slate-300 bg-white p-4 shadow-inner animate-fadeSlideUp transition-all duration-300">
          <div className="prose prose-lg max-w-none text-slate-800">
            <ReactMarkdown key={currentStep.id}>{currentStep.instructions}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 py-2 mt-4">
        {recipe.steps.map((_, idx) => (
          <span
            key={idx}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              idx === currentStepIndex ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6 pointer-events-none">
        <button
          onClick={goToPrevStep}
          disabled={currentStepIndex === 0}
          className="rounded-full bg-slate-700 px-5 py-3 text-lg font-medium text-white
             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600
             transition-colors shadow-lg
             focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Paso anterior"
        >
          ◀
        </button>
        <button
          onClick={goToNextStep}
          disabled={currentStepIndex === recipe.steps.length - 1}
          className="rounded-full bg-blue-600 px-5 py-3 text-lg font-medium text-white
             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500
             transition-colors shadow-lg
             focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Siguiente paso"
        >
          ▶
        </button>
      </div>
    </div>
  )
}

function KitchenVideoPlayer({
  currentStep,
  onNextStep,
  onPrevStep,
  isLastStep,
  setIsFullscreen,
}: {
  currentStep: { id: string; video_clip_url: string; step_number?: number }
  onNextStep: () => void
  onPrevStep: () => void
  isLastStep: boolean
  setIsFullscreen: (v: boolean) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [, setDuration] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    if (!controlsVisible || !isPlaying) return
    const t = setTimeout(() => setControlsVisible(false), 3000)
    return () => clearTimeout(t)
  }, [controlsVisible, isPlaying])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    v.muted = true
    v.currentTime = 0
    const playPromise = v.play()

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          setIsPlaying(!v.paused)
          setMuted(v.muted)
          setVolume(v.volume)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }, [currentStep.id])

  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration || Number.isNaN(v.duration)) return
    setProgress((v.currentTime / v.duration) * 100)
    setDuration(v.duration)
  }

  const togglePlay = useCallback(async () => {
    const v = videoRef.current
    if (!v) return
    try {
      if (v.paused) {
        await v.play()
        setIsPlaying(true)
      } else {
        v.pause()
        setIsPlaying(false)
      }
      setControlsVisible(true)
    } catch {}
  }, [])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    setControlsVisible(true)
  }, [])

  const onVolumeChange = useCallback((val: number) => {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    setVolume(val)
    setMuted(val === 0)
    setControlsVisible(true)
  }, [])

  const seekTo = (percent: number) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    v.currentTime = (percent / 100) * v.duration
    setProgress(percent)
  }

  const handleProgressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    seekTo(val)
  }

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
    setControlsVisible(true)
  }, [setIsFullscreen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'ArrowRight') {
        const v = videoRef.current
        if (v && v.duration) {
          v.currentTime = Math.min(v.currentTime + 5, v.duration)
        }
      } else if (e.key === 'ArrowLeft') {
        const v = videoRef.current
        if (v && v.duration) {
          v.currentTime = Math.max(v.currentTime - 5, 0)
        }
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute()
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen()
      } else if (e.key === 'ArrowUp') {
        onVolumeChange(Math.min(volume + 0.1, 1))
      } else if (e.key === 'ArrowDown') {
        onVolumeChange(Math.max(volume - 0.1, 0))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePlay, toggleMute, toggleFullscreen, volume, onVolumeChange])

  const onEnded = () => {
    setIsEnded(true)
    setIsPlaying(false)
    setControlsVisible(true)
  }

  const handleUserActivity = () => {
    setControlsVisible(true)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-lg"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
    >
      <video
        key={currentStep.id}
        ref={videoRef}
        className="w-full h-full object-cover bg-black"
        src={currentStep.video_clip_url}
        controls={false}
        onTimeUpdate={onTimeUpdate}
        onClick={togglePlay}
        onEnded={onEnded}
        playsInline
        muted={muted}
      />

      <div
        className={
          'absolute inset-0 pointer-events-none bg-linear-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300'
        }
        aria-hidden
      />

      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <input
          aria-label="Barra de progreso"
          type="range"
          value={progress}
          min={0}
          max={100}
          onChange={handleProgressInput}
          className="w-full h-1 accent-blue-500 cursor-pointer appearance-none"
        />

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
            >
              <span className="text-2xl">{isPlaying ? '❚❚' : '▶'}</span>
            </button>

            <button
              onClick={toggleMute}
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
            >
              {muted ? '🔇' : '🔊'}
            </button>

            <input
              aria-label="Volumen"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-24 h-1 accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPrevStep}
              aria-label="Paso anterior"
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
            >
              ⏮
            </button>

            <button
              onClick={onNextStep}
              aria-label="Siguiente paso"
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
              disabled={isLastStep}
            >
              ⏭
            </button>

            <button
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>

      {!isEnded && !isPlaying && controlsVisible && (
        <button
          onClick={onNextStep}
          aria-label="Siguiente paso pequeño"
          className="absolute bottom-4 right-4 z-20 rounded-full bg-blue-600 px-3 py-2 text-white text-sm shadow-lg hover:bg-blue-500 transition"
        >
          Siguiente
        </button>
      )}

      {isEnded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <button
            onClick={() => {
              onNextStep()
            }}
            aria-label="Siguiente paso grande"
            className="pointer-events-auto rounded-full bg-blue-600 px-6 py-4 text-white text-lg font-semibold shadow-2xl hover:bg-blue-500 transition transform-gpu"
          >
            Siguiente paso ▶
          </button>
        </div>
      )}

      <div className="sr-only" aria-hidden>
        Video controls available: Space(play/pause), ArrowLeft/Right seek, M mute, F fullscreen
      </div>
    </div>
  )
}
