export type Lang = 'vi' | 'en' | 'zh' | 'ko'
export type RouteType = 'express' | 'regular' | 'night'
export type TrafficStatus = 'normal' | 'congested' | 'heavy'

export interface LatLng {
  lat: number
  lng: number
}

export interface Destination {
  id: string
  nameVi: string
  nameEn: string
  icon: string
  distanceKm: number
  lat: number
  lng: number
  routes: string[]
}

export interface BusVehicle {
  id: string
  routeId: string
  lat: number
  lng: number
  label: string
}

export interface RouteStop {
  id: number
  name: string
  isCurrent?: boolean
  isTerminal?: boolean
}

export interface BusRoute {
  id: string
  number: string
  nameVi: string
  nameEn: string
  type: RouteType
  from: string
  to: string
  via: string[]
  etaMinutes: number
  etaRange: string
  traffic: TrafficStatus
  firstTrip: string
  lastTrip: string
  interval: string
  fare: number
  fareStudent: number
  vehicles: { id: number; distanceKm: number; etaMinutes: number; status: 'near' | 'far' }[]
  stops: RouteStop[]
  alert?: string
}

/** Trạm Lê Lợi – Nguyễn Huệ (trung tâm Q.1, TP.HCM) */
export const STATION = {
  id: 'le-loi-nguyen-hue',
  nameVi: 'Trạm Lê Lợi - Nguyễn Huệ',
  nameEn: 'Le Loi - Nguyen Hue Station',
  routeCount: 6,
  lat: 10.7739,
  lng: 106.7045,
}

export const MAP_DEFAULT_CENTER: LatLng = { lat: STATION.lat, lng: STATION.lng }
export const MAP_DEFAULT_ZOOM = 14

export const DESTINATIONS: Destination[] = [
  { id: 'ben-thanh', nameVi: 'Chợ Bến Thành', nameEn: 'Ben Thanh Market', icon: '🏛️', distanceKm: 0.9, lat: 10.772, lng: 106.698, routes: ['19', '36'] },
  { id: 'notre-dame', nameVi: 'Nhà Thờ Đức Bà', nameEn: 'Notre-Dame Cathedral', icon: '⛪', distanceKm: 0.7, lat: 10.7798, lng: 106.699, routes: ['36', '93'] },
  { id: 'independence', nameVi: 'Dinh Độc Lập', nameEn: 'Independence Palace', icon: '🏛️', distanceKm: 0.5, lat: 10.7769, lng: 106.6955, routes: ['05', '19'] },
  { id: 'airport', nameVi: 'Sân bay Tân Sơn Nhất', nameEn: 'Tan Son Nhat Airport', icon: '✈️', distanceKm: 6.5, lat: 10.8188, lng: 106.652, routes: ['152', '150'] },
  { id: 'miendong', nameVi: 'Bến xe Miền Đông', nameEn: 'Mien Dong Bus Terminal', icon: '🚌', distanceKm: 5.2, lat: 10.8146, lng: 106.709, routes: ['19', '93'] },
  { id: 'dam-sen', nameVi: 'Công viên Đầm Sen', nameEn: 'Dam Sen Park', icon: '🌳', distanceKm: 7.8, lat: 10.7674, lng: 106.6383, routes: ['36', '93'] },
  { id: 'cho-ray', nameVi: 'Bệnh viện Chợ Rẫy', nameEn: 'Cho Ray Hospital', icon: '🏥', distanceKm: 2.5, lat: 10.7575, lng: 106.659, routes: ['05', '19'] },
  { id: 'ueh', nameVi: 'Đại học Kinh tế UEH', nameEn: 'UEH University', icon: '🎓', distanceKm: 0.4, lat: 10.7769, lng: 106.701, routes: ['05', '19'] },
]

