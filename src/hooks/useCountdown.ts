import { useEffect, useState } from 'react'

/** Đếm ngược thời gian thực (giây), dùng cho ETA kiosk */
export function useCountdown(initialSeconds: number, active = true) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!active || seconds <= 0) return
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [active, seconds])

  return seconds
}

export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Lấy giây từ chuỗi "2-5" → dùng số đầu cho countdown */
export function etaRangeToSeconds(etaRange: string): number {
  const m = etaRange.match(/(\d+)/)
  const min = m ? parseInt(m[1], 10) : 3
  return min * 60
}
