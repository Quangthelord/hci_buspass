import { Search } from 'lucide-react'

const SIZE_CLASS = {
  normal: 'py-3 text-base',
  large: 'py-5 text-xl',
} as const

export function SearchBar({
  onSearch,
  placeholder = 'Bạn muốn đến đâu?',
  size = 'normal',
}: {
  onSearch: (query: string) => void
  placeholder?: string
  size?: keyof typeof SIZE_CLASS
}) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className={`w-full rounded-xl border-2 border-kiosk-border bg-white pl-12 pr-4 outline-none focus:border-neon-green ${SIZE_CLASS[size]}`}
      />
    </label>
  )
}
