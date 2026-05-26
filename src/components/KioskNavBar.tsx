import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, type LucideIcon } from 'lucide-react'
import { useKiosk } from '../context/KioskContext'
import { tr } from '../i18n/translations'

export type KioskNavLink = {
  to: string
  label: string
  icon?: LucideIcon
}

export type KioskNavBarProps = {
  /** Đường dẫn quay lại hoặc `history` */
  backTo?: string | 'history'
  /** Ghi đè hành vi nút Quay lại (vd. đóng panel con) */
  onBack?: () => void
  showHome?: boolean
  homeTo?: string
  links?: KioskNavLink[]
  className?: string
}

const btnClass =
  'btn-kiosk inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-neon-green hover:text-neon-green sm:px-4 sm:py-2.5 sm:text-base'

const btnHomeClass =
  'btn-kiosk inline-flex items-center gap-2 rounded-lg border border-neon-green/40 bg-kiosk-panel px-3 py-2 text-sm font-semibold text-neon-green transition hover:bg-neon-green hover:text-white sm:px-4 sm:py-2.5 sm:text-base'

export function KioskNavBar({
  backTo = '/mode',
  onBack,
  showHome = true,
  homeTo = '/mode',
  links = [],
  className = '',
}: KioskNavBarProps) {
  const navigate = useNavigate()
  const { lang } = useKiosk()

  const goBack = () => {
    if (onBack) {
      onBack()
      return
    }
    if (backTo === 'history') navigate(-1)
    else navigate(backTo)
  }

  const backPath = onBack || backTo === 'history' ? null : backTo
  const showHomeBtn = showHome && backPath !== homeTo

  return (
    <nav
      className={`flex flex-wrap items-center gap-2 border-b border-kiosk-border/60 pb-3 sm:gap-3 ${className}`}
      aria-label={lang === 'vi' ? 'Điều hướng' : 'Navigation'}
    >
      <button type="button" onClick={goBack} className={btnClass}>
        <ArrowLeft className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        {tr('back', lang)}
      </button>

      {showHomeBtn && (
        <button type="button" onClick={() => navigate(homeTo)} className={btnHomeClass}>
          <Home className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          {tr('homeMain', lang)}
        </button>
      )}

      {links.map((link) => (
        <NavLinkButton key={link.to} link={link} />
      ))}
    </nav>
  )
}

function NavLinkButton({ link }: { link: KioskNavLink }) {
  const navigate = useNavigate()
  const Icon = link.icon
  return (
    <button type="button" onClick={() => navigate(link.to)} className={btnClass}>
      {Icon ? <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" /> : null}
      {link.label}
    </button>
  )
}

/** Thanh điều hướng cố định dưới header trên màn bản đồ (không chiếm sidebar) */
export function KioskNavBarStrip({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`shrink-0 border-b border-kiosk-border bg-white/95 px-3 py-2 backdrop-blur-sm sm:px-4 lg:px-6 ${className}`}
    >
      {children}
    </div>
  )
}
