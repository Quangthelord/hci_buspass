import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { KioskProvider } from './context/KioskContext'
import { PageLoader } from './components/PageLoader'
import AdminPage from './app/admin/page'
import BusPassSignaturePage from './app/page'
import { HomePage } from './pages/HomePage'
import { ModeSelectionPage } from './pages/ModeSelectionPage'
import { VariantTestPage } from './pages/VariantTestPage'

const MapModePage = lazy(() => import('./pages/MapModePage').then((m) => ({ default: m.MapModePage })))
const ListModePage = lazy(() => import('./pages/ListModePage').then((m) => ({ default: m.ListModePage })))
const RouteDetailPage = lazy(() => import('./pages/RouteDetailPage').then((m) => ({ default: m.RouteDetailPage })))
const QRSyncPage = lazy(() => import('./pages/QRSyncPage').then((m) => ({ default: m.QRSyncPage })))
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage').then((m) => ({ default: m.TripPlannerPage })))
const HelpPage = lazy(() => import('./pages/HelpPage').then((m) => ({ default: m.HelpPage })))
const AccessibilityPage = lazy(() =>
  import('./pages/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })),
)
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const EinkKioskPage = lazy(() => import('./pages/EinkKioskPage').then((m) => ({ default: m.EinkKioskPage })))
const ProximityPayPage = lazy(() => import('./pages/ProximityPayPage').then((m) => ({ default: m.ProximityPayPage })))
const HciRisksPage = lazy(() => import('./pages/HciRisksPage').then((m) => ({ default: m.HciRisksPage })))
const Phase4OverviewPage = lazy(() =>
  import('./pages/Phase4OverviewPage').then((m) => ({ default: m.Phase4OverviewPage })),
)
const MobileTripPage = lazy(() =>
  import('./pages/mobile/MobileTripPage').then((m) => ({ default: m.MobileTripPage })),
)
const MobileAppHubPage = lazy(() =>
  import('./pages/mobile/MobileAppHubPage').then((m) => ({ default: m.MobileAppHubPage })),
)
const MobileApproachingPage = lazy(() =>
  import('./pages/mobile/MobileApproachingPage').then((m) => ({ default: m.MobileApproachingPage })),
)
const MobilePaymentPage = lazy(() =>
  import('./pages/mobile/MobilePaymentPage').then((m) => ({ default: m.MobilePaymentPage })),
)
const MobileGetOffPage = lazy(() =>
  import('./pages/mobile/MobileGetOffPage').then((m) => ({ default: m.MobileGetOffPage })),
)

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter>
      <KioskProvider>
        <Routes>
          <Route path="/" element={<VariantTestPage />} />
          <Route path="/kiosk" element={<HomePage />} />
          <Route
            path="/signature"
            element={<BusPassSignaturePage stationId="ben-thanh" userId="participant-01" />}
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mode" element={<ModeSelectionPage />} />
          <Route
            path="/map"
            element={
              <LazyPage>
                <MapModePage />
              </LazyPage>
            }
          />
          <Route
            path="/list"
            element={
              <LazyPage>
                <ListModePage />
              </LazyPage>
            }
          />
          <Route
            path="/route/:routeId"
            element={
              <LazyPage>
                <RouteDetailPage />
              </LazyPage>
            }
          />
          <Route
            path="/qr"
            element={
              <LazyPage>
                <QRSyncPage />
              </LazyPage>
            }
          />
          <Route
            path="/trip"
            element={
              <LazyPage>
                <TripPlannerPage />
              </LazyPage>
            }
          />
          <Route
            path="/services"
            element={
              <LazyPage>
                <ServicesPage />
              </LazyPage>
            }
          />
          <Route
            path="/help"
            element={
              <LazyPage>
                <HelpPage />
              </LazyPage>
            }
          />
          <Route
            path="/accessibility"
            element={
              <LazyPage>
                <AccessibilityPage />
              </LazyPage>
            }
          />
          <Route
            path="/eink"
            element={
              <LazyPage>
                <EinkKioskPage />
              </LazyPage>
            }
          />
          <Route
            path="/pay"
            element={
              <LazyPage>
                <ProximityPayPage />
              </LazyPage>
            }
          />
          <Route
            path="/hci"
            element={
              <LazyPage>
                <HciRisksPage />
              </LazyPage>
            }
          />
          <Route
            path="/phase4"
            element={
              <LazyPage>
                <Phase4OverviewPage />
              </LazyPage>
            }
          />
          <Route
            path="/m"
            element={
              <LazyPage>
                <MobileTripPage />
              </LazyPage>
            }
          />
          <Route
            path="/app"
            element={
              <LazyPage>
                <MobileAppHubPage />
              </LazyPage>
            }
          />
          <Route
            path="/app/approaching"
            element={
              <LazyPage>
                <MobileApproachingPage />
              </LazyPage>
            }
          />
          <Route
            path="/app/payment"
            element={
              <LazyPage>
                <MobilePaymentPage />
              </LazyPage>
            }
          />
          <Route
            path="/app/get-off"
            element={
              <LazyPage>
                <MobileGetOffPage />
              </LazyPage>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KioskProvider>
    </BrowserRouter>
  )
}