export const ROUTES: BusRoute[] = [
  {
    id: '19',
    number: '19',
    nameVi: 'Tuyến 19',
    nameEn: 'Route 19',
    type: 'regular',
    from: 'Bến xe Miền Đông',
    to: 'Chợ Lớn',
    via: ['Chợ Bến Thành'],
    etaMinutes: 3,
    etaRange: '2-5',
    traffic: 'congested',
    firstTrip: '05:00',
    lastTrip: '22:30',
    interval: '10-15 phút',
    fare: 7000,
    fareStudent: 3500,
    vehicles: [
      { id: 1, distanceKm: 0.5, etaMinutes: 2, status: 'near' },
      { id: 2, distanceKm: 2.8, etaMinutes: 9, status: 'far' },
      { id: 3, distanceKm: 5.2, etaMinutes: 16, status: 'far' },
    ],
    alert: 'Đang ùn tắc nhẹ tại Ngã tư Cách Mạng Tháng 8',
    stops: [
      { id: 1, name: 'Bến xe Miền Đông', isTerminal: true },
      { id: 2, name: 'Ngã tư Hàng Xanh' },
      { id: 3, name: 'Điện Biên Phủ' },
      { id: 4, name: 'Lê Lợi - Nguyễn Huệ', isCurrent: true },
      { id: 5, name: 'Nguyễn Trãi' },
      { id: 6, name: 'Chợ Bến Thành' },
      { id: 7, name: 'Nguyễn Thái Học' },
      { id: 8, name: 'Công viên 23/9' },
      { id: 9, name: 'Bà Hom' },
      { id: 10, name: 'An Bình' },
      { id: 11, name: 'Hậu Giang' },
      { id: 12, name: 'Nguyễn Văn Cừ' },
      { id: 13, name: 'Chợ Lớn', isTerminal: true },
    ],
  },
  {
    id: '36',
    number: '36',
    nameVi: 'Tuyến 36',
    nameEn: 'Route 36',
    type: 'regular',
    from: 'Bến xe An Sương',
    to: 'Chợ Bến Thành',
    via: [],
    etaMinutes: 8,
    etaRange: '8-12',
    traffic: 'congested',
    firstTrip: '05:30',
    lastTrip: '21:00',
    interval: '12-18 phút',
    fare: 7000,
    fareStudent: 3500,
    vehicles: [
      { id: 1, distanceKm: 1.2, etaMinutes: 5, status: 'near' },
      { id: 2, distanceKm: 4.0, etaMinutes: 12, status: 'far' },
    ],
    stops: [
      { id: 1, name: 'Bến xe An Sương', isTerminal: true },
      { id: 2, name: 'Tân Sơn Nhì' },
      { id: 3, name: 'Lạc Long Quân' },
      { id: 4, name: 'Lê Lợi - Nguyễn Huệ', isCurrent: true },
      { id: 5, name: 'Pasteur' },
      { id: 6, name: 'Chợ Bến Thành', isTerminal: true },
    ],
  },
  {
    id: '05',
    number: '05',
    nameVi: 'Tuyến 05',
    nameEn: 'Route 05',
    type: 'express',
    from: 'Bến xe An Sương',
    to: 'Bến Thành',
    via: ['Dinh Độc Lập'],
    etaMinutes: 5,
    etaRange: '4-7',
    traffic: 'normal',
    firstTrip: '05:15',
    lastTrip: '22:00',
    interval: '8-12 phút',
    fare: 7000,
    fareStudent: 3500,
    vehicles: [{ id: 1, distanceKm: 0.8, etaMinutes: 4, status: 'near' }],
    stops: [
      { id: 1, name: 'Bến xe An Sương', isTerminal: true },
      { id: 2, name: 'Cộng Hòa' },
      { id: 3, name: 'Lê Lợi - Nguyễn Huệ', isCurrent: true },
      { id: 4, name: 'Dinh Độc Lập' },
      { id: 5, name: 'Bến Thành', isTerminal: true },
    ],
  },
  {
    id: '150',
    number: '150',
    nameVi: 'Tuyến 150',
    nameEn: 'Route 150',
    type: 'regular',
    from: 'Chợ Lớn',
    to: 'Chợ Bến Thành',
    via: [],
    etaMinutes: 15,
    etaRange: '15-20',
    traffic: 'normal',
    firstTrip: '06:00',
    lastTrip: '20:30',
    interval: '15-20 phút',
    fare: 7000,
    fareStudent: 3500,
    vehicles: [{ id: 1, distanceKm: 3.5, etaMinutes: 14, status: 'far' }],
    stops: [
      { id: 1, name: 'Chợ Lớn', isTerminal: true },
      { id: 2, name: 'Hùng Vương' },
      { id: 3, name: 'Lê Lợi - Nguyễn Huệ', isCurrent: true },
      { id: 4, name: 'Chợ Bến Thành', isTerminal: true },
    ],
  },
  {
    id: '93',
    number: '93',
    nameVi: 'Tuyến 93',
    nameEn: 'Route 93',
    type: 'night',
    from: 'Bến xe Miền Đông',
    to: 'Bến Thành',
    via: ['Nhà Thờ Đức Bà'],
    etaMinutes: 12,
    etaRange: '10-15',
    traffic: 'normal',
    firstTrip: '18:00',
    lastTrip: '05:00',
    interval: '20-30 phút',
    fare: 7000,
    fareStudent: 3500,
    vehicles: [{ id: 1, distanceKm: 2.0, etaMinutes: 11, status: 'far' }],
    stops: [
      { id: 1, name: 'Bến xe Miền Đông', isTerminal: true },
      { id: 2, name: 'Xô Viết Nghệ Tĩnh' },
      { id: 3, name: 'Lê Lợi - Nguyễn Huệ', isCurrent: true },
      { id: 4, name: 'Nhà Thờ Đức Bà' },
      { id: 5, name: 'Bến Thành', isTerminal: true },
    ],
  },
  {
    id: '152',
    number: '152',
    nameVi: 'Tuyến 152',
    nameEn: 'Route 152',
    type: 'express',
    from: 'Lê Lợi - Nguyễn Huệ',
    to: 'Sân bay Tân Sơn Nhất',
    via: ['Cộng Hòa', 'Trường Sơn'],
    etaMinutes: 22,
    etaRange: '20-30',
    traffic: 'congested',
    firstTrip: '05:00',
    lastTrip: '23:00',
    interval: '15-20 phút',
    fare: 12000,
    fareStudent: 6000,
    vehicles: [
      { id: 1, distanceKm: 2.5, etaMinutes: 18, status: 'near' },
      { id: 2, distanceKm: 5.0, etaMinutes: 25, status: 'far' },
    ],
    alert: 'Tắc nhẹ đường Trường Sơn — xe chạy chậm hơn dự kiến',
    stops: [
      { id: 1, name: 'Lê Lợi - Nguyễn Huệ', isCurrent: true },
      { id: 2, name: 'Cộng Hòa' },
      { id: 3, name: 'Trường Sơn' },
      { id: 4, name: 'Cổng sân bay nội địa', isTerminal: true },
    ],
  },
]

