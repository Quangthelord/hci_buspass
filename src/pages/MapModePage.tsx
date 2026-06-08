import BusPassSignaturePage from '../app/page'
import KioskLayout from '../app/layout'

/** D6 BusPass Signature — same kiosk shell as A/B test (screensaver, telemetry, idle). */
export function MapModePage() {
  const userId = sessionStorage.getItem('buspass_userId') ?? 'participant-01'
  return (
    <KioskLayout>
      <BusPassSignaturePage stationId="ben-thanh" userId={userId} />
    </KioskLayout>
  )
}
