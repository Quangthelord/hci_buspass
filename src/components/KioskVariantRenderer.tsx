import { Component, type ReactNode } from 'react'
import type { VariantId } from '../lib/variantConfig'
import { VARIANT_COMPONENTS } from '../variants'
import { VariantHomeButton } from './VariantHomeButton'

interface Props {
  variantId: VariantId
  userId: string
}

interface ErrorState {
  hasError: boolean
  message: string
}

class VariantErrorBoundary extends Component<{ children: ReactNode }, ErrorState> {
  state: ErrorState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="kiosk-variant-error">
          <p className="kiosk-variant-error-title">Không tải được giao diện</p>
          <p className="kiosk-variant-error-msg">{this.state.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export function KioskVariantRenderer({ variantId, userId }: Props) {
  const VariantComponent = VARIANT_COMPONENTS[variantId]

  return (
    <VariantErrorBoundary key={variantId}>
      <div className="kiosk-variant-root relative">
        <VariantComponent stationId="ben-thanh" userId={userId} />
        <VariantHomeButton />
      </div>
    </VariantErrorBoundary>
  )
}
