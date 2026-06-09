import type { BusRouteData } from '../../data/busRoutes'
import BusPassSignaturePage from '../../app/page'
import { MapTouchA11yBar } from '../../components/d6/MapTouchA11yBar'
import type { BpLang } from './constants'
import { BpKioskHeader } from './BpKioskHeader'
import { BpListPanel } from './BpScreens'

export function BpDashboard({
  lang,
  stationName,
  stationId,
  userId,
  routes,
  viewMode,
  onViewModeChange,
  onRoute,
  onHelp,
  onBack,
}: {
  lang: BpLang
  stationName: string
  stationId: string
  userId: string
  routes: BusRouteData[]
  viewMode: 'map' | 'list'
  onViewModeChange: (mode: 'map' | 'list') => void
  onRoute: (route: BusRouteData) => void
  onHelp: () => void
  onBack: () => void
}) {
  return (
    <div className="bp-dashboard flex min-h-0 flex-1 flex-col">
      <BpKioskHeader
        lang={lang}
        stationName={stationName}
        onBack={onBack}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      {viewMode === 'map' ? (
        <BusPassSignaturePage
          stationId={stationId}
          userId={userId}
          hideHeader
          lang={lang}
          onRouteRequest={onRoute}
          onHelpRequest={onHelp}
          onListRequest={() => onViewModeChange('list')}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <BpListPanel lang={lang} routes={routes} onRoute={onRoute} />
          <div className="shrink-0 border-t border-kiosk-border bg-white px-4 py-3">
            <MapTouchA11yBar
              lang={lang}
              onHelp={onHelp}
              onList={() => onViewModeChange('map')}
              listModeActive
            />
          </div>
        </div>
      )}
    </div>
  )
}
