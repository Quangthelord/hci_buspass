export function formatClock12(minutesFromNow: number): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + minutesFromNow)
  let h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'pm' : 'am'
  h = h % 12 || 12
  return `${h}:${m}${ampm}`
}

export function formatTimeRange(startMin: number, durationMin: number): string {
  return `${formatClock12(startMin)} - ${formatClock12(startMin + durationMin)}`
}

export function formatDepartLabel(): string {
  const d = new Date()
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  const day = d.getDate()
  const month = d.toLocaleString('en', { month: 'short' })
  const year = d.getFullYear()
  return `Depart ${h12}:${m}${ampm} ${day} ${month}, ${year}`
}

export function totalWalkM(before: number, after: number): number {
  return before + after
}
