import type { Lang } from '../data/mockData'

type Dict = Record<string, Record<Lang, string>>

const t: Dict = {
  welcomeTitle: {
    vi: 'CHÀO MỪNG ĐẾN TRẠM XE BUÝT THÔNG MINH',
    en: 'WELCOME TO SMART BUS STATION',
    zh: '欢迎来到智能公交站',
    ko: '스마트 버스 정류장에 오신 것을 환영합니다',
  },
  welcomeSub: {
    vi: 'Welcome to Smart Bus Station',
    en: 'Chào mừng đến trạm xe buýt thông minh',
    zh: 'Welcome to Smart Bus Station',
    ko: 'Welcome to Smart Bus Station',
  },
  routesAtStation: {
    vi: 'Hiện có {n} tuyến xe đi qua trạm này',
    en: '{n} bus routes pass through this station',
    zh: '本站有 {n} 条公交线路',
    ko: '이 정류장을 지나는 노선 {n}개',
  },
  help: { vi: 'TRỢ GIÚP', en: 'HELP', zh: '帮助', ko: '도움말' },
  modeQuestion: {
    vi: 'BẠN MUỐN TRA CỨU THEO CÁCH NÀO?',
    en: 'HOW WOULD YOU LIKE TO SEARCH?',
    zh: '您想如何查询？',
    ko: '어떤 방식으로 검색하시겠습니까?',
  },
  modeQuestionSub: {
    vi: 'How would you like to search?',
    en: 'Bạn muốn tra cứu theo cách nào?',
    zh: 'How would you like to search?',
    ko: 'How would you like to search?',
  },
  mapMode: { vi: 'XEM BẢN ĐỒ TRỰC QUAN', en: 'VISUAL MAP MODE', zh: '可视化地图', ko: '시각 지도 모드' },
  listMode: { vi: 'XEM DANH SÁCH TUYẾN XE', en: 'ROUTE LIST MODE', zh: '线路列表', ko: '노선 목록' },
  selectMode: { vi: 'CHỌN CHẾ ĐỘ NÀY', en: 'SELECT THIS MODE', zh: '选择此模式', ko: '이 모드 선택' },
  back: { vi: 'QUAY LẠI', en: 'BACK', zh: '返回', ko: '뒤로' },
  homeMain: {
    vi: 'MÀN HÌNH CHÍNH',
    en: 'MAIN MENU',
    zh: '主菜单',
    ko: '메인 화면',
  },
  changeLanguage: {
    vi: 'ĐỔI NGÔN NGỮ',
    en: 'CHANGE LANGUAGE',
    zh: '更换语言',
    ko: '언어 변경',
  },
  modeTip: {
    vi: 'Bạn có thể đổi chế độ bất cứ lúc nào',
    en: 'You can switch modes anytime',
    zh: '可随时切换模式',
    ko: '언제든 모드를 변경할 수 있습니다',
  },
  recommended: { vi: 'Đề xuất', en: 'Recommended', zh: '推荐', ko: '추천' },
  chooseDestination: {
    vi: 'CHỌN ĐIỂM ĐẾN CỦA BẠN',
    en: 'CHOOSE YOUR DESTINATION',
    zh: '选择目的地',
    ko: '목적지 선택',
  },
  popularPlaces: { vi: 'Các điểm phổ biến', en: 'Popular places', zh: '热门地点', ko: '인기 장소' },
  mapTip: {
    vi: 'Mẹo: Chạm vào bản đồ để xem tất cả điểm đến',
    en: 'Tip: Tap the map to see all destinations',
    zh: '提示：点击地图查看所有目的地',
    ko: '팁: 지도를 탭하여 모든 목적지 보기',
  },
  toDestination: { vi: 'ĐẾN', en: 'TO', zh: '前往', ko: '목적지' },
  fromStation: { vi: 'từ trạm này', en: 'from this station', zh: '距本站', ko: '이 정류장에서' },
  matchingRoutes: { vi: 'TUYẾN XE PHÙ HỢP', en: 'MATCHING ROUTES', zh: '匹配线路', ko: '적합 노선' },
  waitTime: { vi: 'Thời gian chờ', en: 'Wait time', zh: '等待时间', ko: '대기 시간' },
  altRoutes: { vi: 'Tuyến thay thế', en: 'Alternative routes', zh: '替代线路', ko: '대체 노선' },
  syncPhone: { vi: 'ĐỒNG BỘ VÀO ĐIỆN THOẠI', en: 'SYNC TO PHONE', zh: '同步到手机', ko: '휴대폰 동기화' },
  switchList: { vi: 'Chế độ danh sách', en: 'List mode', zh: '列表模式', ko: '목록 모드' },
  switchMap: { vi: 'Chế độ bản đồ', en: 'Map mode', zh: '地图模式', ko: '지도 모드' },
  listTitle: {
    vi: 'DANH SÁCH TUYẾN XE TẠI TRẠM NÀY',
    en: 'ROUTES AT THIS STATION',
    zh: '本站公交线路',
    ko: '이 정류장 노선 목록',
  },
  easyRead: {
    vi: 'Chế độ dễ đọc',
    en: 'Easy-read mode',
    zh: '易读模式',
    ko: '쉬운 읽기 모드',
  },
  searchPlaceholder: {
    vi: 'Tìm theo số tuyến hoặc điểm đến',
    en: 'Search by route number or destination',
    zh: '按线路号或目的地搜索',
    ko: '노선 번호 또는 목적지 검색',
  },
  busArriving: { vi: 'XE SẮP ĐẾN', en: 'BUS ARRIVING IN', zh: '即将到达', ko: '곧 도착' },
  viewDetail: { vi: 'XEM CHI TIẾT TUYẾN', en: 'VIEW ROUTE DETAIL', zh: '查看线路详情', ko: '노선 상세 보기' },
  routeDetail: { vi: 'CHI TIẾT TUYẾN', en: 'ROUTE DETAIL', zh: '线路详情', ko: '노선 상세' },
  mainRoute: { vi: 'LỘ TRÌNH CHÍNH', en: 'MAIN ROUTE', zh: '主要路线', ko: '주요 경로' },
  schedule: { vi: 'THỜI GIAN', en: 'SCHEDULE', zh: '时刻表', ko: '운행 시간' },
  fare: { vi: 'GIÁ VÉ', en: 'FARE', zh: '票价', ko: '요금' },
  runningBuses: { vi: 'XE ĐANG CHẠY', en: 'BUSES IN SERVICE', zh: '运行车辆', ko: '운행 차량' },
  allStops: { vi: 'TẤT CẢ CÁC TRẠM DỪNG', en: 'ALL STOPS', zh: '所有站点', ko: '모든 정류장' },
  youAreHere: { vi: 'Bạn đang ở đây', en: 'You are here', zh: '您在这里', ko: '현재 위치' },
  selectAndSync: { vi: 'CHỌN TUYẾN NÀY VÀ ĐỒNG BỘ', en: 'SELECT ROUTE & SYNC', zh: '选择线路并同步', ko: '노선 선택 및 동기화' },
  qrTitle: { vi: 'ĐỒNG BỘ LỘ TRÌNH VÀO ĐIỆN THOẠI', en: 'SYNC ROUTE TO YOUR PHONE', zh: '同步路线到手机', ko: '휴대폰에 경로 동기화' },
  qrBenefits: {
    vi: 'Quét để nhận thông tin tuyến, cảnh báo rung khi xe sắp đến, nhắc xuống đúng bến',
    en: 'Scan for route info, vibration alert when bus arrives, get-off reminder',
    zh: '扫描获取线路信息、到站震动提醒、下车提醒',
    ko: '노선 정보, 도착 진동 알림, 하차 알림 수신',
  },
  noAppNeeded: {
    vi: 'KHÔNG CẦN CÀI ĐẶT APP — Mở trực tiếp trên trình duyệt!',
    en: 'NO APP INSTALL — Opens directly in browser!',
    zh: '无需安装应用 — 浏览器直接打开！',
    ko: '앱 설치 불필요 — 브라우저에서 바로 열기!',
  },
  scannedDone: { vi: 'ĐÃ QUÉT XONG', en: 'SCANNED', zh: '已扫描', ko: '스캔 완료' },
  helpCenter: { vi: 'TRUNG TÂM TRỢ GIÚP', en: 'HELP CENTER', zh: '帮助中心', ko: '도움말 센터' },
  helpSubtitle: {
    vi: 'Chọn chủ đề bạn cần hỗ trợ',
    en: 'Choose a topic you need help with',
    zh: '选择您需要的帮助主题',
    ko: '필요한 도움말 주제를 선택하세요',
  },
  viewGuide: { vi: 'XEM HƯỚNG DẪN', en: 'VIEW GUIDE', zh: '查看指南', ko: '가이드 보기' },
  backHome: { vi: 'QUAY VỀ TRANG CHỦ', en: 'BACK TO HOME', zh: '返回首页', ko: '홈으로' },
  a11yTitle: { vi: 'HỖ TRỢ ĐẶC BIỆT', en: 'ACCESSIBILITY', zh: '无障碍', ko: '접근성' },
  highContrast: { vi: 'Tương phản cao', en: 'High contrast', zh: '高对比度', ko: '고대비' },
  voiceNav: { vi: 'Giọng nói AI', en: 'Voice navigation', zh: '语音导航', ko: '음성 안내' },
  magnifier: { vi: 'Phóng to màn hình', en: 'Screen magnifier', zh: '屏幕放大', ko: '화면 확대' },
  screenReader: { vi: 'Đọc màn hình', en: 'Screen reader', zh: '屏幕阅读', ko: '화면 읽기' },
  voicePrompt: {
    vi: 'Hãy nói điểm đến của bạn...',
    en: 'Say your destination...',
    zh: '请说出您的目的地...',
    ko: '목적지를 말씀해 주세요...',
  },
  minutes: { vi: 'phút', en: 'min', zh: '分钟', ko: '분' },
  accessibilityBtn: { vi: 'HỖ TRỢ ĐẶC BIỆT', en: 'ACCESSIBILITY', zh: '无障碍', ko: '접근성' },
  resetIn: { vi: 'Tự động về trang chủ sau', en: 'Auto reset in', zh: '自动返回首页', ko: '자동 홈 복귀' },
  firstTrip: { vi: 'Chuyến đầu', en: 'First trip', zh: '首班', ko: '첫차' },
  lastTrip: { vi: 'Chuyến cuối', en: 'Last trip', zh: '末班', ko: '막차' },
  interval: { vi: 'Giãn cách', en: 'Interval', zh: '间隔', ko: '배차 간격' },
  regularFare: { vi: 'Tuyến thường', en: 'Regular', zh: '普通票', ko: '일반' },
  studentFare: { vi: 'Học sinh/SV', en: 'Student', zh: '学生票', ko: '학생' },
  seniorFree: { vi: 'Người cao tuổi: Miễn phí', en: 'Seniors: Free', zh: '老人免费', ko: '경로 무료' },
  searchStops: { vi: 'Tìm kiếm trạm', en: 'Search stops', zh: '搜索站点', ko: '정류장 검색' },
  close: { vi: 'Đóng', en: 'Close', zh: '关闭', ko: '닫기' },
}

