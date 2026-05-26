export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center gap-3 text-neon-green">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-kiosk-border border-t-neon-green" />
      <p className="text-sm font-medium text-kiosk-muted">BusPass…</p>
    </div>
  )
}
