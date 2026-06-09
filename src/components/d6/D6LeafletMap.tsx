import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { Compass, Minus, Plus, Route } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { busRoutesData } from '../../data/busRoutes'
import type { MapFocusMode } from '../../lib/mapRouteView'
import {
  busProgressFromRoute,
  busTooltipLabel,
  delayedBusPopup,
  getApproachSegments,
  routePositions,
} from '../../lib/mapRouteView'
import 'leaflet/dist/leaflet.css'

const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
const TILE_LIGHT_LABELS = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

function kioskStationIcon() {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="d6-map-station d6-map-station--kiosk"><span class="d6-map-station-core"></span><span class="d6-map-station-label">BẠN Ở ĐÂY</span></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  })
}

function stationIcon() {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="d6-map-station"><span class="d6-map-station-core"></span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

function stopIcon(dimmed = false) {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="d6-map-stop ${dimmed ? 'd6-map-stop--dim' : ''}"></div>`,
    iconSize: [dimmed ? 8 : 10, dimmed ? 8 : 10],
    iconAnchor: [dimmed ? 4 : 5, dimmed ? 4 : 5],
  })
}

function busIcon(routeId: string, mode: MapFocusMode) {
  const cls =
    mode === 'delayed'
      ? 'd6-map-bus d6-map-bus--delayed'
      : mode === 'micro'
        ? 'd6-map-bus d6-map-bus--smooth'
        : mode === 'tracking'
          ? 'd6-map-bus d6-map-bus--live'
          : 'd6-map-bus'
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="${cls}"><span>${routeId}</span></div>`,
    iconSize: [44, 28],
    iconAnchor: [22, 14],
  })
}

function MapRefBridge({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => {
    onMap(map)
  }, [map, onMap])
  return null
}

function MapCamera({
  focusMode,
  fullRoute,
  route,
  busPos,
  stationLatLng,
}: {
  focusMode: MapFocusMode
  fullRoute: boolean
  route: BusRouteData
  busPos: [number, number]
  stationLatLng: [number, number]
}) {
  const map = useMap()
  const positions = useMemo(() => routePositions(route), [route])

  useEffect(() => {
    if (focusMode === 'default') {
      map.setView(stationLatLng, 16, { animate: true })
      return
    }

    if (fullRoute) {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 13, animate: true })
      return
    }

    const bounds = L.latLngBounds([busPos, stationLatLng])

    if (focusMode === 'micro') {
      map.fitBounds(bounds, { padding: [72, 72], maxZoom: 18, animate: true })
      return
    }

    if (focusMode === 'delayed') {
      const { trafficAhead } = getApproachSegments(route)
      trafficAhead.forEach((p) => bounds.extend(p))
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 16, animate: true })
      return
    }

    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15, animate: true })
  }, [focusMode, fullRoute, route, busPos, stationLatLng, map, positions])

  return null
}