export function tr(key: keyof typeof t, lang: Lang, vars?: Record<string, string | number>): string {
  let text = t[key]?.[lang] ?? t[key]?.vi ?? key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }
  return text
}

export const HELP_CATEGORIES = [
  { id: 'lookup', icon: '🗺️', titleKey: 'lookup' as const },
  { id: 'payment', icon: '🎫', titleKey: 'payment' as const },
  { id: 'schedule', icon: '⏰', titleKey: 'scheduleHelp' as const },
  { id: 'app', icon: '📱', titleKey: 'appHelp' as const },
  { id: 'disability', icon: '♿', titleKey: 'disability' as const },
  { id: 'contact', icon: '📞', titleKey: 'contact' as const },
]

export const HELP_TITLES: Record<string, Record<Lang, string>> = {
  lookup: { vi: 'Cách tra cứu tuyến xe', en: 'How to look up routes', zh: '如何查询线路', ko: '노선 조회 방법' },
  payment: { vi: 'Thanh toán & Giá vé', en: 'Payment & Fares', zh: '支付与票价', ko: '결제 및 요금' },
  scheduleHelp: { vi: 'Giờ chạy xe & Tần suất', en: 'Schedule & Frequency', zh: '运行时刻', ko: '운행 시간' },
  appHelp: { vi: 'Sử dụng App di động', en: 'Using mobile app', zh: '使用手机应用', ko: '모바일 앱 사용' },
  disability: { vi: 'Hỗ trợ người khuyết tật', en: 'Disability support', zh: '残障人士支持', ko: '장애인 지원' },
  contact: { vi: 'Liên hệ Tổng đài', en: 'Contact hotline', zh: '联系热线', ko: '고객센터' },
}

