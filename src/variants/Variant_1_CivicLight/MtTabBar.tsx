type Tab = 'bus' | 'mrt' | 'journey'

const TABS: { id: Tab; label: string }[] = [
  { id: 'bus', label: 'Bus' },
  { id: 'mrt', label: 'MRT / LRT' },
  { id: 'journey', label: 'Journey' },
]

export function MtTabBar({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav className="mt-sg-tabs flex shrink-0" aria-label="Transport mode">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`mt-sg-tab flex-1 text-sm ${active === tab.id ? 'mt-sg-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export type { Tab }
