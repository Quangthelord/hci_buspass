/** Reset D6 day/night classes left on document.body between sessions. */
export function resetKioskBodyTheme() {
  document.body.classList.remove('d6-night', 'd6-day')
  delete document.documentElement.dataset.theme
}
