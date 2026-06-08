import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Compass, Minus, Plus } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { busRoutesData } from '../../data/busRoutes'
import type { UrgencyLevel } from '../../lib/useUrgencyPulse'
import 'leaflet/dist/leaflet.css'

const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'

/** Dark basemap — hài hòa với theme d6-night */
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

function stationIcon() {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="d6-map-station"><span class="d6-map-station-core"></span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

function stopIcon(active: boolean) {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="d6-map-stop ${active ? 'd6-map-stop--dest' : ''}"></div>`,
    iconSize: [active ? 22 : 14, active ? 22 : 14],
    iconAnchor: [active ? 11 : 7, active ? 11 : 7],
  })
}

function busIcon(routeId: string, urgent: boolean) {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="d6-map-bus ${urgent ? 'd6-map-bus--urgent' : ''}"><span>${routeId}</span></div>`,
    iconSize: [40, 26],
    iconAnchor: [20, 13],
  })
}

function MapRefBridge({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => {
    onMap(map)
  }, [map, onMap])
  return null
}

function FitRoute({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 14 })
    }
  }, [map, positions])
  return null
}

function lerpAlongLine(points: [number, number][], t: number): [number, number] {
  if (points.length === 0) return [10.772, 106.698]
  if (points.length === 1) return points[0]
  const seg = Math.min(Math.floor(t * (points.length - 1)), points.length - 2)
  const local = t * (points.length - 1) - seg
  const a = points[seg]
  const b = points[seg + 1]
  return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local]
}

export function D6LeafletMap({
  route,
  destinationKeyword,
  urgencyLevel = 0,
  busProgress = 0.22,
}: {
  route: BusRouteData
  destinationKeyword?: string
  urgencyLevel?: UrgencyLevel
  busProgress?: number
}) {
  const [map, setMap] = useState<L.Map | null>(null)
  const onMapReady = useCallback((m: L.Map) => setMap(m), [])

  const positions = useMemo(
    () => route.stops.map((s) => [s.lat, s.lng] as [number, number]),
    [route],
  )

  const destIndex = useMemo(() => {
    if (!destinationKeyword?.trim()) return route.stops.length - 1
    const q = destinationKeyword.toLowerCase()
    const idx = route.stops.findIndex((s) => s.name.toLowerCase().includes(q))
    return idx >= 0 ? idx : route.stops.length - 1
  }, [route, destinationKeyword])

  const visiblePositions = positions.slice(0, destIndex + 1)
  const busPos = lerpAlongLine(visiblePositions, busProgress)
  const lineColor = route.id === '01' ? '#38bdf8' : route.color
  const urgent = urgencyLevel >= 2

  const station = busRoutesData.station

  return (
    <div className="d6-map-stage-inner relative h-full w-full">
      <div className="d6-map-controls absolute left-3 top-3 z-[1000] flex flex-col gap-2">
        <MapBtn onClick={() => map?.zoomIn()} aria-label="Phóng to">
          <Plus className="h-5 w-5" />
        </MapBtn>
        <MapBtn onClick={() => map?.zoomOut()} aria-label="Thu nhỏ">
          <Minus className="h-5 w-5" />
        </MapBtn>
        <MapBtn
          onClick={() => map?.fitBounds(L.latLngBounds(visiblePositions), { padding: [48, 48] })}
          aria-label="Căn tuyến"
        >
          <Compass className="h-5 w-5" />
        </MapBtn>
      </div>

      <MapContainer
        center={[station.lat, station.lng]}
        zoom={13}
        className="d6-leaflet h-full w-full"
        zoomControl={false}
        attributionControl
      >
        <MapRefBridge onMap={onMapReady} />
        <TileLayer url={TILE_DARK} attribution={OSM_ATTR} maxZoom={19} />
        <FitRoute positions={visiblePositions} />

        {visiblePositions.length >= 2 && (
          <>
            <Polyline
              positions={visiblePositions}
              pathOptions={{
                color: lineColor,
                weight: 6,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <Polyline
              positions={visiblePositions}
              pathOptions={{
                color: '#7dd3fc',
                weight: 12,
                opacity: 0.2,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        <Marker position={[station.lat, station.lng]} icon={stationIcon()} zIndexOffset={800}>
          <Popup>
            <strong className="text-sky-400">BẠN Ở ĐÂY</strong>
            <br />
            {station.name}
          </Popup>
        </Marker>

        {route.stops.map((stop, i) => {
          if (i === 0) return null
          const isDest = i === destIndex
          return (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={stopIcon(isDest)}
              zIndexOffset={isDest ? 600 : 400}
            >
              <Popup>
                <strong>{stop.name}</strong>
                {isDest && <div className="text-xs text-sky-400">Điểm đến</div>}
              </Popup>
            </Marker>
          )
        })}

        <Marker position={busPos} icon={busIcon(route.id, urgent)} zIndexOffset={900}>
          <Popup>
            Tuyến <strong>{route.id}</strong>
            <br />
            <span className="text-xs">Đang di chuyển trên tuyến</span>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="d6-map-badge absolute bottom-3 right-3 z-[1000] rounded-lg px-3 py-1.5 text-xs font-semibold">
        Tuyến {route.id} · OpenStreetMap
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
