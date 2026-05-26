# PHASE 4: HIGH-FIDELITY PROTOTYPES — BusPass

Tài liệu này khớp với cấu trúc báo cáo môn HCI và chỉ rõ **màn hình prototype** để chụp Hình 4.1–4.5.

**Công cụ triển khai:** React + Vite (interactive hi-fi), có thể song song export frame sang Figma.  
**Chạy demo:** `npm run dev` → http://localhost:5173/phase4

---

## 4.1. High-fidelity Prototype overview

### 4.1.1. Hướng thiết kế được lựa chọn (Chosen Direction)

Dựa trên kết quả **Formative Testing** (Paper Prototype), nhóm phát triển hi-fi theo hướng:

**Giao diện trực quan (Visual-Centric Kiosk)** + **Ứng dụng di động cảnh báo xúc giác (Context-Aware Haptic App)**.

| Nỗi đau | Giải pháp |
|---------|-----------|
| Bất an tâm lý khi chờ | Bản đồ thời gian thực, ETA minh bạch (khoảng 2–5 phút), xe trên bản đồ |
| Đứt gãy khi lên/xuống xe | QR handoff → haptic + thanh toán NFC + nhắc xuống bến |

**Hai touchpoint:**

1. **Kiosk** — `/map`, `/qr`, `/eink`
2. **Mobile App** — `/app`, `/app/approaching`, `/app/payment`, `/app/get-off`

### 4.1.2. Luồng tương tác người dùng (User Flow)

| Bước | Mô tả | URL demo |
|------|--------|----------|
| 1. Tra cứu trực quan | Chạm điểm đích trên bản đồ, đường neon, ETA linh hoạt | `/map` |
| 2. Đồng bộ lộ trình | Quét QR, đẩy chuyến sang điện thoại | `/qr` → `/app` |
| 3. Chờ đợi thảnh thơi | Máy trong túi, rung ~500m | `/app/approaching` |
| 4. Lên xe & thanh toán | NFC/BLE, pop-up màn hình khóa | `/app/payment` hoặc `/pay` |
| 5. Xuống bến an toàn | Rung dài + danh sách trạm | `/app/get-off` |

---

## 4.2. Tools Used

| Công cụ | Vai trò trong dự án |
|---------|---------------------|
| **Figma** (khuyến nghị) | UI kit kiosk + mobile, animation bổ sung, export báo cáo |
| **React prototype** (repo này) | Tương tác thật: bản đồ OSM, countdown, QR, rung `navigator.vibrate` |
| **Smartphone thật** | Test haptic khi mở `/app/*` trên điện thoại (HTTPS hoặc localhost qua LAN) |

---

## 4.3. Features of Prototype

### Tính năng 1 — Bản đồ định tuyến thời gian thực (Kiosk)

**Hình 4.1** — Chụp màn hình: `http://localhost:5173/map`

- Bản đồ OpenStreetMap thật (khu Q.1, TP.HCM)
- Icon xe di chuyển (mock GPS)
- Đường chỉ dẫn neon khi chọn đích
- ETA: *"Tuyến 150: 2–5 phút (Đang ùn tắc…)"* — component `TransparencyEta`

**Đoạn mô tả báo cáo (copy):**

> Màn hình Kiosk loại bỏ bảng số liệu chằng chịt, thay bằng bản đồ động. Xe buýt hiển thị icon theo GPS. Bộ đếm thời gian linh hoạt (vd. 2–5 phút kèm trạng thái ùn tắc) minh bạch hóa sai số và xây dựng lòng tin.

---

### Tính năng 2 — Đồng bộ hóa lộ trình "Một chạm" (Kiosk → App)

**Hình 4.2** — Chụp: `http://localhost:5173/qr`

- QR động chứa tuyến, đích, trạm, URL
- Nút **ĐÃ QUÉT XONG → App**

**Đoạn mô tả:**

> Sau tra cứu, Kiosk tạo mã QR động. Người dùng quét để "gói" lộ trình mang theo, loại bỏ nhập lại điểm đến trên điện thoại.

---

### Tính năng 3 — Vòng nhận thức ngoại vi (Mobile App)

**Hình 4.3** — Chụp: `http://localhost:5173/app/approaching`

- Sóng rung (HapticWave)
- Thông báo *"Xe đang tiến vào trạm"*
- Rung thật nếu trình duyệt hỗ trợ

---

### Tính năng 4 — Thanh toán rảnh tay (Mobile App)

**Hình 4.4** — Chụp: `http://localhost:5173/app/payment`

- Giao diện màn hình khóa + pop-up xanh *"Thanh toán thành công 7.000đ — Tuyến XX"*
- Kiosk mô phỏng thêm: `/pay`

---

### Tính năng 5 — Rung nhắc xuống bến (Mobile App)

**Hình 4.5** — Chụp: `http://localhost:5173/app/get-off`

- Danh sách trạm dọc (to-do style)
- Trạm kế tiếp highlight + rung mạnh

---

## Checklist chụp hình cho báo cáo

- [ ] Hình 4.1 — `/map` (đã chọn điểm đích, có đường neon)
- [ ] Hình 4.2 — `/qr` (QR + thông tin tuyến)
- [ ] Hình 4.3 — `/app/approaching`
- [ ] Hình 4.4 — `/app/payment`
- [ ] Hình 4.5 — `/app/get-off`
- [ ] (Tuỳ chọn) Luồng tổng — `/phase4`

---

## Ghi chú học thuật

Prototype tương tác này **bổ sung** cho Figma: phù hợp user testing có bản đồ thật và rung thật trên điện thoại. Trong báo cáo nên ghi rõ: *"Hi-fi prototype được triển khai bằng Figma [UI static/animation] và prototype web tương tác [validation kỹ thuật]."*
