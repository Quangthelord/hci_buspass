import type { Lang } from '../data/mockData'

export type ProductLayer = 'information' | 'decision' | 'assistance'

const LABELS: Record<ProductLayer, Record<Lang, string>> = {
  information: { vi: 'Thông tin', en: 'Information', zh: '信息', ko: '정보' },
  decision: { vi: 'Quyết định', en: 'Decision', zh: '决策', ko: '결정' },
  assistance: { vi: 'Hỗ trợ', en: 'Assistance', zh: '协助', ko: '지원' },
}

const COLORS: Record<ProductLayer, string> = {
  information: 'border-green-600 text-green-700 bg-green-50',
  decision: 'border-green-500 text-green-600 bg-green-50',
  assistance: 'border-green-700 text-green-800 bg-green-100',
}

export function ProductLayerTag({ layer, lang }: { layer: ProductLayer; lang: Lang }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${COLORS[layer]}`}
    >
      {LABELS[layer][lang]}
    </span>
  )
}
