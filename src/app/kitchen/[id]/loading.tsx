export default function KitchenLoading() {
  return (
    <div className="relative flex h-screen w-full flex-col bg-linear-to-b from-slate-50 to-slate-100 p-4 gap-4">
      {/* Skeleton Video */}
      <div className="w-full aspect-video bg-slate-300 rounded-lg animate-pulse" />

      {/* Skeleton Instrucciones */}
      <div className="flex-1 p-4 border border-slate-300 rounded-lg bg-white shadow-inner space-y-3">
        <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-[60%] bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Skeleton Step Dots */}
      <div className="flex justify-center gap-2">
        <div className="h-3 w-3 bg-slate-300 rounded-full animate-pulse" />
        <div className="h-3 w-3 bg-slate-300 rounded-full animate-pulse" />
        <div className="h-3 w-3 bg-slate-300 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Floating Buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
        <div className="h-12 w-24 bg-slate-300 rounded-full animate-pulse" />
        <div className="h-12 w-24 bg-slate-300 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
