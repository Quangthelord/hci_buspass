export function UrgencyArrivalBanner({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div
      className="d6-urgency-banner fixed inset-x-4 top-20 z-50 rounded-xl px-6 py-5 text-center font-bold"
      role="alert"
    >
      Xe đang vào bến! Chuẩn bị xuống
    </div>
  )
}
