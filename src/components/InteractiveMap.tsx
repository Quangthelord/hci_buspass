import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Compass, Minus, Plus } from 'lucide-react'
import {
  DESTINATIONS,
  LIVE_BUSES,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  STATION,
  routeTypeColor,
  type Destination,
} from '../data/mockData'
import { getRoute } from '../data/mockData'
import { useKiosk } from '../context/KioskContext'
import 'leaflet/dist/leaflet.css'

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

/** Bản đồ sáng — user-friendly, tông trắng/xanh */
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

interface InteractiveMapProps {
  selectedId: string | null
  onSelect: (d: Destination) => void
  onSwitchList: () => void
}

function stationIcon() {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="station-marker pulse-station"><span class="station-core"></span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function destinationIcon(selected: boolean) {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="dest-marker ${selected ? 'dest-marker--selected' : ''}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

function busIcon(color: string, label: string) {
  return L.divIcon({
    className: 'buspass-marker',
    html: `<div class="bus-marker" style="background:${color};border-color:#fff"><span>${label}</span></div>`,
    iconSize: [36, 22],
    iconAnchor: [18, 11],
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
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48], maxZoom: 15 })
    }
  }, [map, positions])
  return null
}

export function InteractiveMap({ selectedId, onSelect, onSwitchList }: InteractiveMapProps) {
  const { lang } = useKiosk()
  const [buses, setBuses] = useState(LIVE_BUSES)
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null)
  const onMapReady = useCallback((map: L.Map) => setLeafletMap(map), [])

  const selected = DESTINATIONS.find((d) => d.id === selectedId)

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((b) => ({
          ...b,
          lat: b.lat + (Math.random() - 0.5) * 0.0008,
          lng: b.lng + (Math.random() - 0.5) * 0.0008,
        })),
      )
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const routeLine = useMemo((): [number, number][] => {
    if (!selected) return []
    return [
      [STATION.lat, STATION.lng],
      [selected.lat, selected.lng],
    ]
  }, [selected])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-kiosk-border">
      <div className="absolute left-3 top-3 z-[1000] flex flex-col gap-2">
        <MapBtn onClick={() => leafletMap?.zoomIn()} aria-label="Zoom in">
          <Plus className="h-5 w-5" />
        </MapBtn>
        <MapBtn onClick={() => leafletMap?.zoomOut()} aria-label="Zoom out">
          <Minus className="h-5 w-5" />
        </MapBtn>
        <MapBtn
          onClick={() => leafletMap?.setView([STATION.lat, STATION.lng], MAP_DEFAULT_ZOOM)}
          aria-label="Reset"
        >
          <Compass className="h-5 w-5" />
        </MapBtn>
      </div>

      <MapContainer
        center={[MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng]}
        zoom={MAP_DEFAULT_ZOOM}
        className="buspass-leaflet h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <MapRefBridge onMap={onMapReady} />
        <TileLayer url={TILE_URL} attribution={OSM_ATTRIBUTION} maxZoom={19} />

        {routeLine.length >= 2 && (
          <>
            <Polyline
              positions={routeLine}
              pathOptions={{
                color: '#16a34a',
                weight: 5,
                opacity: 0.85,
                dashArray: '12 8',
              }}
            />
            <FitRoute positions={routeLine} />
          </>
        )}

        <Marker position={[STATION.lat, STATION.lng]} icon={stationIcon()}>
          <Popup>
            <strong className="text-neon-green">{lang === 'vi' ? 'BẠN Ở ĐÂY' : 'YOU ARE HERE'}</strong>
            <br />
            {lang === 'vi' ? STATION.nameVi : STATION.nameEn}
          </Popup>
        </Marker>

        {DESTINATIONS.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={destinationIcon(d.id === selectedId)}
            eventHandlers={{ click: () => onSelect(d) }}
          >
            <Popup>
              <span className="text-lg">{d.icon}</span>{' '}
              <strong>{lang === 'vi' ? d.nameVi : d.nameEn}</strong>
              <br />
              <span className="text-sm">{d.distanceKm} km</span>
            </Popup>
          </Marker>
        ))}

        {buses.map((bus) => {
          const route = getRoute(bus.routeId)
          const color = route ? routeTypeColor(route.type) : '#ffaa00'
          return (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={busIcon(color, bus.label)}
              zIndexOffset={500}
            >
              <Popup>
                {lang === 'vi' ? 'Tuyến' : 'Route'} <strong>{bus.label}</strong>
                {route && (
                  <>
                    <br />
                    <span className="text-xs">ETA ~{route.etaMinutes} min</span>
                  </>
                )}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <button
        type="button"
        onClick={onSwitchList}
        className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-neon-cyan/50 bg-kiosk-panel/90 px-3 py-2 text-xs text-neon-cyan backdrop-blur"
      >
        ⚙️ {lang === 'vi' ? 'Danh sách' : 'List'}
      </button>

      <p className="pointer-events-none absolute bottom-3 right-3 z-[1000] rounded bg-kiosk-panel/80 px-2 py-1 text-[10px] text-gray-500">
        OpenStreetMap · Carto
      </p>
    </div>
  )
}

function MapBtn({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-kiosk-border bg-kiosk-panel/95 text-neon-green shadow-lg transition hover:border-neon-green"
      {...props}
    >
      {children}
    </button>
  )
}