export function D6LeafletMap({
  route,
  focusMode = 'tracking',
  fullRouteView = false,
  onFullRouteToggle,
  destinationKeyword,
  labeledBasemap = false,
  lang = 'vi',
}: {
  route: BusRouteData
  focusMode?: MapFocusMode
  fullRouteView?: boolean
  onFullRouteToggle?: () => void
  destinationKeyword?: string
  labeledBasemap?: boolean
  lang?: 'vi' | 'en'
}) {
  const [map, setMap] = useState<L.Map | null>(null)
  const onMapReady = useCallback((m: L.Map) => setMap(m), [])

  const station = busRoutesData.station
  const stationLatLng: [number, number] = [station.lat, station.lng]
  const isDefault = focusMode === 'default'
  const lineColor = route.color || '#16a34a'

  const positions = useMemo(() => routePositions(route), [route])

  const destIndex = useMemo(() => {
    if (!destinationKeyword?.trim()) return route.stops.length - 1
    const q = destinationKeyword.toLowerCase()
    const idx = route.stops.findIndex((s) => s.name.toLowerCase().includes(q))
    return idx >= 0 ? idx : route.stops.length - 1
  }, [route, destinationKeyword])

  const { busPos, stationToBus, trafficAhead } = useMemo(
    () => getApproachSegments(route),
    [route],
  )

  const busProgress = busProgressFromRoute(route)
  const tooltip = busTooltipLabel(route, lang)
  const isVi = lang === 'vi'

  const intermediateStopIdx = useMemo(() => {
    const t = busProgress
    return Math.max(1, Math.ceil(t * (route.stops.length - 1)))
  }, [busProgress, route.stops.length])

  return (
    <div className="d6-map-stage-inner relative h-full w-full">
      <div className="d6-map-controls absolute left-2 top-2 z-[1000] flex flex-col gap-1.5">
        <MapBtn onClick={() => map?.zoomIn()} aria-label={isVi ? 'Phóng to' : 'Zoom in'}>
          <Plus className="h-4 w-4" />
        </MapBtn>
        <MapBtn onClick={() => map?.zoomOut()} aria-label={isVi ? 'Thu nhỏ' : 'Zoom out'}>
          <Minus className="h-4 w-4" />
        </MapBtn>
        <MapBtn
          onClick={() => {
            if (isDefault) {
              map?.setView(stationLatLng, 16, { animate: true })
            } else {
              map?.fitBounds(L.latLngBounds([busPos, stationLatLng]), {
                padding: [72, 72],
                maxZoom: focusMode === 'micro' ? 18 : 15,
                animate: true,
              })
            }
          }}
          aria-label={isVi ? 'Căn tuyến' : 'Fit route'}
        >
          <Compass className="h-4 w-4" />
        </MapBtn>
      </div>

      {onFullRouteToggle && !isDefault && (
        <button
          type="button"
          onClick={onFullRouteToggle}
          className="d6-map-full-route-btn absolute right-2 top-2 z-[1000] flex items-center gap-1.5 rounded-lg border border-kiosk-border bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-gray-800 shadow-sm transition hover:border-neon-green hover:text-neon-green"
        >
          <Route className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          {fullRouteView
            ? isVi
              ? 'Theo dõi xe'
              : 'Track bus'
            : isVi
              ? 'Xem toàn tuyến'
              : 'Full route'}
        </button>
      )}

      <MapContainer
        center={stationLatLng}
        zoom={16}
        className="d6-leaflet h-full w-full"
        zoomControl={false}
        attributionControl
      >
        <MapRefBridge onMap={onMapReady} />
        <TileLayer url={labeledBasemap ? TILE_LIGHT_LABELS : TILE_LIGHT} attribution={OSM_ATTR} maxZoom={19} />
        <MapCamera
          focusMode={focusMode}
          fullRoute={fullRouteView}
          route={route}
          busPos={busPos}
          stationLatLng={stationLatLng}
        />

        {fullRouteView && !isDefault && positions.length >= 2 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: lineColor,
              weight: 5,
              opacity: 0.55,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '6 8',
            }}
          />
        )}

        {!isDefault && !fullRouteView && stationToBus.length >= 2 && (
          <>
            <Polyline
              positions={stationToBus}
              pathOptions={{
                color: '#86efac',
                weight: 14,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <Polyline
              positions={stationToBus}
              pathOptions={{
                color: focusMode === 'delayed' ? '#ea580c' : lineColor,
                weight: 7,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        {!isDefault && focusMode === 'delayed' && !fullRouteView && trafficAhead.length >= 2 && (
          <Polyline
            positions={trafficAhead}
            pathOptions={{
              color: '#dc2626',
              weight: 9,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        <Marker
          position={stationLatLng}
          icon={isDefault ? kioskStationIcon() : stationIcon()}
          zIndexOffset={800}
        >
          <Popup>
            <strong className="text-neon-green">{isVi ? 'BẠN Ở ĐÂY' : 'YOU ARE HERE'}</strong>
            <br />
            {station.name}
          </Popup>
        </Marker>

        {!isDefault &&
          !fullRouteView &&
          route.stops.slice(1, intermediateStopIdx + 1).map((stop) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={stopIcon(true)}
              zIndexOffset={350}
            />
          ))}

        {!isDefault && (
          <Marker position={busPos} icon={busIcon(route.id, focusMode)} zIndexOffset={900}>
            <Tooltip permanent direction="top" offset={[0, -18]} className="d6-bus-tooltip">
              {tooltip}
            </Tooltip>
            {focusMode === 'delayed' && (
              <Popup>
                <span className="text-sm font-semibold text-amber-800">
                  {delayedBusPopup(route, lang)}
                </span>
              </Popup>
            )}
          </Marker>
        )}

        {fullRouteView &&
          route.stops.map((stop, i) => {
            if (i === 0) return null
            const isDest = i === destIndex
            return (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lng]}
                icon={stopIcon(!isDest)}
                zIndexOffset={isDest ? 500 : 400}
              >
                <Popup>
                  <strong>{stop.name}</strong>
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>

      <div className="d6-map-badge absolute bottom-2 right-2 z-[1000] rounded-lg px-2.5 py-1 text-[10px] font-semibold">
        {isDefault
          ? isVi
            ? 'Trạm Bến Thành · OpenStreetMap'
            : 'Ben Thanh · OpenStreetMap'
          : `${isVi ? 'Tuyến' : 'Route'} ${route.id} · OpenStreetMap`}
      </div>
    </div>
  )
}

function MapBtn({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" onClick={onClick} className="d6-map-control-btn" {...props}>
      {children}
    </button>
  )
}
