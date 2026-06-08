/** HCMC destinations for Step 1 autocomplete. */
export const HCMC_LOCATIONS = [
  'Suối Tiên',
  'Đại học Quốc gia',
  'Đại học Bách Khoa',
  'Chợ Lớn',
  'Công viên Phần Lăng',
  'Khu CN Tân Thuận',
  'Ngã tư Bình Triệu',
  'Bến xe Miền Đông',
  'Nhà Thờ Đức Bà',
  'Dinh Độc Lập',
  'An Sương',
  'Chợ Bến Thành',
  'Công viên Tao Đàn',
  'Ngã tư Hàng Xanh',
] as const

export function filterLocations(query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return [...HCMC_LOCATIONS]
  return HCMC_LOCATIONS.filter((loc) => loc.toLowerCase().includes(q))
}
