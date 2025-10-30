import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import SitesPage from './pages/Sites'
import AccountPage from './pages/Account'
import SiteLayout from './pages/site/SiteLayout'
import StartForm from './pages/site/StartForm'
import Records from './pages/site/Records'
import CreateItem from './pages/site/CreateItem'
import Manage from './pages/site/Manage'
import ExportPhotos from './pages/site/ExportPhotos'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sites" element={<SitesPage />} />
      <Route path="/account" element={<AccountPage />} />

      <Route path="/site/:siteId" element={<SiteLayout />}>
        <Route index element={<Navigate to="start" replace />} />
        <Route path="start" element={<StartForm />} />
        <Route path="records" element={<Records />} />
        <Route path="create" element={<CreateItem />} />
        <Route path="manage" element={<Manage />} />
        <Route path="export" element={<ExportPhotos />} />
      </Route>

      <Route path="*" element={<Navigate to="/sites" replace />} />
    </Routes>
  )
}
