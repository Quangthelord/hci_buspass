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

/** Bản đồ tối giản — nổi bật tuyến xe bus */
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
const TILE_LIGHT_LABELS = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

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
      map.fitBounds(L.latLngBounds(positions), { padding: [36, 36], maxZoom: 15 })
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
  labeledBasemap = false,
}: {
  route: BusRouteData
  destinationKeyword?: string
  urgencyLevel?: UrgencyLevel
  busProgress?: number
  /** Hiện nhãn đường/địa danh trên bản đồ kiosk */
  labeledBasemap?: boolean
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
  const lineColor = route.id === '01' ? '#16a34a' : route.color
  const urgent = urgencyLevel >= 2

  const station = busRoutesData.station

  return (
    <div className="d6-map-stage-inner relative h-full w-full">
      <div className="d6-map-controls absolute left-2 top-2 z-[1000] flex flex-col gap-1.5">
        <MapBtn onClick={() => map?.zoomIn()} aria-label="Phóng to">
          <Plus className="h-4 w-4" />
        </MapBtn>
        <MapBtn onClick={() => map?.zoomOut()} aria-label="Thu nhỏ">
          <Minus className="h-4 w-4" />
        </MapBtn>
        <MapBtn
          onClick={() => map?.fitBounds(L.latLngBounds(visiblePositions), { padding: [36, 36], maxZoom: 15 })}
          aria-label="Căn tuyến"
        >
          <Compass className="h-4 w-4" />
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
        <TileLayer url={labeledBasemap ? TILE_LIGHT_LABELS : TILE_LIGHT} attribution={OSM_ATTR} maxZoom={19} />
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
                color: '#86efac',
                weight: 12,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        <Marker position={[station.lat, station.lng]} icon={stationIcon()} zIndexOffset={800}>
          <Popup>
            <strong className="text-neon-green">BẠN Ở ĐÂY</strong>
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
                {isDest && <div className="text-xs text-neon-green">Điểm đến</div>}
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

      <div className="d6-map-badge absolute bottom-2 right-2 z-[1000] rounded-lg px-2.5 py-1 text-[10px] font-semibold">
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