export const HELP_CONTENT: Record<string, Record<Lang, { steps: string[]; faq: string[] }>> = {
  lookup: {
    vi: {
      steps: [
        'Chọn ngôn ngữ tại màn hình chào mừng',
        'Chọn chế độ Bản đồ hoặc Danh sách',
        'Chạm điểm đến hoặc số tuyến để xem chi tiết',
        'Quét mã QR để đồng bộ sang điện thoại',
      ],
      faq: ['Tôi có thể đổi chế độ không?', 'Có — dùng nút chuyển chế độ trên màn hình bản đồ/danh sách.'],
    },
    en: {
      steps: [
        'Select language on welcome screen',
        'Choose Map or List mode',
        'Tap destination or route number for details',
        'Scan QR code to sync to your phone',
      ],
      faq: ['Can I switch modes?', 'Yes — use the mode switch button on map/list screens.'],
    },
    zh: { steps: ['选择语言', '选择地图或列表模式', '点击目的地或线路', '扫描二维码同步'], faq: ['可以切换模式吗？', '可以。'] },
    ko: { steps: ['언어 선택', '지도 또는 목록 모드', '목적지/노선 탭', 'QR 스캔'], faq: ['모드 변경 가능?', '네.'] },
  },
  payment: {
    vi: {
      steps: ['Vé lượt: 7.000đ', 'Học sinh/SV: 3.500đ (xuất trình thẻ)', 'Người cao tuổi: Miễn phí'],
      faq: ['Thanh toán bằng gì?', 'Tiền mặt, thẻ ATM, hoặc ví điện tử trên xe.'],
    },
    en: {
      steps: ['Single ticket: 7,000 VND', 'Student: 3,500 VND (ID required)', 'Seniors: Free'],
      faq: ['Payment methods?', 'Cash, ATM card, or e-wallet on board.'],
    },
    zh: { steps: ['单程7,000越南盾', '学生3,500', '老人免费'], faq: ['支付方式？', '现金、卡、电子钱包。'] },
    ko: { steps: ['일반 7,000동', '학생 3,500동', '경로 무료'], faq: ['결제 방법?', '현금, 카드, 전자지갑.'] },
  },
  schedule: {
    vi: {
      steps: ['Giờ chạy hiển thị trên màn hình chi tiết tuyến', 'Tần suất 8–20 phút tùy tuyến', 'Tuyến đêm chạy 18:00–05:00'],
      faq: ['Xe có chạy ngày lễ?', 'Hầu hết tuyến chạy bình thường, một số giảm tần suất.'],
    },
    en: {
      steps: ['Hours shown on route detail screen', 'Frequency 8–20 min depending on route', 'Night routes: 6PM–5AM'],
      faq: ['Holiday service?', 'Most routes run normally, some reduced frequency.'],
    },
    zh: { steps: ['详情页查看时刻', '间隔8-20分钟', '夜班18:00-05:00'], faq: ['节假日？', '大部分正常。'] },
    ko: { steps: ['상세 화면에서 확인', '8-20분 간격', '야간 18-05시'], faq: ['공휴일?', '대부분 정상.'] },
  },
  app: {
    vi: {
      steps: ['Quét QR tại kiosk', 'Mở link trên trình duyệt', 'Cho phép thông báo để nhận cảnh báo'],
      faq: ['Cần cài app?', 'Không — mở trực tiếp trên trình duyệt.'],
    },
    en: {
      steps: ['Scan QR at kiosk', 'Open link in browser', 'Allow notifications for alerts'],
      faq: ['Need to install app?', 'No — opens directly in browser.'],
    },
    zh: { steps: ['扫描QR', '浏览器打开', '允许通知'], faq: ['需安装？', '不需要。'] },
    ko: { steps: ['QR 스캔', '브라우저 열기', '알림 허용'], faq: ['앱 필요?', '아니요.'] },
  },
  disability: {
    vi: {
      steps: ['Chạm nút ♿ trên mọi màn hình', 'Bật tương phản cao / phóng to / đọc màn hình', 'Dùng giọng nói để tra cứu'],
      faq: ['Có hỗ trợ người khiếm thị?', 'Có — chế độ đọc màn hình và giọng nói.'],
    },
    en: {
      steps: ['Tap ♿ on any screen', 'Enable high contrast / zoom / screen reader', 'Use voice to search'],
      faq: ['Support for visually impaired?', 'Yes — screen reader and voice modes.'],
    },
    zh: { steps: ['点击♿', '开启高对比/放大/朗读', '语音查询'], faq: ['视障支持？', '有。'] },
    ko: { steps: ['♿ 탭', '고대비/확대/읽기', '음성 검색'], faq: ['시각 장애?', '지원합니다.'] },
  },
  contact: {
    vi: {
      steps: ['Tổng đài: 1900-xxxx', 'Email: support@buspass.vn', 'Website: www.buspass.vn'],
      faq: ['Giờ hỗ trợ?', '24/7 cho sự cố khẩn cấp.'],
    },
    en: {
      steps: ['Hotline: 1900-xxxx', 'Email: support@buspass.vn', 'Website: www.buspass.vn'],
      faq: ['Support hours?', '24/7 for emergencies.'],
    },
    zh: { steps: ['热线1900-xxxx', 'support@buspass.vn', 'www.buspass.vn'], faq: ['服务时间？', '24小时。'] },
    ko: { steps: ['1900-xxxx', 'support@buspass.vn', 'www.buspass.vn'], faq: ['운영 시간?', '24시간.'] },
  },
}
