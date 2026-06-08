import BusPassSignaturePage from '../app/page'
import KioskLayout from '../app/layout'

/** BusPass System (giao diện gốc) — cùng kiosk shell với A/B test. */
export function MapModePage() {
  const userId = sessionStorage.getItem('buspass_userId') ?? 'participant-01'
  return (
    <KioskLayout>
      <BusPassSignaturePage stationId="ben-thanh" userId={userId} />
    </KioskLayout>
  )
}
