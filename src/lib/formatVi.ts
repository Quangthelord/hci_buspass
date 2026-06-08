/** 24-hour clock — e.g. 14:32 */
export function formatTime24(date: Date): string {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/** Thousands with commas — e.g. 1,234 */
export function formatNumberVi(n: number): string {
  return n.toLocaleString('en-US')
}

export function formatDistanceM(m: number): string {
  return `${formatNumberVi(Math.round(m))}m`
}

export function formatMinutes(n: number): string {
  return `${formatNumberVi(n)} phút`
}

export function formatDelayStatus(delayMin: number): string {
  if (delayMin <= 0) return 'Đúng lịch'
  return `Trễ ${formatNumberVi(delayMin)} phút`
}

export function formatRouteLabel(routeId: string): string {
  return `Tuyến ${routeId}`
}

export function formatStopLabel(name: string): string {
  if (name.toLowerCase().startsWith('bến ') || name.toLowerCase().startsWith('ben ')) {
    return name
  }
  return `Bến ${name}`
}
