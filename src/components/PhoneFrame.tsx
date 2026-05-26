import type { ReactNode } from 'react'

/** Khung điện thoại cho màn App mobile (Phase 4 screenshots) */
export function PhoneFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="mx-auto flex flex-col items-center">
      {label && <p className="mb-3 text-sm text-gray-500">{label}</p>}
      <div className="relative w-[320px] rounded-[2.5rem] border-4 border-gray-200 bg-black p-3 shadow-2xl">
        <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-800" />
        <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-[#0f172a]">{children}</div>
        <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}
