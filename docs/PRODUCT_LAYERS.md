# BusPass Kiosk — Product Layers & Feature Map

## 3 layers (product thinking)

| Layer | Câu hỏi người dùng | Prototype hiện tại |
|-------|---------------------|-------------------|
| **Information** | Xe nào? Khi nào đến? | Map, List, Route Detail, ETA, alerts |
| **Decision** | Đi thế nào tốt nhất? | Trip Planner A→B (nhanh / rẻ / ít đổi tuyến) |
| **Assistance** | Tôi làm sao để đi được? | Help, Accessibility, QR handoff, Services |

## 5 nhóm chức năng → màn hình / module

### 1. Thông tin chuyến xe (core)
- Lịch trình + trạm dừng → `/route/:id`
- ETA real-time (mock GPS) → Map, List, Route Detail
- Tần suất peak/off-peak → Route Detail (interval)
- Trễ / đổi lộ trình → `AlertsCompact (header)`
- Tìm tuyến A→B → `/trip`

### 2. Điều hướng & gợi ý lộ trình
- Tối ưu nhanh / rẻ / ít đổi tuyến → `/trip`
- Đi bộ tới trạm (mock) → bước trong Trip Planner
- Phương tiện kết hợp (bus + metro + Grab) → option “kết hợp” tại điểm xa
- POI quanh trạm → Map markers + danh sách điểm phổ biến

### 3. Hỗ trợ hành khách (service)
- Giá vé, cách mua vé → Help + Route Detail
- Hướng dẫn người mới → Help
- Khuyết tật → `/accessibility` + Help
- Hotline → Help footer, `/services`

### 4. Tương tác & cá nhân hóa
- QR lưu tuyến → `/qr`
- Trip planner lưu lịch trình → QR payload
- Lịch sử (đăng nhập) → *chưa có — future*
- Đa ngôn ngữ → Home

### 5. Thời gian thực & cảnh báo
- Kẹt xe / ngập → `AlertsCompact (header)` + traffic trên List/Map
- Delay / hủy → alerts
- Thời tiết → Header (nhiệt độ) + alert mưa
- Khẩn → alert priority cao

### 6. Bonus (giữ chân)
- Sạc, WiFi, tích điểm, quảng cáo, F&B → `/services`

## Luồng UX đề xuất (kiosk)

```
Home (ngôn ngữ)
  → Mode hub
       → [Ưu tiên] Trip A→B  (/trip)
       → Map visual          (/map)
       → List dễ đọc         (/list)
  → Route detail → QR sync
  Help / Accessibility / Services — mọi lúc
```

## Gap so với production

- API GPS / GTFS thật (GoBus, BusMap)
- Đăng nhập + lịch sử tuyến
- Chat hotline thật
- Thanh toán vé tại kiosk
