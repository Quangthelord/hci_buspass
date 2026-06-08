export function UrgencyArrivalBanner({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div
      className="d6-urgency-banner fixed inset-x-3 top-16 z-50 rounded-lg text-center font-bold"
      role="alert"
    >
      Xe đang vào bến! Chuẩn bị xuống
    </div>
  )
}
