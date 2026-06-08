# BusPass — Hướng dẫn test A/B (6 variants)

Tài liệu dành cho **điều phối viên** chạy phiên thử nghiệm kiosk BusPass.

## 1. Thiết lập phiên test

### Mở admin (không cho người tham gia thấy)

| Cách | Hành động |
|------|-----------|
| URL trực tiếp | Mở `/admin` trên trình duyệt kiosk |
| Cử chỉ ẩn | **Triple-tap** góc trên-phải màn hình trong 1 giây |

### Mở khóa admin

1. Nhập PIN: **`2025`**
2. Chọn **hướng hiển thị**: Dọc 1080×1920 (mặc định) hoặc Ngang 1920×1080
3. Chọn **variant** (A–F) → bấm **Chọn variant này**
4. Kiosk quay về `/` — màn hình chờ hiện **Chạm để bắt đầu**

### Bắt đầu phiên người tham gia

1. Người tham gia **chạm** màn hình chờ ("Chạm để bắt đầu")
2. Màn hình **menu 6 giao diện** (A–F) hiện ra — người tham gia (hoặc điều phối viên) **chạm chọn một phiên bản**
3. Hệ thống tạo **sessionId** mới và tải giao diện đã chọn
4. Giao nhiệm vụ (xem mục 4)

> Admin vẫn có thể chọn variant trước tại `/admin` để tham khảo; tại kiosk, người tham gia luôn chọn lại qua menu sau màn hình chờ.

> **Mẹo:** Gán `participant-01`, `participant-02`, … trong `sessionStorage.buspass_userId` (DevTools) trước phiên nếu cần đối chiếu dữ liệu.

## 2. Các variant

| ID | Tên | Phong cách |
|----|-----|------------|
| A | Civic Light | Singapore — danh sách, sáng |
| B | Dark Transit | Citymapper — tối, map |
| C | Warm Wayfinding | Transperth — ấm, minh bạch ETA |
| D | Metro Minimal | Moovit — từng bước, tập trung |
| E | High Contrast | WCAG AAA — tương phản cao |
| F | BusPass Signature | D6 — sản phẩm chính (mặc định) |

## 3. Metrics được ghi nhận

Mỗi sự kiện lưu trong `localStorage` (`buspass_telemetry`):

| eventType | Ý nghĩa |
|-----------|---------|
| `task_start` | Bắt đầu nhiệm vụ |
| `click` | Tương tác đúng mục tiêu |
| `misclick` | Chạm nhầm |
| `hesitation` | Chạm rồi dừng ≥3 giây |
| `step_complete` | Hoàn thành bước (variant D) |
| `task_complete` | Hoàn thành nhiệm vụ |
| `task_abandon` | Bỏ dở — tự ghi khi idle 60 giây (có `task_start` chưa hoàn thành) |

Trường bổ sung: `sessionId`, `variantId`, `target`, `taskDurationMs`, `success`, `seniorModeActivated`, `urgencyLevelAtComplete`.

### Tóm tắt trên admin

- **Tổng phiên** — số `sessionId` duy nhất
- **TG hoàn thành TB** — trung bình `taskDurationMs`
- **Tỷ lệ thành công** — % `task_complete` với `success: true`
- **Misclick** — tỷ lệ `misclick` / (click + misclick)
- **Senior mode** — % phiên kích hoạt chế độ chữ lớn (variant F)

## 4. Kịch bản cho người điều phối

Đọc nguyên văn cho người tham gia:

> *"Bạn đang đứng ở trạm Bến Thành. Hãy tìm xe buýt đến Suối Tiên."*

**Quan sát (không gợi ý):**

- Mất bao lâu để hoàn thành?
- Có chạm nhầm không?
- Có đọc được ETA / trạng thái trễ không?
- Có nhận prompt chữ lớn không? (variant F, sau 3s do dự)

**Đáp án đúng:** Tuyến **01** (Bến Thành ↔ Suối Tiên) — `task_complete` chỉ ghi `success: true` khi người dùng tìm được tuyến này.

**Sau mỗi phiên:** để kiosk idle **60 giây** → `task_abandon` (nếu chưa xong) + màn hình chờ tự bật lại.

## 5. Xuất dữ liệu sau test

1. Mở `/admin` → PIN `2025`
2. Bấm **Xuất dữ liệu CSV** — file `buspass-telemetry-[timestamp].csv`
3. (Tuỳ chọn) **Export JSON** — bản đầy đủ kèm summary

### Cột CSV

`sessionId`, `variantId`, `timestamp`, `eventType`, `target`, `userId`, `taskDurationMs`, `success`, `seniorModeActivated`, `urgencyLevelAtComplete`, `step`, `stepName`

## 6. Mô phỏng realtime

`mockRealtime.ts` cập nhật mỗi 3 giây:

- Xe tiến về trạm (1.000m → 0m), urgency Level 1/2/3
- Xe rời bến → reset 1.500m
- Mỗi 2 phút, 20% xác suất trễ ngẫu nhiên 2–8 phút (lý do HCMC)

## 7. URL nhanh

| URL | Mục đích |
|-----|----------|
| `/` | Kiosk test (variant từ admin) |
| `/admin` | Điều phối viên |
| `/kiosk` | Luồng welcome gốc (ngôn ngữ) |
| `/map` | D6 trong kiosk shell (screensaver + telemetry) |
| `/signature` | D6 trong kiosk shell (tương tự `/map`) |
