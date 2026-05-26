import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { KioskProvider } from './context/KioskContext'
import { HomePage } from './pages/HomePage'
import { ModeSelectionPage } from './pages/ModeSelectionPage'
import { MapModePage } from './pages/MapModePage'
import { ListModePage } from './pages/ListModePage'
import { RouteDetailPage } from './pages/RouteDetailPage'
import { QRSyncPage } from './pages/QRSyncPage'
import { HelpPage } from './pages/HelpPage'
import { AccessibilityPage } from './pages/AccessibilityPage'
import { TripPlannerPage } from './pages/TripPlannerPage'
import { ServicesPage } from './pages/ServicesPage'
import { EinkKioskPage } from './pages/EinkKioskPage'
import { ProximityPayPage } from './pages/ProximityPayPage'
import { HciRisksPage } from './pages/HciRisksPage'
import { Phase4OverviewPage } from './pages/Phase4OverviewPage'
import { MobileAppHubPage } from './pages/mobile/MobileAppHubPage'
import { MobileApproachingPage } from './pages/mobile/MobileApproachingPage'
import { MobilePaymentPage } from './pages/mobile/MobilePaymentPage'
import { MobileGetOffPage } from './pages/mobile/MobileGetOffPage'

export default function App() {
  return (
    <BrowserRouter>
      <KioskProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/eink" element={<EinkKioskPage />} />
          <Route path="/hci" element={<HciRisksPage />} />
          <Route path="/pay" element={<ProximityPayPage />} />
          <Route path="/trip" element={<TripPlannerPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/mode" element={<ModeSelectionPage />} />
          <Route path="/map" element={<MapModePage />} />
          <Route path="/list" element={<ListModePage />} />
          <Route path="/route/:routeId" element={<RouteDetailPage />} />
          <Route path="/qr" element={<QRSyncPage />} />
          <Route path="/phase4" element={<Phase4OverviewPage />} />
          <Route path="/app" element={<MobileAppHubPage />} />
          <Route path="/app/approaching" element={<MobileApproachingPage />} />
          <Route path="/app/payment" element={<MobilePaymentPage />} />
          <Route path="/app/get-off" element={<MobileGetOffPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KioskProvider>
    </BrowserRouter>
  )
}
