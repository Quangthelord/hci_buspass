/** Rung dài + tiếng kêu lặp — dừng khi gọi stopSustainedAlert(). */

const VIBRATE_PATTERN = [500, 150, 500, 150, 500, 600]
const VIBRATE_INTERVAL_MS = 2200
const BEEP_INTERVAL_MS = 1100
const BEEP_HZ = 880

let vibrateTimer: ReturnType<typeof setInterval> | null = null
let beepTimer: ReturnType<typeof setInterval> | null = null
let audioCtx: AudioContext | null = null

function playBeep() {
  if (!audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = BEEP_HZ
    gain.gain.value = 0.18
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    const t = audioCtx.currentTime
    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    osc.start(t)
    osc.stop(t + 0.25)
  } catch {
    /* optional audio */
  }
}

export function initAlertAudio(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    return audioCtx
  } catch {
    return null
  }
}

export function startSustainedAlert() {
  stopSustainedAlert()

  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(VIBRATE_PATTERN)
    vibrateTimer = setInterval(() => {
      navigator.vibrate?.(VIBRATE_PATTERN)
    }, VIBRATE_INTERVAL_MS)
  }

  initAlertAudio()
  playBeep()
  beepTimer = setInterval(playBeep, BEEP_INTERVAL_MS)
}

export function stopSustainedAlert() {
  if (vibrateTimer) {
    clearInterval(vibrateTimer)
    vibrateTimer = null
  }
  if (beepTimer) {
    clearInterval(beepTimer)
    beepTimer = null
  }
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(0)
  }
}

export function isSustainedAlertRunning() {
  return vibrateTimer !== null || beepTimer !== null
}
