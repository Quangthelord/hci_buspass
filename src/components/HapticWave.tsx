/** Sóng rung mô phỏng — Hình 4.3 */
export function HapticWave({ active = true }: { active?: boolean }) {
  if (!active) return null
  return (
    <div className="relative flex h-32 items-center justify-center">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
            className="absolute rounded-full border-2 border-green-400"
          style={{
            width: 40 + i * 36,
            height: 40 + i * 36,
            animation: `hapticRing 1.8s ease-out infinite`,
            animationDelay: `${i * 0.35}s`,
            opacity: 0.6 - i * 0.15,
          }}
        />
      ))}
      <span className="relative z-10 text-4xl">📳</span>
    </div>
  )
}