export const LIVE_BUSES: BusVehicle[] = [
  { id: 'b1', routeId: '19', lat: 10.776, lng: 106.702, label: '19' },
  { id: 'b2', routeId: '36', lat: 10.771, lng: 106.707, label: '36' },
  { id: 'b3', routeId: '05', lat: 10.775, lng: 106.699, label: '05' },
  { id: 'b4', routeId: '150', lat: 10.769, lng: 106.71, label: '150' },
  { id: 'b5', routeId: '93', lat: 10.778, lng: 106.705, label: '93' },
  { id: 'b6', routeId: '152', lat: 10.792, lng: 106.668, label: '152' },
]

/** Tuyến phù hợp với điểm đến (khớp theo id hoặc số tuyến). */
export function getMatchingRoutesForDestination(dest: Destination): BusRoute[] {
  return ROUTES.filter(
    (r) => dest.routes.includes(r.id) || dest.routes.includes(r.number),
  ).sort((a, b) => a.etaMinutes - b.etaMinutes)
}

export function getRoute(id: string): BusRoute | undefined {
  return ROUTES.find((r) => r.id === id)
}

export function getDestination(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id)
}

export function routeTypeColor(type: RouteType): string {
  switch (type) {
    case 'express':
      return '#15803d'
    case 'night':
      return '#166534'
    default:
      return '#22c55e'
  }
}

export function trafficLabel(status: TrafficStatus, lang: Lang): string {
  const map = {
    vi: { normal: 'Lưu thông bình thường', congested: 'Đang ùn tắc nhẹ', heavy: 'Ùn tắc nặng' },
    en: { normal: 'Normal traffic', congested: 'Light congestion', heavy: 'Heavy congestion' },
    zh: { normal: '交通正常', congested: '轻微拥堵', heavy: '严重拥堵' },
    ko: { normal: '교통 원활', congested: '약간 정체', heavy: '심한 정체' },
  }
  return map[lang][status]
}
