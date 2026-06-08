import BusPassSignaturePage from '../app/page'

/** D6 BusPass Signature — primary map-centric kiosk interface. */
export function MapModePage() {
  const userId = sessionStorage.getItem('buspass_userId') ?? 'participant-01'
  return <BusPassSignaturePage stationId="ben-thanh" userId={userId} />
}
