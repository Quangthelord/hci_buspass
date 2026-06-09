import { Headphones, List, Map, Type, Volume2 } from 'lucide-react'
import { useKiosk } from '../../context/KioskContext'

/** Nút hỗ trợ hiển thị sẵn trong vùng chạm — không dùng menu ẩn. */
export function MapTouchA11yBar({
  lang = 'vi',
  listModeActive = false,
  onHelp,
  onList,
  onTrack,
}: {
  lang?: 'vi' | 'en'
  listModeActive?: boolean
  onHelp: () => void
  onList: () => void
  onTrack?: (target: string) => void
}) {
  const { a11y, setA11y } = useKiosk()
  const isVi = lang === 'vi'

  const track = (t: string) => onTrack?.(t)

  const cycleTextSize = () => {
    if (!a11y.largeText) {
      setA11y({ largeText: true })
      document.body.classList.remove('a11y-compact-text')
      track('touch-a11y-text-large')
    } else {
      setA11y({ largeText: false })
      document.body.classList.add('a11y-compact-text')
      track('touch-a11y-text-small')
    }
  }

  const chips = [
    {
      id: 'text',
      label: a11y.largeText
        ? isVi
          ? 'Chữ lớn ✓'
          : 'Large text ✓'
        : isVi
          ? 'Chữ lớn'
          : 'Large text',
      active: a11y.largeText,
      icon: <Type className="h-4 w-4" />,
      onClick: cycleTextSize,
    },
    {
      id: 'audio',
      label: a11y.screenReader
        ? isVi
          ? 'Âm thanh ✓'
          : 'Audio ✓'
        : isVi
          ? 'Âm thanh'
          : 'Audio',
      active: a11y.screenReader,
      icon: <Volume2 className="h-4 w-4" />,
      onClick: () => {
        const next = !a11y.screenReader
        setA11y({ screenReader: next })
        track(next ? 'touch-a11y-audio-on' : 'touch-a11y-audio-off')
      },
    },
    {
      id: 'list',
      label: listModeActive
        ? isVi
          ? 'Bản đồ'
          : 'Map'
        : isVi
          ? 'Danh sách'
          : 'List',
      active: listModeActive,
      icon: listModeActive ? <Map className="h-4 w-4" /> : <List className="h-4 w-4" />,
      onClick: () => {
        track(listModeActive ? 'touch-map' : 'touch-list')
        onList()
      },
    },
    {
      id: 'help',
      label: isVi ? 'Trợ giúp' : 'Help',
      active: false,
      icon: <Headphones className="h-4 w-4" />,
      onClick: () => {
        track('touch-help')
        onHelp()
      },
    },
  ]

  return (
    <div className="d6-touch-a11y flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onClick}
          className={`d6-touch-chip flex min-h-11 items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${
            chip.active
              ? 'border-neon-green bg-neon-green text-white'
              : 'border-kiosk-border bg-white text-gray-800'
          }`}
        >
          {chip.icon}
          {chip.label}
        </button>
      ))}
    </div>
  )
}
