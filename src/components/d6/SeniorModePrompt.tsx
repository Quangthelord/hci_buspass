export function SeniorModePrompt({
  visible,
  onAccept,
  onDismiss,
}: {
  visible: boolean
  onAccept: () => void
  onDismiss: () => void
}) {
  if (!visible) return null

  return (
    <div
      className="d6-senior-prompt fixed inset-x-0 bottom-0 z-50 border-t-2 px-5 py-4"
      role="dialog"
      aria-label="Gợi ý chế độ chữ lớn"
    >
      <p className="d6-senior-prompt-text mb-4 font-semibold">
        Bạn có muốn dùng chế độ chữ lớn không?
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onAccept} className="d6-btn-primary min-h-14 flex-1 px-6">
          Có
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="d6-btn-secondary min-h-14 flex-1 px-6"
        >
          Không, cảm ơn
        </button>
      </div>
    </div>
  )
}
