import { Home, MapPin, Star, MoreHorizontal } from 'lucide-react'

const ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'near', label: 'Near By', icon: MapPin, active: true },
  { id: 'fav', label: 'Favourites', icon: Star },
  { id: 'more', label: 'More', icon: MoreHorizontal },
] as const

export function MtBottomNav() {
  return (
    <nav className="mt-sg-bottom-nav flex shrink-0 justify-around" aria-label="Main navigation">
      {ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            type="button"
            className={`mt-sg-nav-item ${'active' in item && item.active ? 'mt-sg-nav-item--active' : ''}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
