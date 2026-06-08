import { Home } from 'lucide-react'
import { useKioskFlowOptional } from '../context/KioskFlowContext'

/** Nút cố định quay về màn chọn giao diện A–E — hiển thị trong mọi variant kiosk. */
export function VariantHomeButton() {
  const flow = useKioskFlowOptional()
  if (!flow || flow.phase !== 'active') return null

  return (
    <button
      type="button"
      className="variant-home-btn"
      onClick={() => flow.goToMenu()}
      aria-label="Màn hình chính"
      title="Màn hình chính"
    >
      <Home className="h-4 w-4 shrink-0" strokeWidth={2.5} />
      <span className="variant-home-btn-label">Màn hình chính</span>
    </button>
  )
}
