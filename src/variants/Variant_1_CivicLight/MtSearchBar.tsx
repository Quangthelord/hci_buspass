import { Search } from 'lucide-react'

export function MtSearchBar({
  value,
  onChange,
  placeholder = 'Search bus stop, MRT station or destination',
}: {
  value: string
  onChange: (q: string) => void
  placeholder?: string
}) {
  return (
    <div className="mt-sg-search flex items-center gap-3 px-4 py-3">
      <Search className="h-5 w-5 shrink-0 text-[#9E9E9E]" strokeWidth={2.25} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-none bg-transparent text-base text-[#212121] outline-none placeholder:text-[#9E9E9E]"
      />
    </div>
  )
}
