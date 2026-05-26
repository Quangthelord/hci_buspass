# BusPass — Giải pháp HCI & Phản biện rủi ro

Tài liệu ánh xạ **giải pháp thiết kế tương tác** trong báo cáo môn HCI với **màn hình prototype** có thể demo.

## A. Kiosk tra cứu thích ứng ngữ cảnh (Context-Aware)

| Ý tưởng thiết kế | Cách thể hiện trong prototype |
|------------------|-------------------------------|
| Màn E-ink không chói, tiết kiệm điện | Route **`/eink`** — giao diện grayscale, tương phản cao, không neon |
| Chỉ tuyến sắp đến ≤15 phút + đếm ngược | Danh sách lọc + **`RouteCountdown`** |
| Chạm/nói điểm đến → 1 tuyến + bản đồ, ẩn tuyến khác | Chế độ “focus” trên `/eink` và `/map` khi đã chọn đích |
| Nút vật lý / Remote UI qua QR | Footer nút ảo + mục **Remote UI** sau quét QR (`/qr`) |

## B. Vùng nhận thức ngoại vi (Peripheral Awareness)

| Ý tưởng | Prototype |
|---------|-----------|
| QR liên kết chuyến, không cần app | `/qr` |
| Rung nhẹ @500m, rung mạnh khi tấp lề | **`HapticTimeline`** trên `/qr` + `navigator.vibrate` (nếu thiết bị hỗ trợ) |
| Không cần nhìn màn hình liên tục | Copy UX + demo rung |

## C. Thanh toán tầm ngắn (Proximity Payment)

| Ý tưởng | Prototype |
|---------|-----------|
| NFC / BLE khi lên xe, hai tay bám vịn | Route **`/pay`** — mô phỏng “Đã thanh toán 7.000đ” |

## Phản biện rủi ro → Giải pháp HCI

### Rủi ro 1 — Phá hoại / bôi bẩn màn cảm ứng

- **Phản biện:** Cảm ứng ngoài trời dễ hỏng, vẽ bậy.
- **Giải pháp:** Nút kim loại + **Remote UI** (điện thoại làm bàn phím sau QR).
- **Demo:** `/hci` mục 1 · `/eink` (nút ảo) · `/qr` (điều khiển từ xa).

### Rủi ro 2 — Sai lệch ETA, mất tin hệ thống

- **Phản biện:** Báo 2 phút nhưng kẹt 10 phút → distrust.
- **Giải pháp:** **Transparency in uncertainty** — khoảng thời gian + lý do kẹt + xe trên bản đồ.
- **Demo:** `TransparencyEta` trên List/Map/Route · bản đồ Leaflet · alert banner.

### Rủi ro 3 — An toàn & riêng tư (cướp giật khi cầm phone)

- **Phản biện:** Phải cầm phone tại nơi công cộng.
- **Giải pháp:** **Omnichannel** — haptic + **loa hướng tính** tại ghế (Directional Audio).
- **Demo:** `/hci` mục 3 · `/qr` (cất máy) · **`DirectionalAudioDemo`**.

## Luồng demo gợi ý cho giảng viên (3 phút)

1. `/eink` — countdown tuyến 150, chọn “Chợ Bến Thành” → chỉ 1 tuyến.
2. `/map` — ETA “2–5 phút (kẹt CMT8)” + xe trên bản đồ.
3. `/qr` — quét, bật demo rung, Remote UI.
4. `/pay` — mô phỏng NFC lên xe.
5. `/hci` — tóm tắt 3 rủi ro + giải pháp.
