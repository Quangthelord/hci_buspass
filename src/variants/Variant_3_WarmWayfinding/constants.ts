export const WARM = {
  bg: '#F5F0E8',
  card: '#FFFBF5',
  primary: '#D97706',
  secondary: '#92400E',
  text: '#1C1917',
  muted: '#78716C',
  mapBg: '#EDE6D8',
  mapLine: '#D6CFC0',
  cardShadow: '0 2px 8px rgba(180, 140, 100, 0.15)',
  headerGradient: 'linear-gradient(135deg, #FEF3C7 0%, #F5F0E8 55%, #FFEDD5 100%)',
} as const

export const VARIANT_ID = 'Variant_3_WarmWayfinding' as const

export const STATUS_PILL = {
  on_time: { bg: '#DCFCE7', text: '#166534', label: 'Đúng lịch' },
  minor: { bg: '#FEF9C3', text: '#854D0E', label: 'Trễ nhẹ' },
  major: { bg: '#FEE2E2', text: '#991B1B', label: 'Trễ nhiều' },
  unknown: { bg: '#F5F5F4', text: '#57534E', label: 'Đang cập nhật' },
} as const

/** Full incident copy for "Xem thêm" — human, not system-error tone. */
export const INCIDENT_DETAILS: Record<string, string> = {
  '01':
    'Xe buýt đang chạy chậm hơn dự kiến khoảng 2 phút do ùn tắc nhẹ tại Ngã tư Hàng Xanh. ' +
    'Tài xế và trung tâm điều hành đang theo dõi; lộ trình vẫn giữ nguyên, không đổi tuyến.',
  '02':
    'Chuyến xe đang chạy đúng lịch. GPS và cảm biến cửa xác nhận xe đang tiến về trạm Bến Thành bình thường.',
  '08':
    'Dữ liệu vị trí xe tạm thời không ổn định do sóng yếu trong khu vực. ' +
    'Hệ thống đang đồng bộ lại — bạn vẫn có thể xem lịch cố định bên dưới.',
  '36':
    'Kẹt xe nghiêm trọng tại nút giao An Sương. Đội điều phối đã mở làn ưu tiên cho xe buýt; ' +
    'thời gian chờ có thể dài hơn 10–15 phút so với bình thường.',
}
