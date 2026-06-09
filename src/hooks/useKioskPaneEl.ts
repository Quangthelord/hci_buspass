import { useEffect, useState } from 'react'

function findKioskPane() {
  return typeof document !== 'undefined' ? document.querySelector('.kiosk-active-pane') : null
}

/** DOM node của vùng hiển thị kiosk (màn hình trong bezel). */
export function useKioskPaneEl() {
  const [pane, setPane] = useState<Element | null>(findKioskPane)

  useEffect(() => {
    if (!pane) setPane(findKioskPane())
  }, [pane])

  return pane
}
